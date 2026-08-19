-- Migration to make team email optional
-- This allows teams to register and log in using phone number when email is not provided.

ALTER TABLE public.teams ALTER COLUMN email DROP NOT NULL;

-- Ensure indexes on email and phone for fast lookups
CREATE INDEX IF NOT EXISTS idx_teams_phone ON public.teams (phone);
CREATE INDEX IF NOT EXISTS idx_teams_email ON public.teams (email);
