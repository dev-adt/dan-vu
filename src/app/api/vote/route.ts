import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Server-side in-memory lock to prevent race conditions from rapid double-clicking
const activeVoteLocks = new Set<string>();
const recentIpVotes: { ip: string; timestamp: number }[] = [];

export async function POST(req: NextRequest) {
  try {
    const { teamId, fingerprint } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Mã tiết mục (teamId) là bắt buộc.' }, { status: 400 });
    }

    // 1. Get Authorization Bearer Token from headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Bạn phải đăng nhập để thực hiện bình chọn.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // 2. Validate session with Supabase Auth
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' }, { status: 401 });
    }

    // 2b. Block Judge accounts from public voting
    if (user.user_metadata?.role === 'judge') {
      return NextResponse.json({ error: 'Tài khoản Giám khảo không được thực hiện bình chọn khán giả.' }, { status: 403 });
    }

    const { data: judgeRecord } = await supabaseAdmin
      .from('judges')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (judgeRecord) {
      return NextResponse.json({ error: 'Tài khoản Giám khảo không được thực hiện bình chọn khán giả.' }, { status: 403 });
    }

    const voterEmail = user.email;
    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    let voterIp = rawIp.split(',')[0].trim();
    if (!voterIp || voterIp === '::1') {
      voterIp = '127.0.0.1';
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lockKey = `${voterEmail}_${teamId}_${today}`;

    // Mutex Lock: If a vote request for this email + team + day is currently processing, block concurrent double click
    if (activeVoteLocks.has(lockKey)) {
      return NextResponse.json(
        { error: 'Hệ thống đang xử lý lượt bình chọn của bạn, vui lòng không nhấn liên tục!' },
        { status: 429 }
      );
    }

    activeVoteLocks.add(lockKey);

    try {
      // 3. Check rapid IP voting (fraud detection: > 3 votes per 10 seconds from same IP)
      const now = Date.now();
      recentIpVotes.push({ ip: voterIp, timestamp: now });
      const cutoff = now - 60000;
      while (recentIpVotes.length > 0 && recentIpVotes[0].timestamp < cutoff) {
        recentIpVotes.shift();
      }

      const votesFromSameIpRecently = recentIpVotes.filter(
        (v) => v.ip === voterIp && v.timestamp > now - 10000
      ).length;

      const isSuspiciousIp = votesFromSameIpRecently > 3;

      // 4. Calculate dynamic score decay based on attempt count today for this email & team
      const startOfToday = `${today}T00:00:00.000Z`;
      const endOfToday = `${today}T23:59:59.999Z`;

      const { data: previousAttempts } = await supabaseAdmin
        .from('ballots')
        .select('id, is_valid')
        .eq('voter_email', voterEmail)
        .eq('team_id', teamId)
        .gte('voted_at', startOfToday)
        .lte('voted_at', endOfToday);

      const attemptCount = (previousAttempts?.length || 0) + 1;

      // Progressive Score Decay Formula:
      // n = 1 -> 1.00 (Hợp lệ, An toàn)
      // n = 2 -> 0.85 (Hợp lệ, Giảm nhẹ 0.15 cho lỡ bấm nhầm/mạng yếu)
      // n = 3 -> 0.65 (Nghi vấn, Giảm 0.35, cho phép Admin Hủy Vote)
      // n = 4 -> 0.40 (Nghi vấn, Giảm 0.60)
      // n >= 5 -> Decays down to 0.05 (Tự động Hủy Vote)
      let calculatedScore = 1.0;
      if (attemptCount === 2) {
        calculatedScore = 0.85;
      } else if (attemptCount === 3) {
        calculatedScore = 0.65;
      } else if (attemptCount === 4) {
        calculatedScore = 0.40;
      } else if (attemptCount >= 5) {
        calculatedScore = Math.max(0.05, Number((1.0 - 0.20 * Math.pow(attemptCount - 1, 1.2)).toFixed(2)));
      }

      // Penalize IP spamming if > 3 votes in 10 sec
      if (isSuspiciousIp) {
        calculatedScore = Math.min(calculatedScore, 0.20);
      }

      // Automatically invalidate if score < 0.30 or if repeat attempt > 1 when valid vote already recorded
      const alreadyHasValidVote = (previousAttempts || []).some((b: any) => b.is_valid);
      const isValidBallot = calculatedScore >= 0.30 && !alreadyHasValidVote;

      // Always log ballot to audit log for admin tracking
      const { error: insertError } = await supabaseAdmin.from('ballots').insert({
        team_id: teamId,
        voter_ip: voterIp,
        voter_fingerprint: fingerprint || 'canvas_hash_mock_fingerprint',
        voter_email: voterEmail,
        recaptcha_score: calculatedScore,
        is_valid: isValidBallot,
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return NextResponse.json(
          { error: `Lỗi lưu phiếu bầu: ${insertError.message || 'Không thể ghi nhận phiếu'}` },
          { status: 500 }
        );
      }

      if (!isValidBallot) {
        if (alreadyHasValidVote) {
          return NextResponse.json(
            { error: 'Bạn đã bình chọn cho tiết mục này hôm nay rồi. Vui lòng quay lại vào ngày mai!' },
            { status: 429 }
          );
        } else {
          return NextResponse.json(
            { error: 'Phát hiện thao tác bình chọn bất thường từ địa chỉ IP/Thiết bị này.' },
            { status: 429 }
          );
        }
      }

      return NextResponse.json({ success: true });
    } finally {
      // Release lock after processing completes
      activeVoteLocks.delete(lockKey);
    }
  } catch (err: any) {
    console.error('Vote processing internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
