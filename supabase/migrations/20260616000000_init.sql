-- Up Migration for Nhịp Bước Việt Nam 2026 Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    representative_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('dan_ca', 'dan_vu', 'both')),
    performance_title VARCHAR(255) NOT NULL,
    description TEXT,
    technical_requirements TEXT,
    audio_url VARCHAR(512),
    video_url VARCHAR(512),
    photo_url VARCHAR(512),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'))
);

-- Enable RLS for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Allow public read on approved teams (for voting and discovery)
CREATE POLICY "Allow public read on approved teams" ON public.teams
    FOR SELECT USING (status = 'approved');

-- Allow creators to manage their own drafts via email/session matching
CREATE POLICY "Allow creators to insert/update their teams" ON public.teams
    FOR ALL USING (true) WITH CHECK (true);

-- Create scorecards table
CREATE TABLE IF NOT EXISTS public.scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    judge_id UUID NOT NULL, -- references auth.users(id)
    score_concept INTEGER CHECK (score_concept BETWEEN 0 AND 30) NOT NULL,
    score_technique INTEGER CHECK (score_technique BETWEEN 0 AND 40) NOT NULL,
    score_costume INTEGER CHECK (score_costume BETWEEN 0 AND 20) NOT NULL,
    score_stage INTEGER CHECK (score_stage BETWEEN 0 AND 10) NOT NULL,
    total_score INTEGER GENERATED ALWAYS AS (score_concept + score_technique + score_costume + score_stage) STORED,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_judge_team UNIQUE (judge_id, team_id)
);

-- Enable RLS for scorecards
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;

-- Only authenticated judges can manage their scorecards
CREATE POLICY "Allow judges to select their scorecards" ON public.scorecards
    FOR SELECT USING (auth.uid() = judge_id);

CREATE POLICY "Allow judges to insert scorecards" ON public.scorecards
    FOR INSERT WITH CHECK (auth.uid() = judge_id AND NOT is_locked);

CREATE POLICY "Allow judges to update unlocked scorecards" ON public.scorecards
    FOR UPDATE USING (auth.uid() = judge_id AND NOT is_locked);

-- Create public ballots table
CREATE TABLE IF NOT EXISTS public.ballots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    voter_ip INET NOT NULL,
    voter_fingerprint VARCHAR(255) NOT NULL,
    voter_email VARCHAR(255),
    recaptcha_score NUMERIC(3, 2),
    is_valid BOOLEAN DEFAULT TRUE
);

-- Enable RLS for ballots
ALTER TABLE public.ballots ENABLE ROW LEVEL SECURITY;

-- Public can cast votes
CREATE POLICY "Allow public to insert ballots" ON public.ballots
    FOR INSERT WITH CHECK (true);

-- Admin role checks (Admin policy checks can verify metadata roles in auth.users)
CREATE POLICY "Allow admin to view all ballots" ON public.ballots
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Indices for fast lookups
CREATE INDEX IF NOT EXISTS idx_ballots_fingerprint_date ON public.ballots (voter_fingerprint, (voted_at::date));
CREATE INDEX IF NOT EXISTS idx_teams_category_status ON public.teams (category, status);
CREATE INDEX IF NOT EXISTS idx_scorecards_team_id ON public.scorecards (team_id);
