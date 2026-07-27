import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to authenticate admin using basic token or header matching
function authenticateAdmin(req: NextRequest): boolean {
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

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Create User in Supabase Auth via Admin Client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
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
      .upsert({
        id: userId,
        email: trimmedEmail,
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

// PATCH: Update judge password or profile by Admin
export async function PATCH(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { id, password, fullName } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Mã giám khảo (id) là bắt buộc.' }, { status: 400 });
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }, { status: 400 });
      }

      // Update Auth Password
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
      if (authError) {
        console.error('Auth User Password Update Error:', authError);
        return NextResponse.json({ error: 'Lỗi đổi mật khẩu auth: ' + authError.message }, { status: 500 });
      }
    }

    if (fullName) {
      const { error: profileError } = await supabaseAdmin
        .from('judges')
        .update({ full_name: fullName })
        .eq('id', id);

      if (profileError) {
        console.error('Profile Update Error:', profileError);
        return NextResponse.json({ error: 'Lỗi cập nhật tên giám khảo: ' + profileError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Đã cập nhật thông tin giám khảo thành công.' });
  } catch (err: any) {
    console.error('Internal Error in updating judge:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// DELETE: Remove a judge account (safely handles FK & Auth User)
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

    // 1. Delete associated scorecards if any to prevent foreign key errors
    await supabaseAdmin.from('scorecards').delete().eq('judge_id', id);

    // 2. Delete profile entry from public.judges table
    const { error: dbError } = await supabaseAdmin.from('judges').delete().eq('id', id);
    if (dbError) {
      console.error('Judges Table Deletion Error:', dbError);
    }

    // 3. Delete user from Supabase auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError && !authError.message.includes('User not found')) {
      console.error('Auth User Deletion Error:', authError);
      return NextResponse.json({ error: 'Lỗi xóa tài khoản đăng nhập: ' + authError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa tài khoản giám khảo thành công.' });
  } catch (err: any) {
    console.error('Internal Error in deleting judge:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
