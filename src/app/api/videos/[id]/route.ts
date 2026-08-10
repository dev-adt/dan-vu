import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Thiếu ID video.' }, { status: 400 });
  }

  try {
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !video) {
      return NextResponse.json({ error: 'Không tìm thấy video.' }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (err: any) {
    console.error('Video detail internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
