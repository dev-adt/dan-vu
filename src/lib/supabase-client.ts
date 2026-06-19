import { createClient as originalCreateClient } from '@supabase/supabase-js';
import { mockSupabase } from './supabase-mock';

export function createClient(supabaseUrl: string, supabaseKey: string, options?: any) {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return mockSupabase as any;
  }
  return originalCreateClient(supabaseUrl, supabaseKey, options);
}
