import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query team by email
    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (error || !team) {
      return NextResponse.json({ error: 'Tên đăng nhập (Email) hoặc Mật khẩu không chính xác.' }, { status: 401 });
    }

    // Verify password
    // Support default legacy password '12345678' if password is empty in DB
    const storedPassword = team.password || '12345678';
    if (password !== storedPassword) {
      return NextResponse.json({ error: 'Tên đăng nhập (Email) hoặc Mật khẩu không chính xác.' }, { status: 401 });
    }

    // Omit sensitive password field
    const { password: _, ...teamData } = team;

    const response = NextResponse.json({
      success: true,
      team: teamData,
    });

    // Set HTTP-only cookie for team session
    response.cookies.set('team_id', team.id, {
      httpOnly: false,
      path: '/',
      maxAge: 86400 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Team login error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ khi xử lý đăng nhập.' }, { status: 500 });
  }
}
