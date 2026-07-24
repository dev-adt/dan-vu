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
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [gradingList, setGradingList] = useState<PerformanceGrading[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [judgeName, setJudgeName] = useState('Ban Giám Khảo');

  // Search, Filters & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Stats computed dynamically
  const stats = {
    completed: gradingList.filter((g) => g.status === 'submitted').length,
    draft: gradingList.filter((g) => g.status === 'draft').length,
    pending: gradingList.filter((g) => g.status === 'pending').length,
  };

  const filteredGradingList = gradingList.filter((perf) => {
    const matchesSearch =
      perf.performanceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perf.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perf.id.substring(0, 8).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = catFilter === 'all' ? true : perf.category === catFilter;
    const matchesStatus = statusFilter === 'all' ? true : perf.status === statusFilter;
    
    return matchesSearch && matchesCat && matchesStatus;
  });

  const paginatedList = filteredGradingList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderPagination = (page: number, totalItems: number, size: number, onPageChange: (p: number) => void) => {
    const totalPages = Math.ceil(totalItems / size);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs font-semibold text-slate-500">
        <div>
          Hiển thị từ {((page - 1) * size) + 1} đến {Math.min(page * size, totalItems)} trong tổng số {totalItems} tiết mục
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg border font-bold flex items-center justify-center cursor-pointer transition-all ${
                  page === pageNum
                    ? 'border-accent bg-accent text-white'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Check if already authenticated on mount
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session && session.user?.user_metadata?.role === 'judge') {
        const name = session.user.user_metadata?.full_name || session.user.email || 'Ban Giám Khảo';
        loadGradingList(session.access_token, name);
      } else {
        setIsAuthenticated(false);
        setJudgeName('Ban Giám Khảo');
        setGradingList([]);
      }
    });
  }, []);

  const loadGradingList = async (accessToken: string, judgeDisplayName?: string) => {
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
        if (judgeDisplayName) {
          setJudgeName(judgeDisplayName);
        }
        setIsAuthenticated(true);
      } else {
        // Not a judge account -> deny judge portal access
        setIsAuthenticated(false);
        setJudgeName('Ban Giám Khảo');
        setGradingList([]);
      }
    } catch (err) {
      console.error('Error fetching grading list:', err);
      setIsAuthenticated(false);
      setJudgeName('Ban Giám Khảo');
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Đăng nhập thất bại: ' + error.message);
      setIsLoggingIn(false);
      return;
    }

    if (data.session) {
      setJudgeName(data.user?.user_metadata?.full_name || 'Ban Giám Khảo');
      const res = await fetch('/api/judge/scorecards', {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (res.ok) {
        const resData = await res.json();
        setGradingList(resData.list);
        setIsAuthenticated(true);
      } else {
        alert('Tài khoản này không có quyền truy cập Cổng Giám Khảo.');
        setIsAuthenticated(false);
      }
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
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
              <p className="text-xs text-slate-600">Vui lòng nhập tài khoản và mật khẩu được Ban Tổ Chức cung cấp.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-accent text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md mt-6 cursor-pointer"
              >
                {isLoggingIn ? 'Đang kiểm tra...' : 'Đăng Nhập'}
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

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-full md:flex-1">
                <input
                  type="text"
                  placeholder="Tìm tiết mục theo tên, đội thi, mã số..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={catFilter}
                  onChange={(e) => {
                    setCatFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                >
                  <option value="all">Tất cả Thể loại</option>
                  <option value="dan_ca">Dân Ca</option>
                  <option value="dan_vu">Dân Vũ</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                >
                  <option value="all">Tất cả Trạng thái</option>
                  <option value="pending">Chưa chấm</option>
                  <option value="draft">Đang chấm nháp</option>
                  <option value="submitted">Đã hoàn thành</option>
                </select>
              </div>
            </div>

            <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-md bg-white p-4">
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
                    ) : paginatedList.length > 0 ? (
                      paginatedList.map((perf) => {
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
                          Không tìm thấy tiết mục nào phù hợp với bộ tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(currentPage, filteredGradingList.length, pageSize, setCurrentPage)}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
