'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSafeNextPath } from '@/lib/auth-redirect';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const finishLogin = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const next = getSafeNextPath(searchParams.get('next'));
      const oauthError = searchParams.get('error_description') || searchParams.get('error');

      if (oauthError) {
        setErrorMessage(oauthError);
        return;
      }

      if (!code) {
        router.replace(next);
        return;
      }

      // 1. Check if session was already established automatically by Supabase detectSessionInUrl
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        router.replace(next);
        return;
      }

      // 2. Exchange code for session if not already handled
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        // Re-check session in case of race condition with detectSessionInUrl
        const { data: { session: recheckSession } } = await supabase.auth.getSession();
        if (recheckSession) {
          router.replace(next);
          return;
        }

        console.error('Error exchanging OAuth code:', error);
        setErrorMessage('Không thể hoàn tất đăng nhập Google. Vui lòng thử lại.');
        return;
      }

      router.replace(next);
    };

    finishLogin();
  }, [router]);

  if (errorMessage) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-light-alabaster text-dark-obsidian">
        <div className="max-w-sm w-full rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-4">
          <h1 className="font-heading text-xl font-bold">Dang nhap khong thanh cong</h1>
          <p className="text-sm text-dark-slate/70">{errorMessage}</p>
          <Link href="/vote" className="inline-flex px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold uppercase">
            Quay lai binh chon
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-light-alabaster text-dark-obsidian">
      <div className="max-w-sm w-full rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold">Dang hoan tat dang nhap Google...</p>
      </div>
    </main>
  );
}
