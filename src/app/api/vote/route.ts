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

      // 4. Check if a ballot has already been cast today for this email + team
      const startOfToday = `${today}T00:00:00.000Z`;
      const endOfToday = `${today}T23:59:59.999Z`;

      const { data: previousAttempts } = await supabaseAdmin
        .from('ballots')
        .select('id, is_valid, recaptcha_score')
        .eq('voter_email', voterEmail)
        .eq('team_id', teamId)
        .gte('voted_at', startOfToday)
        .lte('voted_at', endOfToday);

      if (previousAttempts && previousAttempts.length > 0) {
        const existingBallot = previousAttempts[0];
        const currentScore = existingBallot.recaptcha_score !== undefined && existingBallot.recaptcha_score !== null 
          ? Number(existingBallot.recaptcha_score) 
          : 1.0;

        // Progressive Score Decay for the existing row:
        // Original: 1.00 (Valid)
        // 2nd click -> decays to 0.85 (Valid)
        // 3rd click -> decays to 0.65 (Flagged / Suspect)
        // 4th click -> decays to 0.40 (Flagged / Suspect)
        // 5th+ click -> decays to 0.05 (Voided / Invalid)
        let calculatedScore = 1.0;
        if (currentScore >= 0.90) {
          calculatedScore = 0.85;
        } else if (currentScore >= 0.75) {
          calculatedScore = 0.65;
        } else if (currentScore >= 0.50) {
          calculatedScore = 0.40;
        } else {
          calculatedScore = 0.05;
        }

        // Penalize IP spamming if > 3 votes in 10 sec
        if (isSuspiciousIp) {
          calculatedScore = Math.min(calculatedScore, 0.20);
        }

        // Automatically invalidate the original vote if score falls below 0.30
        const newIsValid = calculatedScore >= 0.30 && existingBallot.is_valid;

        // Update the existing ballot in the database (decaying its score and updating status)
        const { error: updateError } = await supabaseAdmin
          .from('ballots')
          .update({
            recaptcha_score: calculatedScore,
            is_valid: newIsValid,
            voter_ip: voterIp,
            voter_fingerprint: fingerprint || 'canvas_hash_mock_fingerprint',
          })
          .eq('id', existingBallot.id);

        if (updateError) {
          console.error('Database update error:', updateError);
          return NextResponse.json(
            { error: `Lỗi cập nhật phiếu bầu: ${updateError.message}` },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { error: 'Bạn đã bình chọn cho tiết mục này hôm nay rồi. Vui lòng quay lại vào ngày mai!' },
          { status: 429 }
        );
      }

      // 5. First time voting today: Log a new valid ballot
      let calculatedScore = 1.0;
      if (isSuspiciousIp) {
        calculatedScore = 0.20;
      }
      const isValidBallot = calculatedScore >= 0.30;

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
        return NextResponse.json(
          { error: 'Phát hiện thao tác bình chọn bất thường từ địa chỉ IP/Thiết bị này.' },
          { status: 429 }
        );
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
