import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    const voterEmail = user.email;
    const voterIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // 3. Enforce the limit: 1 vote/day for each team per user email
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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

    if (existingBallot) {
      return NextResponse.json(
        { error: 'Bạn đã bình chọn cho tiết mục này hôm nay rồi. Vui lòng quay lại vào ngày mai!' },
        { status: 429 }
      );
    }

    // 4. Log the ballot in Supabase public.ballots table
    const { error: insertError } = await supabaseAdmin
      .from('ballots')
      .insert({
        team_id: teamId,
        voter_ip: voterIp,
        voter_fingerprint: fingerprint || 'unknown',
        voter_email: voterEmail,
        recaptcha_score: 0.9,
        is_valid: true
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({ error: 'Lỗi lưu phiếu bầu.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Vote processing internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
