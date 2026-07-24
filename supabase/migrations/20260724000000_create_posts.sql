-- Migration to create public.posts table for news and events
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    photo_url VARCHAR(512),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    author VARCHAR(255) DEFAULT 'Ban Tổ Chức' NOT NULL
);

-- Enable RLS on public.posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Allow public read on published posts" ON public.posts
    FOR SELECT USING (status = 'published');

-- Allow admin full access to posts table
CREATE POLICY "Allow admin to manage posts" ON public.posts
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );
