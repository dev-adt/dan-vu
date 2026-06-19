import { createClient } from './supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Team {
  id: string;
  created_at: string;
  team_name: string;
  organization?: string;
  member_count?: string;
  representative_name: string;
  phone: string;
  email: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performance_title: string;
  duration?: string;
  description: string;
  technical_requirements: string;
  audio_url?: string;
  video_url?: string;
  photo_url?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface Scorecard {
  id: string;
  team_id: string;
  judge_id: string;
  score_concept: number;
  score_technique: number;
  score_costume: number;
  score_stage: number;
  total_score?: number;
  feedback?: string;
  submitted_at: string;
  is_locked: boolean;
}

export interface Ballot {
  id: string;
  team_id: string;
  voted_at: string;
  voter_ip: string;
  voter_fingerprint: string;
  voter_email?: string;
  recaptcha_score?: number;
  is_valid: boolean;
}
