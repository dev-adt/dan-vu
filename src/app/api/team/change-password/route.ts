import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { id, oldPassword, newPassword } = await req.json();

    const teamId = id || req.cookies.get('team_id')?.value;

    if (!teamId) {
      return NextResponse.json({ error: 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn.' }, { status: 401 });
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ Mật khẩu hiện tại và Mật khẩu mới.' }, { status: 400 });
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải chứa ít nhất 6 ký tự.' }, { status: 400 });
    }

    // Fetch team record
    const { data: team, error: fetchErr } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (fetchErr || !team) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin tài khoản đội thi.' }, { status: 404 });
    }

    // Verify current password
    const storedPassword = team.password || '12345678';
    if (oldPassword !== storedPassword) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác. Vui lòng thử lại.' }, { status: 400 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json({ error: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.' }, { status: 400 });
    }

    // Direct update password in database without touching pending_changes or requiring admin approval
    const { error: updateErr } = await supabaseAdmin
      .from('teams')
      .update({ password: newPassword.trim() })
      .eq('id', teamId);

    if (updateErr) {
      console.error('Change password DB update error:', updateErr);
      return NextResponse.json({ error: 'Lỗi cập nhật mật khẩu mới vào cơ sở dữ liệu.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu tài khoản thành công! Mật khẩu mới có hiệu lực ngay lập tức.',
    });
  } catch (err: any) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ khi đổi mật khẩu.' }, { status: 500 });
  }
}
