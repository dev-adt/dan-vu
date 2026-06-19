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

// GET: Fetch stats and ballot logs
export async function GET(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    // 1. Get teams count
    const { count: teamsCount } = await supabaseAdmin
      .from('teams')
      .select('*', { count: 'exact', head: true });

    // 2. Get votes count (valid ballots)
    const { count: votesCount } = await supabaseAdmin
      .from('ballots')
      .select('*', { count: 'exact', head: true })
      .eq('is_valid', true);

    // 3. Get fraud count (invalid or low score ballots)
    const { count: fraudCount } = await supabaseAdmin
      .from('ballots')
      .select('*', { count: 'exact', head: true })
      .eq('is_valid', false);

    // 4. Get judges count
    const { count: judgesCount } = await supabaseAdmin
      .from('judges')
      .select('*', { count: 'exact', head: true });

    // 5. Get ballots audit log with team names
    const { data: ballotsData, error: ballotsError } = await supabaseAdmin
      .from('ballots')
      .select('id, voted_at, voter_ip, voter_fingerprint, voter_email, recaptcha_score, is_valid, team_id, teams(team_name)')
      .order('voted_at', { ascending: false })
      .limit(50);

    if (ballotsError) {
      throw ballotsError;
    }

    // Format ballots to match UI layout
    const formattedLogs = (ballotsData || []).map((b: any) => ({
      id: b.id,
      teamName: b.teams ? b.teams.team_name : 'N/A',
      ip: b.voter_ip,
      fingerprint: b.voter_fingerprint,
      timestamp: new Date(b.voted_at).toLocaleString('vi-VN'),
      score: b.recaptcha_score || 0.9,
      status: !b.is_valid ? 'voided' : (b.recaptcha_score < 0.3 ? 'flagged' : 'valid'),
    }));

    return NextResponse.json({
      stats: {
        teamsCount: teamsCount || 0,
        votesCount: votesCount || 0,
        fraudCount: fraudCount || 0,
        judgesCount: judgesCount || 0,
      },
      logs: formattedLogs
    });
  } catch (err: any) {
    console.error('Error fetching admin stats:', err);
    return NextResponse.json({ error: 'Lỗi nạp dữ liệu thống kê: ' + err.message }, { status: 500 });
  }
}

// PATCH: Invalidate (Void) a ballot
export async function PATCH(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  try {
    const { id, is_valid } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Mã lượt vote (id) là bắt buộc.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('ballots')
      .update({ is_valid: is_valid })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Lỗi cập nhật phiếu bầu: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ballot: data });
  } catch (err: any) {
    console.error('Error updating ballot:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}
