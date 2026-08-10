-- Database migration to add required registration fields and judges table

-- Add fields to public.teams table
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS organization VARCHAR(255),
ADD COLUMN IF NOT EXISTS member_count VARCHAR(100),
ADD COLUMN IF NOT EXISTS duration VARCHAR(100);

-- Create public.judges table for Admin to query judge profiles
CREATE TABLE IF NOT EXISTS public.judges (
    id UUID PRIMARY KEY, -- references auth.users(id)
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on public.judges
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;

-- Policy to allow Admin role to manage judges
CREATE POLICY "Allow admin to manage judges" ON public.judges
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Policy to allow judges to view their own profile
CREATE POLICY "Allow judges to view their own profile" ON public.judges
    FOR SELECT USING (auth.uid() = id);
