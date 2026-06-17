import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch approved teams
    const { data: teams, error: teamsError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, representative_name, phone, email, category, performance_title, duration, description, technical_requirements, photo_url')
      .eq('status', 'approved');

    if (teamsError) {
      console.error('Error fetching approved teams:', teamsError);
      return NextResponse.json({ error: 'Lỗi nạp danh sách tiết mục.' }, { status: 500 });
    }

    // 2. Fetch count of valid votes for each team
    const { data: ballots, error: ballotsError } = await supabaseAdmin
      .from('ballots')
      .select('team_id')
      .eq('is_valid', true);

    if (ballotsError) {
      console.error('Error fetching ballots count:', ballotsError);
      return NextResponse.json({ error: 'Lỗi nạp thống kê lượt bình chọn.' }, { status: 500 });
    }

    // Create a map of team_id -> vote count
    const voteMap: Record<string, number> = {};
    (ballots || []).forEach((b: any) => {
      voteMap[b.team_id] = (voteMap[b.team_id] || 0) + 1;
    });

    // Merge vote count into team objects
    const formattedTeams = (teams || []).map((t) => ({
      id: t.id,
      teamName: t.team_name,
      representativeName: t.representative_name,
      phone: t.phone,
      email: t.email,
      category: t.category,
      performanceTitle: t.performance_title,
      duration: t.duration,
      description: t.description || '',
      technicalRequirements: t.technical_requirements || '',
      photoUrl: t.photo_url || '/images/hero-bg-1.png', // Fallback to hero background
      votesCount: voteMap[t.id] || 0,
    }));

    return NextResponse.json({ teams: formattedTeams });
  } catch (err: any) {
    console.error('Approved teams retrieval internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
