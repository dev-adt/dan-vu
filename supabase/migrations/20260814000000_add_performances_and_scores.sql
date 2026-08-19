-- Migration to add multi-performance support and performance-level scoring
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS performances JSONB;
ALTER TABLE public.scorecards ADD COLUMN IF NOT EXISTS scores JSONB;

-- Tự động chuyển đổi dữ liệu các đội cũ đã đăng ký 1 tiết mục sang định dạng mới (Tiết mục 1)
UPDATE public.teams
SET performances = jsonb_build_array(
  jsonb_build_object(
    'id', 'p1',
    'title', COALESCE(performance_title, 'Tiết mục 1'),
    'category', COALESCE(category, 'dan_ca'),
    'duration', COALESCE(duration, ''),
    'description', COALESCE(description, ''),
    'technicalRequirements', COALESCE(technical_requirements, ''),
    'audioUrl', COALESCE(audio_url, ''),
    'videoUrl', COALESCE(video_url, '')
  )
)
WHERE performances IS NULL;
