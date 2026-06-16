'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserCheck, Eye, Lock, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface PerformanceGrading {
  id: string;
  teamName: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu';
  status: 'pending' | 'draft' | 'submitted';
  score?: number;
}

const mockGradingList: PerformanceGrading[] = [
  {
    id: 'dc-001',
    teamName: 'Đoàn Nghệ Thuật CLB Sen Vàng',
    performanceTitle: 'Liên khúc Dân ca Ba miền',
    category: 'dan_ca',
    status: 'submitted',
    score: 88,
  },
  {
    id: 'dv-002',
    teamName: 'CLB Dân Vũ Hòa Bình',
    performanceTitle: 'Vũ điệu Gặt Lúa Tây Bắc',
    category: 'dan_vu',
    status: 'draft',
    score: 72,
  },
  {
    id: 'dc-003',
    teamName: 'CLB Dân Ca Sông Trà',
    performanceTitle: 'Điệu Lý Giao Duyên Xứ Quảng',
    category: 'dan_ca',
    status: 'pending',
  },
  {
    id: 'dv-004',
    teamName: 'Nhóm Múa Chăm Hữu Nghị',
    performanceTitle: 'Vũ điệu Tháp Cổ Chămpa',
    category: 'dan_vu',
    status: 'submitted',
    score: 94,
  },
];

export default function JudgePortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpField) {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        setShowOtpField(true);
      }, 1000);
    } else {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        setIsAuthenticated(true);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {!isAuthenticated ? (
          /* Login Panel */
          <div className="max-w-md mx-auto bg-dark-slate/40 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block p-3.5 bg-accent/20 border border-accent/30 text-accent rounded-full mb-2">
                <UserCheck className="w-8 h-8" />
              </span>
              <h1 className="font-heading font-bold text-2xl text-light-cream">Cổng Giám Khảo Bảo Mật</h1>
              <p className="text-xs text-light-alabaster/60">Vui lòng nhập tài khoản và mã xác thực 2FA được BTC cung cấp.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {!showOtpField ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-light-alabaster/40">Email tài khoản *</label>
                    <input
                      type="email"
                      required
                      placeholder="giamkhao@nhipbuocvietnam.gov.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-light-alabaster/40">Mật khẩu *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-secondary">Mã bảo mật 2FA OTP *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập 6 số từ Google Authenticator"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-dark-obsidian border border-secondary/40 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none text-center font-bold tracking-[0.5em] text-secondary transition-colors"
                  />
                  <p className="text-[10px] text-light-alabaster/40 mt-1.5 text-center">Mã OTP làm mới mỗi 30 giây.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-accent text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md mt-6"
              >
                {isLoggingIn ? 'Đang kiểm tra...' : showOtpField ? 'Xác thực & Vào Portal' : 'Đăng Nhập'}
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Panel */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-accent font-semibold">Bảng điều khiển Giám khảo</span>
                <h1 className="font-heading font-bold text-3xl text-light-cream mt-1">Danh sách Tiết mục chấm sơ khảo</h1>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs text-light-cream">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span>Giám khảo: <strong>GS. NSND Lê Văn Minh</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-slate/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-light-alabaster/40 uppercase tracking-wider">Đã hoàn thành</span>
                  <span className="block text-2xl font-bold text-light-cream mt-1">2 / 4</span>
                </div>
                <CheckCircle className="w-8 h-8 text-accent opacity-60" />
              </div>
              <div className="bg-dark-slate/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-light-alabaster/40 uppercase tracking-wider">Bản nháp lưu</span>
                  <span className="block text-2xl font-bold text-secondary mt-1">1 / 4</span>
                </div>
                <Clock className="w-8 h-8 text-secondary opacity-60" />
              </div>
              <div className="bg-dark-slate/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-light-alabaster/40 uppercase tracking-wider">Chưa đánh giá</span>
                  <span className="block text-2xl font-bold text-primary mt-1">1 / 4</span>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-60" />
              </div>
            </div>

            <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-wider text-light-alabaster/40">
                    <tr>
                      <th className="px-6 py-4">Mã số</th>
                      <th className="px-6 py-4">Tên Tiết Mục</th>
                      <th className="px-6 py-4">Đội thi</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-center">Điểm số</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {mockGradingList.map((perf) => {
                      const isSubmitted = perf.status === 'submitted';
                      const isDraft = perf.status === 'draft';
                      const isPending = perf.status === 'pending';

                      return (
                        <tr key={perf.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold uppercase text-accent">
                            {perf.id}
                          </td>
                          <td className="px-6 py-4 font-heading font-semibold text-light-cream">
                            {perf.performanceTitle}
                          </td>
                          <td className="px-6 py-4 text-light-alabaster/60">
                            {perf.teamName}
                          </td>
                          <td className="px-6 py-4">
                            {isSubmitted ? (
                              <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" /> Đã gửi điểm
                              </span>
                            ) : isDraft ? (
                              <span className="inline-flex items-center gap-1.5 text-secondary font-semibold">
                                <Clock className="w-3.5 h-3.5" /> Đang chấm nháp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-light-alabaster/40">
                                <Lock className="w-3.5 h-3.5" /> Chưa chấm
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-light-cream">
                            {perf.score ? `${perf.score} / 100` : '--'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isSubmitted ? (
                              <button
                                disabled
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-light-alabaster/30 font-bold uppercase tracking-wider"
                              >
                                Đã Khóa
                              </button>
                            ) : (
                              <Link
                                href={`/judge/score/${perf.id}`}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all ${
                                  isDraft
                                    ? 'bg-secondary text-dark-obsidian hover:bg-opacity-90'
                                    : 'bg-accent text-white hover:bg-opacity-90 glow-gold-hover'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5" /> {isDraft ? 'Sửa nháp' : 'Vào Chấm'}
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
