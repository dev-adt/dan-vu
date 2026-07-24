import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// GET: Fetch all videos for admin dashboard
export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin videos:', error);
      return NextResponse.json({ error: 'Lỗi tải danh sách video: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ videos: videos || [] });
  } catch (err: any) {
    console.error('Admin videos fetch error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// POST: Create a new video
export async function POST(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, video_url, thumbnail_url, summary, source, status, is_featured } = body;

    if (!title || !video_url) {
      return NextResponse.json({ error: 'Tiêu đề và đường link Video (URL) không được để trống.' }, { status: 400 });
    }

    // Limit featured videos to maximum 3
    if (is_featured) {
      const { data: existingFeatured } = await supabaseAdmin
        .from('videos')
        .select('id')
        .eq('is_featured', true)
        .eq('status', 'published');

      if (existingFeatured && existingFeatured.length >= 3) {
        return NextResponse.json(
          { error: 'Hệ thống giới hạn tối đa 3 video nổi bật được đăng. Vui lòng bỏ nổi bật một video khác trước.' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert({
        title,
        video_url,
        thumbnail_url: thumbnail_url || null,
        summary: summary || null,
        source: source || null,
        status: status || 'published',
        is_featured: !!is_featured,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return NextResponse.json({ error: 'Lỗi khi lưu video: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ video: data, message: 'Tạo video mới thành công.' });
  } catch (err: any) {
    console.error('Error in video POST API:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// PATCH: Update an existing video
export async function PATCH(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, video_url, thumbnail_url, summary, source, status, is_featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID video cần cập nhật.' }, { status: 400 });
    }

    // Check max 3 featured limit if enabling is_featured
    if (is_featured) {
      const { data: existingFeatured } = await supabaseAdmin
        .from('videos')
        .select('id')
        .eq('is_featured', true)
        .eq('status', 'published')
        .neq('id', id);

      if (existingFeatured && existingFeatured.length >= 3) {
        return NextResponse.json(
          { error: 'Hệ thống giới hạn tối đa 3 video nổi bật được đăng. Vui lòng bỏ nổi bật một video khác trước.' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (video_url !== undefined) updateData.video_url = video_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url || null;
    if (summary !== undefined) updateData.summary = summary || null;
    if (source !== undefined) updateData.source = source || null;
    if (status !== undefined) updateData.status = status;
    if (is_featured !== undefined) updateData.is_featured = is_featured;

    const { data, error } = await supabaseAdmin
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      return NextResponse.json({ error: 'Lỗi khi cập nhật video: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ video: data, message: 'Cập nhật video thành công.' });
  } catch (err: any) {
    console.error('Error in video PATCH API:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// DELETE: Delete a video
export async function DELETE(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID video cần xóa.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting video:', error);
      return NextResponse.json({ error: 'Lỗi khi xóa video: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Xóa video thành công.' });
  } catch (err: any) {
    console.error('Error in video DELETE API:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
