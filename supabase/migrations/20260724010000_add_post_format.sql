-- Migration to add format column to public.posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS format VARCHAR(50) DEFAULT 'html' NOT NULL;
