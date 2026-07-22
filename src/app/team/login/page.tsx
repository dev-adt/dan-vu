'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Sparkles, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TeamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('team_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed?.id) {
            router.push('/team/dashboard');
          }
        } catch {}
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
        return;
      }

      // Store team info in sessionStorage
      sessionStorage.setItem('team_session', JSON.stringify(data.team));
      router.push('/team/dashboard');
    } catch (err: any) {
      setError('Lỗi kết nối máy chủ khi đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-cream/30 text-dark-obsidian selection:bg-accent selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md"
        >
          {/* Top Decorative Banner */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> Dành Cho Các Đội/Nhóm Dự Thi
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-dark-obsidian">
              CỔNG ĐĂNG NHẬP ĐỘI THI
            </h1>
            <p className="text-xs text-slate-500">
              Đăng nhập bằng Email & Mật khẩu đã đăng ký để quản lý hồ sơ và cập nhật thông tin tiết mục.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" /> Email Đã Đăng Ký *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-accent" /> Mật Khẩu *
                </label>
                <Link
                  href="/team/forgot-password"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 shadow-md shadow-accent/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Đăng Nhập Cổng Đội Thi
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Đội của bạn chưa gửi hồ sơ đăng ký?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Đăng Ký Hồ Sơ Mới Ngay <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
