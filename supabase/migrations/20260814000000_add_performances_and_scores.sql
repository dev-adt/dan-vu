-- Migration to add multi-performance support and performance-level scoring
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS performances JSONB;
ALTER TABLE public.scorecards ADD COLUMN IF NOT EXISTS scores JSONB;
