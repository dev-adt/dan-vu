-- Migration to create public.videos table for video management
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    summary TEXT,
    source VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published videos
CREATE POLICY "Allow public read access to published videos"
ON public.videos FOR SELECT
USING (status = 'published');

-- Allow all operations for service role
CREATE POLICY "Allow all access for service role"
ON public.videos FOR ALL
USING (true);
