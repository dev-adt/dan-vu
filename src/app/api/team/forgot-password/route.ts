import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Function to generate 8-character random alphanumeric password
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, newEmail } = body;

    const trimmedEmail = email && typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedPhone = phone && typeof phone === 'string' ? phone.trim() : '';
    const trimmedNewEmail = newEmail && typeof newEmail === 'string' ? newEmail.trim().toLowerCase() : '';

    if (!trimmedEmail && !trimmedPhone) {
      return NextResponse.json({ error: 'Vui lòng nhập Email hoặc Số điện thoại đăng ký.' }, { status: 400 });
    }

    let team: any = null;

    if (trimmedPhone) {
      // Lookup team by phone
      const phoneRes = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('phone', trimmedPhone)
        .maybeSingle();

      if (phoneRes.data) {
        team = phoneRes.data;
      }
    } else if (trimmedEmail) {
      // Lookup team by email
      const emailRes = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (emailRes.data) {
        team = emailRes.data;
      }
    }

    if (!team) {
      return NextResponse.json({
        error: trimmedPhone
          ? 'Không tìm thấy hồ sơ đội thi tương ứng với số điện thoại này.'
          : 'Không tìm thấy hồ sơ đội thi tương ứng với email này.'
      }, { status: 404 });
    }

    // Determine target recipient email
    const recipientEmail = trimmedNewEmail || trimmedEmail || team.email;

    if (!recipientEmail) {
      return NextResponse.json({
        error: 'Tài khoản này chưa có Email liên hệ. Vui lòng nhập thêm Email nhận mật khẩu mới.',
        requireEmail: true
      }, { status: 400 });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();

    // Update password (and link new email if updated) in database
    const updatePayload: any = { password: newPassword };
    if (trimmedNewEmail || (!team.email && recipientEmail)) {
      updatePayload.email = recipientEmail;
    }

    const { error: updateError } = await supabaseAdmin
      .from('teams')
      .update(updatePayload)
      .eq('id', team.id);

    if (updateError) {
      console.error('Password reset update error:', updateError);
      return NextResponse.json({ error: 'Lỗi cập nhật mật khẩu mới vào hệ thống.' }, { status: 500 });
    }

    // Send email with new password
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || `"Festival Dân Ca Dân Vũ 2026" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `[Festival 2026] Cấp lại Mật khẩu Đăng nhập Cổng Đội Thi - ${team.team_name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #c62828; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NHỊP BƯỚC VIỆT NAM</h2>
              <span style="color: #00695c; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 3px;">Festival Dân Ca Dân Vũ Quốc Tế 2026</span>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">Xin chào Trưởng đoàn <strong>${team.representative_name}</strong> (Đội <strong>${team.team_name}</strong>),</p>
            
            <p style="font-size: 14px; line-height: 1.6;">Ban Tổ Chức đã tiếp nhận yêu cầu cấp lại mật khẩu cho tài khoản Cổng Đội Thi của bạn.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">Mật khẩu mới ngẫu nhiên của bạn là:</p>
              <div style="font-size: 24px; font-weight: 800; color: #c62828; letter-spacing: 4px; background-color: #ffffff; padding: 12px 20px; border: 2px dashed #c62828; border-radius: 8px; display: inline-block;">
                ${newPassword}
              </div>
              <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px;">Vui lòng dùng mật khẩu này để đăng nhập và đổi lại mật khẩu mới nếu muốn.</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://dancadanvu.com'}/team/login" style="display: inline-block; background-color: #00695c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">Đăng Nhập Ngay</a>
            </div>

            <div style="border-t: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">Mọi thắc mắc kỹ thuật vui lòng liên hệ hotline BTC: <strong>0966 925 606 (Mrs. Hương)</strong></p>
              <p style="margin: 4px 0 0 0;">© 2026 Ban Tổ Chức Festival Dân Ca Dân Vũ Quốc Tế.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Mail sending error during password reset:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: `Mật khẩu ngẫu nhiên mới đã được gửi thành công đến hòm thư ${recipientEmail}.`,
    });
  } catch (err: any) {
    console.error('Forgot password processing error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ khi xử lý cấp lại mật khẩu.' }, { status: 500 });
  }
}
