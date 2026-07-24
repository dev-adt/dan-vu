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

// GET: Fetch all posts for admin dashboard management
export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin posts:', error);
      return NextResponse.json({ error: 'Lỗi tải danh sách bài viết: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (err: any) {
    console.error('Admin posts fetch error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, photo_url, status, is_featured, author, format } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung bài viết không được để trống.' }, { status: 400 });
    }

    // Limit featured posts to maximum 3
    if (is_featured) {
      const { data: existingFeatured } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('is_featured', true)
        .eq('status', 'published');

      if (existingFeatured && existingFeatured.length >= 3) {
        return NextResponse.json(
          { error: 'Hệ thống giới hạn tối đa 3 bài viết nổi bật được đăng. Vui lòng bỏ nổi bật một bài viết khác trước.' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        content,
        photo_url,
        status: status || 'draft',
        is_featured: !!is_featured,
        author: author || 'Ban Tổ Chức',
        format: format || 'html'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: 'Lỗi khi lưu bài viết: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (err: any) {
    console.error('Admin post create error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// PATCH: Update an existing post
export async function PATCH(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, content, photo_url, status, is_featured, author, format } = body;

    if (!id) {
      return NextResponse.json({ error: 'Mã bài viết (id) là bắt buộc.' }, { status: 400 });
    }

    // Limit featured posts to maximum 3
    if (is_featured) {
      const { data: existingFeatured } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('is_featured', true)
        .eq('status', 'published')
        .neq('id', id);

      if (existingFeatured && existingFeatured.length >= 3) {
        return NextResponse.json(
          { error: 'Hệ thống giới hạn tối đa 3 bài viết nổi bật được đăng. Vui lòng bỏ nổi bật một bài viết khác trước.' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({
        title,
        content,
        photo_url,
        status,
        is_featured: !!is_featured,
        author,
        format
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return NextResponse.json({ error: 'Lỗi cập nhật bài viết: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (err: any) {
    console.error('Admin post update error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

// DELETE: Remove a post
export async function DELETE(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Mã bài viết (id) là bắt buộc.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return NextResponse.json({ error: 'Lỗi khi xóa bài viết: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công.' });
  } catch (err: any) {
    console.error('Admin post delete error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
