'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Vui lòng nhập Email liên hệ khi đăng ký.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/team/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Không thể cấp lại mật khẩu. Vui lòng kiểm tra lại email.');
        return;
      }

      setSuccessMsg(data.message || 'Mật khẩu ngẫu nhiên mới đã được gửi tới email của bạn.');
      setEmail('');
    } catch (err: any) {
      setError('Lỗi kết nối khi gửi yêu cầu cấp lại mật khẩu.');
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
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5" /> Khôi Phục Mật Khẩu
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-dark-obsidian">
              QUÊN MẬT KHẨU CỔNG ĐỘI THI
            </h1>
            <p className="text-xs text-slate-500">
              Nhập email đã đăng ký của bạn. Hệ thống sẽ tạo một mật khẩu ngẫu nhiên mới và gửi trực tiếp tới hòm thư của bạn.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gửi mật khẩu thành công!</span>
              </div>
              <p>{successMsg}</p>
              <p className="text-[11px] text-emerald-700 italic">* Hãy kiểm tra kỹ hộp thư đến và cả thư mục Spam/Rác trong 5 phút tới.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" /> Email Liên Hệ Đã Đăng Ký *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của đội thi"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang xử lý & gửi email...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Gửi Mật Khẩu Mới Ngẫu Nhiên
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/team/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-dark-obsidian"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng Nhập
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
