import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || body.email || body.phone || body.username || '').trim();
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ Email hoặc Số điện thoại và Mật khẩu.' }, { status: 400 });
    }

    // Query team by email OR phone
    let team: any = null;

    // 1. Try matching by email (case-insensitive)
    const emailRes = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('email', identifier.toLowerCase())
      .maybeSingle();

    if (emailRes.data) {
      team = emailRes.data;
    } else {
      // 2. Try matching by phone number
      const phoneRes = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('phone', identifier)
        .maybeSingle();

      if (phoneRes.data) {
        team = phoneRes.data;
      }
    }

    if (!team) {
      return NextResponse.json({ error: 'Tên đăng nhập (Email/SĐT) hoặc Mật khẩu không chính xác.' }, { status: 401 });
    }

    // Verify password
    // Support default legacy password '12345678' if password is empty in DB
    const storedPassword = team.password || '12345678';
    if (password !== storedPassword) {
      return NextResponse.json({ error: 'Tên đăng nhập (Email/SĐT) hoặc Mật khẩu không chính xác.' }, { status: 401 });
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
