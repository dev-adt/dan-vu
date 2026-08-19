'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (method === 'email' && !email.trim()) {
      setError('Vui lòng nhập Email liên hệ khi đăng ký.');
      return;
    }

    if (method === 'phone') {
      if (!phone.trim()) {
        setError('Vui lòng nhập Số điện thoại liên hệ đã đăng ký.');
        return;
      }
      if (!newEmail.trim()) {
        setError('Vui lòng nhập Email để nhận mật khẩu mới.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload = method === 'email'
        ? { email: email.trim() }
        : { phone: phone.trim(), newEmail: newEmail.trim() };

      const res = await fetch('/api/team/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Không thể cấp lại mật khẩu. Vui lòng kiểm tra lại thông tin.');
        return;
      }

      setSuccessMsg(data.message || 'Mật khẩu ngẫu nhiên mới đã được gửi tới email của bạn.');
      setEmail('');
      setPhone('');
      setNewEmail('');
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
          style={{ maxWidth: '460px', width: '100%', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}
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
              Hệ thống sẽ tạo một mật khẩu ngẫu nhiên mới và gửi trực tiếp tới hòm thư email của bạn.
            </p>
          </div>

          {/* Method Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === 'email'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Qua Email Đã Đăng Ký
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === 'phone'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Qua Số Điện Thoại
            </button>
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
            {method === 'email' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email Liên Hệ Đã Đăng Ký *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của đội thi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-primary font-mono text-sm">📞</span> Số Điện Thoại Liên Hệ Đã Đăng Ký *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0988xxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email Để Nhận Mật Khẩu Mới *
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Nhập email bạn muốn nhận mật khẩu..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    * Hệ thống sẽ tự động ghép Email này vào tài khoản của bạn để gửi mật khẩu.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#c62828', color: '#ffffff', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer' }}
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
