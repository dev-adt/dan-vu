-- Migration to add summary and source columns to public.posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS source VARCHAR(255);
