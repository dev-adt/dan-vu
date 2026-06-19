import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/vote';

  // Determine the base origin from the request itself (works behind reverse proxy)
  const origin = requestUrl.origin;

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      });

      try {
        await supabase.auth.exchangeCodeForSession(code);
      } catch (err) {
        console.error('Error exchanging code for session:', err);
      }
    }
  }

  // Redirect back to the app page
  return NextResponse.redirect(new URL(next, origin));
}
