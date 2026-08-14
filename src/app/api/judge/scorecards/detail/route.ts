import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getJudgeUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  // 1. Check user metadata role
  if (user.user_metadata?.role === 'judge') {
    return user;
  }

  // 2. Check if user ID exists in public.judges table
  const { data: judgeRecord } = await supabaseAdmin
    .from('judges')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (judgeRecord) {
    return user;
  }

  return null;
}

export async function GET(req: NextRequest) {
  const judge = await getJudgeUser(req);
  if (!judge) {
    return NextResponse.json({ error: 'Không được phép truy cập. Vui lòng đăng nhập.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Mã đội thi (teamId) là bắt buộc.' }, { status: 400 });
    }

    // 1. Fetch team details
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, performance_title, video_url, category, performances')
      .eq('id', teamId)
      .eq('status', 'approved')
      .maybeSingle();

    if (teamError) {
      throw teamError;
    }

    if (!team) {
      return NextResponse.json({ error: 'Không tìm thấy đội thi hoặc đội thi chưa được phê duyệt.' }, { status: 404 });
    }

    // Format performances
    let parsedPerformances: any[] = [];
    if (Array.isArray(team.performances) && team.performances.length > 0) {
      parsedPerformances = team.performances.map((p: any, idx: number) => ({
        id: p.id || `p${idx + 1}`,
        title: p.title || p.performanceTitle || `Tiết mục ${idx + 1}`,
        category: p.category || team.category || 'dan_ca',
        duration: p.duration || '',
        description: p.description || '',
        technicalRequirements: p.technicalRequirements || '',
        audioUrl: p.audioUrl || p.audioLink || '',
        videoUrl: p.videoUrl || p.videoLink || '',
      }));
    } else {
      parsedPerformances = [
        {
          id: 'p1',
          title: team.performance_title || 'Tiết mục 1',
          category: team.category || 'dan_ca',
          duration: '',
          description: '',
          technicalRequirements: '',
          audioUrl: '',
          videoUrl: team.video_url || '',
        }
      ];
    }

    // 2. Fetch scorecard if it exists for this judge and team
    const { data: scorecard, error: scorecardError } = await supabaseAdmin
      .from('scorecards')
      .select('score_concept, score_technique, score_costume, score_stage, feedback, is_locked, scores, total_score')
      .eq('judge_id', judge.id)
      .eq('team_id', teamId)
      .maybeSingle();

    if (scorecardError) {
      throw scorecardError;
    }

    return NextResponse.json({
      team: {
        id: team.id,
        teamName: team.team_name,
        performanceTitle: team.performance_title,
        videoUrl: team.video_url || '',
        category: team.category,
        performances: parsedPerformances,
      },
      scorecard: scorecard || null
    });
  } catch (err: any) {
    console.error('Judge scorecard details fetch internal error:', err);
    return NextResponse.json({ error: 'Lỗi nạp dữ liệu từ máy chủ: ' + err.message }, { status: 500 });
  }
}
