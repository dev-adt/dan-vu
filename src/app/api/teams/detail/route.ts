import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Mã tiết mục (id) là bắt buộc.' }, { status: 400 });
    }

    // 1. Fetch team info
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, representative_name, phone, email, category, performance_title, duration, description, technical_requirements, photo_url, audio_url, video_url, organization')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();

    if (teamError) {
      console.error('Error fetching team detail:', teamError);
      return NextResponse.json({ error: 'Lỗi nạp chi tiết tiết mục.' }, { status: 500 });
    }

    if (!team) {
      return NextResponse.json({ error: 'Không tìm thấy tiết mục hoặc tiết mục chưa được BTC phê duyệt.' }, { status: 404 });
    }

    // 2. Fetch valid votes count for this team
    const { count: votesCount } = await supabaseAdmin
      .from('ballots')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', id)
      .eq('is_valid', true);

    // 3. Optional: Check if logged-in user has voted today
    let hasVotedToday = false;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user } } = await supabaseClient.auth.getUser(token);

      if (user && user.email) {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const startOfToday = `${today}T00:00:00.000Z`;
        const endOfToday = `${today}T23:59:59.999Z`;

        const { count: userVoteCount } = await supabaseAdmin
          .from('ballots')
          .select('*', { count: 'exact', head: true })
          .eq('voter_email', user.email)
          .eq('team_id', id)
          .gte('voted_at', startOfToday)
          .lte('voted_at', endOfToday)
          .eq('is_valid', true);

        hasVotedToday = (userVoteCount || 0) > 0;
      }
    }

    return NextResponse.json({
      team: {
        id: team.id,
        teamName: team.team_name,
        representative: team.representative_name,
        phone: team.phone,
        email: team.email,
        category: team.category,
        performanceTitle: team.performance_title,
        duration: team.duration,
        origin: team.organization || 'Tự do',
        culturalBackground: team.description || '',
        technicalRequirements: team.technical_requirements || '',
        photoUrl: team.photo_url || '/images/hero-bg-1.png',
        audioUrl: team.audio_url || '',
        videoUrl: team.video_url || '',
        votesCount: votesCount || 0,
      },
      hasVotedToday
    });
  } catch (err: any) {
    console.error('Team detail retrieval internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
