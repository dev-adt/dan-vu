import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to authenticate judge user and return user object
async function getJudgeUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user } } = await supabaseClient.auth.getUser(token);
  return user;
}

// GET: Fetch all teams with this judge's grading status
export async function GET(req: NextRequest) {
  const judge = await getJudgeUser(req);
  if (!judge) {
    return NextResponse.json({ error: 'Không được phép truy cập. Vui lòng đăng nhập.' }, { status: 401 });
  }

  try {
    // 1. Fetch approved teams
    const { data: teams, error: teamsError } = await supabaseAdmin
      .from('teams')
      .select('id, team_name, performance_title, category')
      .eq('status', 'approved');

    if (teamsError) {
      throw teamsError;
    }

    // 2. Fetch scorecards submitted by this judge
    const { data: scorecards, error: scorecardsError } = await supabaseAdmin
      .from('scorecards')
      .select('team_id, total_score, is_locked')
      .eq('judge_id', judge.id);

    if (scorecardsError) {
      throw scorecardsError;
    }

    // Create a map of team_id -> scorecard
    const scorecardMap: Record<string, { totalScore: number; isLocked: boolean }> = {};
    (scorecards || []).forEach((s: any) => {
      scorecardMap[s.team_id] = {
        totalScore: s.total_score,
        isLocked: s.is_locked,
      };
    });

    // Merge status and score into team objects
    const list = (teams || []).map((t) => {
      const card = scorecardMap[t.id];
      return {
        id: t.id,
        teamName: t.team_name,
        performanceTitle: t.performance_title,
        category: t.category,
        status: card ? (card.isLocked ? 'submitted' : 'draft') : 'pending',
        score: card ? card.totalScore : null,
      };
    });

    return NextResponse.json({ list });
  } catch (err: any) {
    console.error('Judge stats fetch internal error:', err);
    return NextResponse.json({ error: 'Lỗi nạp dữ liệu từ máy chủ.' }, { status: 500 });
  }
}

// POST: Save or Submit a Scorecard
export async function POST(req: NextRequest) {
  const judge = await getJudgeUser(req);
  if (!judge) {
    return NextResponse.json({ error: 'Không được phép truy cập. Vui lòng đăng nhập.' }, { status: 401 });
  }

  try {
    const { teamId, scoreConcept, scoreTechnique, scoreCostume, scoreStage, feedback, isLocked } = await req.json();

    if (!teamId || scoreConcept === undefined || scoreTechnique === undefined || scoreCostume === undefined || scoreStage === undefined) {
      return NextResponse.json({ error: 'Thiếu thông tin chấm điểm bắt buộc.' }, { status: 400 });
    }

    // Check if scorecard already exists and is locked
    const { data: existingCard, error: queryError } = await supabaseAdmin
      .from('scorecards')
      .select('is_locked')
      .eq('judge_id', judge.id)
      .eq('team_id', teamId)
      .maybeSingle();

    if (queryError) {
      throw queryError;
    }

    if (existingCard && existingCard.is_locked) {
      return NextResponse.json({ error: 'Phiếu chấm điểm này đã được gửi chính thức và khóa lại, không thể sửa đổi.' }, { status: 400 });
    }

    // Upsert the scorecard
    const { error: upsertError } = await supabaseAdmin
      .from('scorecards')
      .upsert({
        team_id: teamId,
        judge_id: judge.id,
        score_concept: scoreConcept,
        score_technique: scoreTechnique,
        score_costume: scoreCostume,
        score_stage: scoreStage,
        feedback: feedback || null,
        is_locked: !!isLocked,
      }, { onConflict: 'judge_id,team_id' });

    if (upsertError) {
      console.error('Scorecard saving error:', upsertError);
      return NextResponse.json({ error: 'Lỗi lưu phiếu chấm điểm: ' + upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Scorecard submission internal error:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
