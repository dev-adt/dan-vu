import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Phiên làm việc không hợp lệ. Vui lòng đăng nhập lại.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }, { status: 401 });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email;

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Mật khẩu cũ và mật khẩu mới không được để trống.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải chứa ít nhất 6 ký tự.' }, { status: 400 });
    }

    // Verify old password using signInWithPassword
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key');
    const { error: signInError } = await anonClient.auth.signInWithPassword({
      email: userEmail!,
      password: oldPassword,
    });

    if (signInError) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.' }, { status: 400 });
    }

    // Update password using service role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) {
      console.error('Judge Password Change Error:', updateError);
      return NextResponse.json({ error: 'Lỗi cập nhật mật khẩu mới: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err: any) {
    console.error('Judge change password internal error:', err);
    return NextResponse.json({ error: 'Lỗi xử lý máy chủ nội bộ.' }, { status: 500 });
  }
}
