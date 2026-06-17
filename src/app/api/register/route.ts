import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Initialize Supabase Client with Service Role Key for Admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      teamName,
      organization,
      memberCount,
      representativeName,
      phone,
      email,
      category,
      performanceTitle,
      duration,
      description,
      technicalRequirements,
      audioLink,
      videoLink,
    } = body;

    // Validate fields
    if (!teamName || !memberCount || !representativeName || !phone || !email || !performanceTitle || !duration) {
      return NextResponse.json({ error: 'Các trường bắt buộc không được để trống.' }, { status: 400 });
    }

    // Insert into Supabase table public.teams
    const { data: teamData, error: dbError } = await supabaseAdmin
      .from('teams')
      .insert({
        team_name: teamName,
        organization: organization || null,
        member_count: memberCount,
        representative_name: representativeName,
        phone,
        email,
        category,
        performance_title: performanceTitle,
        duration,
        description: description || null,
        technical_requirements: technicalRequirements || null,
        audio_url: audioLink || null,
        video_url: videoLink || null,
        status: 'submitted', // Auto submitted
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ error: 'Lỗi lưu dữ liệu đăng ký vào hệ thống: ' + dbError.message }, { status: 500 });
    }

    // Send confirmation email via SMTP
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
        to: email,
        subject: `[Festival 2026] Xác nhận đăng ký hồ sơ dự thi - ${teamName}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #c62828; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NHỊP BƯỚC VIỆT NAM</h2>
              <span style="color: #00695c; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 3px;">Festival Dân Ca Dân Vũ Quốc Tế 2026</span>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">Xin chào Trưởng đoàn <strong>${representativeName}</strong>,</p>
            
            <p style="font-size: 14px; line-height: 1.6;">Ban Tổ Chức xin xác nhận đã tiếp nhận thành công hồ sơ đăng ký trực tuyến của đội <strong>${teamName}</strong> cho tiết mục <strong>"${performanceTitle}"</strong>.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; border-b: 1px solid #e2e8f0; padding-bottom: 8px;">Thông tin tóm tắt hồ sơ:</h4>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 40%;">Mã số hồ sơ dự kiến:</td>
                  <td style="padding: 4px 0; font-weight: 600; color: #c62828;">${teamData.id.substring(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Thể loại đăng ký:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${category === 'dan_ca' ? 'Dân Ca' : category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Số lượng thành viên:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${memberCount}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Thời lượng dự kiến:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${duration}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Trưởng đoàn:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${representativeName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Số điện thoại:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${phone}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Hồ sơ của đội hiện đang ở trạng thái <strong>Chờ duyệt</strong>. Ban chuyên môn của BTC sẽ tiến hành kiểm định chất lượng âm nhạc nhạc nền và tư liệu đính kèm, sau đó gửi thông báo kết quả duyệt chính thức về hòm thư này trong vòng 24 - 48 giờ làm việc tiếp theo.</p>

            <p style="font-size: 14px; line-height: 1.6; color: #64748b; font-style: italic;">* Lưu ý: Trong thời gian chờ đợi, vui lòng không thay đổi cấu hình truy cập hoặc xóa đường dẫn các file tư liệu (Google Drive/Youtube) đã gửi.</p>

            <div style="border-t: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">Mọi thắc mắc kỹ thuật vui lòng liên hệ hotline BTC: <strong>+84 (0) 987 654 321</strong></p>
              <p style="margin: 4px 0 0 0;">© 2026 Ban Tổ Chức Festival Dân Ca Dân Vũ Quốc Tế. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Mail sending error:', mailError);
      // We don't fail the registration if only mail fails, but we flag it
      return NextResponse.json({
        success: true,
        id: teamData.id.substring(0, 8).toUpperCase(),
        warning: 'Lưu hồ sơ thành công nhưng gặp sự cố gửi email xác nhận. BTC sẽ liên hệ trực tiếp qua số điện thoại.'
      });
    }

    return NextResponse.json({ success: true, id: teamData.id.substring(0, 8).toUpperCase() });
  } catch (err: any) {
    console.error('Registration processing error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ khi xử lý đăng ký.' }, { status: 500 });
  }
}
