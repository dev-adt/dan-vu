'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserCheck, Eye, Lock, FileText, CheckCircle, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PerformanceGrading {
  id: string;
  teamName: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu';
  status: 'pending' | 'draft' | 'submitted';
  score?: number | null;
}

export default function JudgePortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [gradingList, setGradingList] = useState<PerformanceGrading[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [judgeName, setJudgeName] = useState('Ban Giám Khảo');

  // Stats computed dynamically
  const stats = {
    completed: gradingList.filter((g) => g.status === 'submitted').length,
    draft: gradingList.filter((g) => g.status === 'draft').length,
    pending: gradingList.filter((g) => g.status === 'pending').length,
  };

  useEffect(() => {
    // Check if already authenticated on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setJudgeName(session.user.user_metadata?.full_name || 'Ban Giám Khảo');
        loadGradingList(session.access_token);
      }
    });
  }, []);

  const loadGradingList = async (accessToken: string) => {
    setIsLoadingList(true);
    try {
      const res = await fetch('/api/judge/scorecards', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setGradingList(data.list);
      }
    } catch (err) {
      console.error('Error fetching grading list:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (!showOtpField) {
      // 1. Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Đăng nhập thất bại: ' + error.message);
        setIsLoggingIn(false);
        return;
      }

      setJudgeName(data.user?.user_metadata?.full_name || 'Ban Giám Khảo');
      setIsLoggingIn(false);
      setShowOtpField(true); // Proceed to OTP verification step
    } else {
      // Simulate 2FA OTP matching (accepts any 6 digits for testing)
      if (otp.length === 6) {
        setIsLoggingIn(false);
        setIsAuthenticated(true);
        
        // Load data
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          loadGradingList(session.access_token);
        }
      } else {
        alert('Mã OTP không hợp lệ. Vui lòng nhập 6 chữ số.');
        setIsLoggingIn(false);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setShowOtpField(false);
    setEmail('');
    setPassword('');
    setOtp('');
    setGradingList([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative selection:bg-accent selection:text-white">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full z-10">
        {!isAuthenticated ? (
          /* Login Panel */
          <div className="max-w-md mx-auto glass-panel rounded-2xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block p-3.5 bg-accent/10 border border-accent/20 text-accent rounded-full mb-2">
                <UserCheck className="w-8 h-8" />
              </span>
              <h1 className="font-heading font-bold text-2xl text-slate-900">Cổng Giám Khảo Bảo Mật</h1>
              <p className="text-xs text-slate-600">Vui lòng nhập tài khoản và mã xác thực 2FA được BTC cung cấp.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {!showOtpField ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Email tài khoản *</label>
                    <input
                      type="email"
                      required
                      placeholder="giamkhao@nhipbuocvietnam.gov.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Mật khẩu *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-accent">Mã bảo mật 2FA OTP *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white border border-secondary rounded-xl px-4 py-3 text-sm focus:border-accent focus:outline-none text-center font-bold tracking-[0.5em] text-accent transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 text-center">Nhập 6 số bất kỳ để hoàn tất xác minh 2FA.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-accent text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md mt-6 cursor-pointer"
              >
                {isLoggingIn ? 'Đang kiểm tra...' : showOtpField ? 'Xác thực & Vào Portal' : 'Đăng Nhập'}
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Panel */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-accent font-semibold">Bảng điều khiển Giám khảo</span>
                <h1 className="font-heading font-bold text-3xl text-slate-900 mt-1">Danh sách Tiết mục chấm sơ khảo</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs text-slate-800 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Giám khảo: <strong>{judgeName}</strong></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-primary cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Đã hoàn thành</span>
                  <span className="block text-2xl font-bold text-slate-900 mt-1">{stats.completed} / {gradingList.length}</span>
                </div>
                <CheckCircle className="w-8 h-8 text-accent opacity-80" />
              </div>
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bản nháp lưu</span>
                  <span className="block text-2xl font-bold text-amber-600 mt-1">{stats.draft} / {gradingList.length}</span>
                </div>
                <Clock className="w-8 h-8 text-amber-500 opacity-80" />
              </div>
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Chưa đánh giá</span>
                  <span className="block text-2xl font-bold text-primary mt-1">{stats.pending} / {gradingList.length}</span>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-80" />
              </div>
            </div>

            <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-md bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Mã số</th>
                      <th className="px-6 py-4">Tên Tiết Mục</th>
                      <th className="px-6 py-4">Đội thi</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-center">Điểm số</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {isLoadingList ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                          Đang nạp danh sách chấm điểm...
                        </td>
                      </tr>
                    ) : gradingList.length > 0 ? (
                      gradingList.map((perf) => {
                        const isSubmitted = perf.status === 'submitted';
                        const isDraft = perf.status === 'draft';

                        return (
                          <tr key={perf.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold uppercase text-accent">
                              {perf.id.substring(0, 8).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 font-heading font-semibold text-slate-950">
                              {perf.performanceTitle}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {perf.teamName}
                            </td>
                            <td className="px-6 py-4">
                              {isSubmitted ? (
                                <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
                                  <CheckCircle className="w-3.5 h-3.5" /> Đã gửi điểm
                                </span>
                              ) : isDraft ? (
                                <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold">
                                  <Clock className="w-3.5 h-3.5" /> Đang chấm nháp
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-slate-400">
                                  <Lock className="w-3.5 h-3.5" /> Chưa chấm
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-slate-900">
                              {perf.score ? `${perf.score} / 100` : '--'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isSubmitted ? (
                                <button
                                  disabled
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider"
                                >
                                  Đã Khóa
                                </button>
                              ) : (
                                <Link
                                  href={`/judge/score/${perf.id}`}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all ${
                                    isDraft
                                      ? 'bg-secondary text-slate-900 hover:bg-opacity-90'
                                      : 'bg-accent text-white hover:bg-opacity-90 glow-gold-hover'
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5" /> {isDraft ? 'Sửa nháp' : 'Vào Chấm'}
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                          Chưa có đội thi nào được duyệt để chấm điểm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
