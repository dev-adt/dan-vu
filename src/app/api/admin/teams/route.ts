import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to authenticate admin
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

// GET: List all registered teams
export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Lỗi nạp danh sách đội thi: ' + error.message }, { status: 500 });
  }

  return NextResponse.json({ teams: data });
}

// PATCH: Update a team's status or details
export async function PATCH(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, team_name, organization, member_count, category, performance_title, duration, description, technical_requirements } = body;

    if (!id) {
      return NextResponse.json({ error: 'Mã đội thi (id) là bắt buộc.' }, { status: 400 });
    }

    // Build update object dynamically
    const updateObj: any = {};
    if (status !== undefined) updateObj.status = status;
    if (team_name !== undefined) updateObj.team_name = team_name;
    if (organization !== undefined) updateObj.organization = organization;
    if (member_count !== undefined) updateObj.member_count = member_count;
    if (category !== undefined) updateObj.category = category;
    if (performance_title !== undefined) updateObj.performance_title = performance_title;
    if (duration !== undefined) updateObj.duration = duration;
    if (description !== undefined) updateObj.description = description;
    if (technical_requirements !== undefined) updateObj.technical_requirements = technical_requirements;

    const { data, error } = await supabaseAdmin
      .from('teams')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Lỗi cập nhật dữ liệu: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, team: data });
  } catch (err: any) {
    console.error('Error updating team:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// DELETE: Delete a team
export async function DELETE(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Mã đội thi (id) là bắt buộc.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Lỗi xóa đội thi: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting team:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
