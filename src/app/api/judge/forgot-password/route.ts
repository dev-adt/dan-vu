import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Vui lòng nhập địa chỉ Email đăng ký.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query judge by email in public.judges table
    const { data: judge, error } = await supabaseAdmin
      .from('judges')
      .select('*')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (error || !judge) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản giám khảo tương ứng với email này.' }, { status: 404 });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();

    // Update password in Supabase Auth via Service Role
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(judge.id, {
      password: newPassword,
    });

    if (authError) {
      console.error('Judge Auth Password Reset Error:', authError);
      return NextResponse.json({ error: 'Lỗi cập nhật mật khẩu mới: ' + authError.message }, { status: 500 });
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

      const bccEmail = process.env.BCC_EMAIL || process.env.ADMIN_BCC_EMAIL;

      const mailOptions: any = {
        from: process.env.SMTP_FROM || `"Festival Dân Ca Dân Vũ 2026" <${process.env.SMTP_USER}>`,
        to: trimmedEmail,
        subject: `[Festival 2026] Cấp lại Mật khẩu Đăng nhập Cổng Giám Khảo - ${judge.full_name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #c62828; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NHỊP BƯỚC VIỆT NAM</h2>
              <span style="color: #00695c; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 3px;">Festival Dân Ca Dân Vũ Quốc Tế 2026</span>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">Kính gửi Giám khảo <strong>${judge.full_name}</strong>,</p>
            
            <p style="font-size: 14px; line-height: 1.6;">Ban Tổ Chức đã tiếp nhận yêu cầu cấp lại mật khẩu cho tài khoản Cổng Giám Khảo của bạn.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">Mật khẩu đăng nhập mới của bạn là:</p>
              <div style="font-size: 24px; font-weight: 800; color: #c62828; letter-spacing: 4px; background-color: #ffffff; padding: 12px 20px; border: 2px dashed #c62828; border-radius: 8px; display: inline-block;">
                ${newPassword}
              </div>
              <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px;">Vui lòng sử dụng mật khẩu này để đăng nhập và đổi lại mật khẩu cá nhân nếu cần.</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://dancadanvu.com'}/judge" style="display: inline-block; background-color: #00695c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">Đăng Nhập Cổng Giám Khảo</a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">Mọi thắc mắc hỗ trợ Giám khảo vui lòng liên hệ hotline BTC: <strong>0966 925 606 (Mrs. Hương)</strong></p>
              <p style="margin: 4px 0 0 0;">© 2026 Ban Tổ Chức Festival Dân Ca Dân Vũ Quốc Tế.</p>
            </div>
          </div>
        `,
      };

      if (bccEmail) {
        mailOptions.bcc = bccEmail;
      }

      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Mail sending error:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu mới đã được gửi về địa chỉ Email của bạn.',
    });
  } catch (err: any) {
    console.error('Judge forgot password internal error:', err);
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu máy chủ.' }, { status: 500 });
  }
}
