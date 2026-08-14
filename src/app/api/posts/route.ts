import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Fetch published posts with optional search, pagination, and limit
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '0', 10); // 0 = no limit
    const featuredOnly = searchParams.get('featured') === 'true';

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,title_en.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // Featured only filter
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    // Pagination
    if (limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Error fetching public posts:', error);
      return NextResponse.json({ error: 'Lỗi tải danh sách bài viết: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      posts: posts || [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err: any) {
    console.error('Public posts internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
