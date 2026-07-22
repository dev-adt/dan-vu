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
      // 3. Check rapid IP voting (fraud detection: > 5 votes per 10 seconds from same IP)
      const now = Date.now();
      recentIpVotes.push({ ip: voterIp, timestamp: now });
      // Keep last 60 seconds of IP history
      const cutoff = now - 60000;
      while (recentIpVotes.length > 0 && recentIpVotes[0].timestamp < cutoff) {
        recentIpVotes.shift();
      }

      const votesFromSameIpRecently = recentIpVotes.filter(
        (v) => v.ip === voterIp && v.timestamp > now - 10000
      ).length;

      const isSuspiciousIp = votesFromSameIpRecently > 3;

      // 4. Enforce the limit: 1 vote/day for each team per user email
      const startOfToday = `${today}T00:00:00.000Z`;
      const endOfToday = `${today}T23:59:59.999Z`;

      const { data: existingBallot, error: queryError } = await supabaseAdmin
        .from('ballots')
        .select('id')
        .eq('voter_email', voterEmail)
        .eq('team_id', teamId)
        .gte('voted_at', startOfToday)
        .lte('voted_at', endOfToday)
        .eq('is_valid', true)
        .maybeSingle();

      if (queryError) {
        console.error('Database query error:', queryError);
        return NextResponse.json({ error: 'Lỗi kiểm tra lịch sử bình chọn.' }, { status: 500 });
      }

      if (existingBallot || isSuspiciousIp) {
        // Log suspicious / duplicate click attempt to audit logs with is_valid = false
        await supabaseAdmin.from('ballots').insert({
          team_id: teamId,
          voter_ip: voterIp,
          voter_fingerprint: fingerprint || 'canvas_hash_mock_fingerprint',
          voter_email: voterEmail,
          recaptcha_score: isSuspiciousIp ? 0.12 : 0.25,
          is_valid: false, // Flagged as Fraud / Invalid attempt
        });

        if (existingBallot) {
          return NextResponse.json(
            { error: 'Bạn đã bình chọn cho tiết mục này hôm nay rồi. Vui lòng quay lại vào ngày mai!' },
            { status: 429 }
          );
        } else {
          return NextResponse.json(
            { error: 'Phát hiện thao tác bình chọn bất thường từ địa chỉ IP này. Lượt bình chọn bị từ chối.' },
            { status: 429 }
          );
        }
      }

      // 5. Log valid ballot in Supabase public.ballots table
      const { error: insertError } = await supabaseAdmin.from('ballots').insert({
        team_id: teamId,
        voter_ip: voterIp,
        voter_fingerprint: fingerprint || 'canvas_hash_mock_fingerprint',
        voter_email: voterEmail,
        recaptcha_score: 0.95,
        is_valid: true,
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return NextResponse.json(
          { error: `Lỗi lưu phiếu bầu: ${insertError.message || 'Không thể ghi nhận phiếu'}` },
          { status: 500 }
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
