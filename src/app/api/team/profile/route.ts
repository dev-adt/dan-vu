import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET: Fetch team profile by team_id (from query param or cookie)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('id') || req.cookies.get('team_id')?.value;

    if (!teamId) {
      return NextResponse.json({ error: 'Chưa đăng nhập hoặc thiếu Mã đội thi.' }, { status: 401 });
    }

    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (error || !team) {
      return NextResponse.json({ error: 'Không tìm thấy hồ sơ đội thi.' }, { status: 404 });
    }

    // Exclude password
    const { password: _, ...teamProfile } = team;

    return NextResponse.json({ team: teamProfile });
  } catch (err: any) {
    console.error('Error fetching team profile:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// PATCH: Edit team profile details
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      team_name,
      organization,
      member_count,
      representative_name,
      phone,
      email,
      category,
      performance_title,
      duration,
      description,
      technical_requirements,
      audio_url,
      video_url,
      photo_url,
      performances,
      password,
    } = body;

    const teamId = id || req.cookies.get('team_id')?.value;

    if (!teamId) {
      return NextResponse.json({ error: 'Chưa đăng nhập hoặc thiếu Mã đội thi (id).' }, { status: 401 });
    }

    // Get current team record
    const { data: currentTeam, error: fetchErr } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (fetchErr || !currentTeam) {
      return NextResponse.json({ error: 'Không tìm thấy hồ sơ đội thi.' }, { status: 404 });
    }

    // Build fields to update
    const updatedFields: any = {};
    if (team_name !== undefined) updatedFields.team_name = team_name;
    if (organization !== undefined) updatedFields.organization = organization;
    if (member_count !== undefined) updatedFields.member_count = member_count;
    if (representative_name !== undefined) updatedFields.representative_name = representative_name;
    if (phone !== undefined) updatedFields.phone = phone;
    if (email !== undefined) updatedFields.email = email;
    if (category !== undefined) updatedFields.category = category;
    if (performance_title !== undefined) updatedFields.performance_title = performance_title;
    if (duration !== undefined) updatedFields.duration = duration;
    if (description !== undefined) updatedFields.description = description;
    if (technical_requirements !== undefined) updatedFields.technical_requirements = technical_requirements;
    if (audio_url !== undefined) updatedFields.audio_url = audio_url;
    if (video_url !== undefined) updatedFields.video_url = video_url;
    if (photo_url !== undefined) updatedFields.photo_url = photo_url;
    if (performances !== undefined) {
      updatedFields.performances = performances;
      if (Array.isArray(performances) && performances.length > 0) {
        if (!updatedFields.performance_title) updatedFields.performance_title = performances[0].title;
        if (!updatedFields.category) updatedFields.category = performances[0].category;
        if (!updatedFields.duration) updatedFields.duration = performances[0].duration;
        if (!updatedFields.description) updatedFields.description = performances[0].description;
        if (!updatedFields.technical_requirements) updatedFields.technical_requirements = performances[0].technicalRequirements;
        if (!updatedFields.audio_url) updatedFields.audio_url = performances[0].audioUrl;
        if (!updatedFields.video_url) updatedFields.video_url = performances[0].videoUrl;
      }
    }

    // Check if team is already approved
    if (currentTeam.status === 'approved') {
      // Team is approved: Save updates into pending_changes and set has_pending_update = true
      const { data, error } = await supabaseAdmin
        .from('teams')
        .update({
          has_pending_update: true,
          pending_changes: updatedFields,
          ...(password ? { password } : {}),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Lỗi gửi yêu cầu chỉnh sửa: ' + error.message }, { status: 500 });
      }

      const { password: _, ...teamData } = data;
      return NextResponse.json({
        success: true,
        isPending: true,
        message: 'Thông tin chỉnh sửa đã được gửi và đang ở trạng thái Chờ duyệt bởi Ban Tổ Chức.',
        team: teamData,
      });
    } else {
      // Team is not yet approved: Update public fields directly
      const { data, error } = await supabaseAdmin
        .from('teams')
        .update({
          ...updatedFields,
          ...(password ? { password } : {}),
          has_pending_update: false,
          pending_changes: null,
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Lỗi cập nhật hồ sơ: ' + error.message }, { status: 500 });
      }

      const { password: _, ...teamData } = data;
      return NextResponse.json({
        success: true,
        isPending: false,
        message: 'Cập nhật hồ sơ thành công.',
        team: teamData,
      });
    }
  } catch (err: any) {
    console.error('Error updating team profile:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
