-- Migration to add English language columns to public.posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS summary_en TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content_en TEXT;
