import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to authenticate admin using basic token or header matching
function authenticateAdmin(req: NextRequest): boolean {
  // Simple check for mock admin header or basic credentials in header
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    const [type, credentials] = authHeader.split(' ');
    if (type.toLowerCase() === 'basic') {
      const decoded = Buffer.from(credentials, 'base64').toString();
      const [username, password] = decoded.split(':');
      return (
        username === (process.env.ADMIN_USERNAME || 'admin') &&
        password === (process.env.ADMIN_PASSWORD || 'admin')
      );
    }
  }
  return false;
}

// GET: List all judges
export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('judges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Lỗi nạp danh sách giám khảo: ' + error.message }, { status: 500 });
  }

  return NextResponse.json({ judges: data });
}

// POST: Create a new judge account
export async function POST(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Các thông tin Email, Mật khẩu, Họ tên là bắt buộc.' }, { status: 400 });
    }

    // 1. Create User in Supabase Auth via Admin Client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'judge', full_name: fullName }
    });

    if (authError) {
      console.error('Auth User Creation Error:', authError);
      return NextResponse.json({ error: 'Lỗi tạo tài khoản đăng nhập: ' + authError.message }, { status: 500 });
    }

    const userId = authUser.user.id;

    // 2. Insert profile info into public.judges table
    const { data: judgeData, error: profileError } = await supabaseAdmin
      .from('judges')
      .insert({
        id: userId,
        email,
        full_name: fullName
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile insertion error:', profileError);
      // Clean up Auth user if profile table insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: 'Lỗi lưu thông tin hồ sơ giám khảo: ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, judge: judgeData });
  } catch (err: any) {
    console.error('Internal Error in creating judge:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// DELETE: Remove a judge account
export async function DELETE(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Mã giám khảo (id) là bắt buộc.' }, { status: 400 });
    }

    // Delete user from Supabase auth. This cascades and deletes the public.judges profile record
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error('Auth User Deletion Error:', error);
      return NextResponse.json({ error: 'Lỗi xóa tài khoản đăng nhập: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Internal Error in deleting judge:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
