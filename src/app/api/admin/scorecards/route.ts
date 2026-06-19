import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
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

    // 2. Fetch locked/submitted scorecards
    const { data: scorecards, error: scorecardsError } = await supabaseAdmin
      .from('scorecards')
      .select('team_id, score_concept, score_technique, score_costume, score_stage, total_score')
      .eq('is_locked', true);

    if (scorecardsError) {
      throw scorecardsError;
    }

    // 3. Aggregate scores in memory
    const scoresByTeam: Record<string, {
      conceptSum: number;
      techniqueSum: number;
      costumeSum: number;
      stageSum: number;
      totalSum: number;
      count: number;
    }> = {};

    (scorecards || []).forEach((s: any) => {
      if (!scoresByTeam[s.team_id]) {
        scoresByTeam[s.team_id] = {
          conceptSum: 0,
          techniqueSum: 0,
          costumeSum: 0,
          stageSum: 0,
          totalSum: 0,
          count: 0,
        };
      }
      scoresByTeam[s.team_id].conceptSum += s.score_concept;
      scoresByTeam[s.team_id].techniqueSum += s.score_technique;
      scoresByTeam[s.team_id].costumeSum += s.score_costume;
      scoresByTeam[s.team_id].stageSum += s.score_stage;
      scoresByTeam[s.team_id].totalSum += s.total_score;
      scoresByTeam[s.team_id].count += 1;
    });

    const rankings = (teams || []).map((t: any) => {
      const stats = scoresByTeam[t.id];
      if (stats && stats.count > 0) {
        return {
          id: t.id,
          teamName: t.team_name,
          performanceTitle: t.performance_title,
          category: t.category,
          gradedCount: stats.count,
          avgConcept: Number((stats.conceptSum / stats.count).toFixed(1)),
          avgTechnique: Number((stats.techniqueSum / stats.count).toFixed(1)),
          avgCostume: Number((stats.costumeSum / stats.count).toFixed(1)),
          avgStage: Number((stats.stageSum / stats.count).toFixed(1)),
          averageScore: Number((stats.totalSum / stats.count).toFixed(1)),
        };
      } else {
        return {
          id: t.id,
          teamName: t.team_name,
          performanceTitle: t.performance_title,
          category: t.category,
          gradedCount: 0,
          avgConcept: 0,
          avgTechnique: 0,
          avgCostume: 0,
          avgStage: 0,
          averageScore: 0,
        };
      }
    });

    // 4. Sort rankings: teams with grades first (highest score to lowest), then ungraded teams
    rankings.sort((a: any, b: any) => {
      if (a.gradedCount > 0 && b.gradedCount === 0) return -1;
      if (a.gradedCount === 0 && b.gradedCount > 0) return 1;
      return b.averageScore - a.averageScore;
    });

    return NextResponse.json({ rankings });
  } catch (err: any) {
    console.error('Error fetching admin rankings:', err);
    return NextResponse.json({ error: 'Lỗi nạp bảng điểm xếp hạng: ' + err.message }, { status: 500 });
  }
}
