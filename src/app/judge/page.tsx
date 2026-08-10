'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserCheck, Eye, EyeOff, Lock, FileText, CheckCircle, Clock, LogOut, Key, X, Mail } from 'lucide-react';
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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password state
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');

  // Change password modal state (for authenticated judge)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

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

  // Handle Judge Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingForgot(true);
    setForgotSuccessMsg('');
    setForgotErrorMsg('');

    try {
      const res = await fetch('/api/judge/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setForgotSuccessMsg(data.message || 'Mật khẩu mới đã được gửi về email của bạn.');
        setForgotEmail('');
      } else {
        setForgotErrorMsg(data.error || 'Lỗi gửi yêu cầu cấp lại mật khẩu.');
      }
    } catch (err) {
      setForgotErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setIsSendingForgot(false);
    }
  };

  // Handle Judge Change Password (Logged in)
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePassError('Mật khẩu mới xác nhận không khớp.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setChangePassError('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setChangePassError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
        setIsChangingPassword(false);
        return;
      }

      const res = await fetch('/api/judge/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPasswordInput,
          newPassword: newPasswordInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setChangePassSuccess('Đổi mật khẩu thành công!');
        setOldPasswordInput('');
        setNewPasswordInput('');
        setConfirmNewPasswordInput('');
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setChangePassSuccess('');
        }, 1500);
      } else {
        setChangePassError(data.error || 'Đổi mật khẩu thất bại.');
      }
    } catch (err) {
      setChangePassError('Lỗi kết nối máy chủ.');
    } finally {
      setIsChangingPassword(false);
    }
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
          /* Login or Forgot Password Panel */
          <div className="max-w-md mx-auto glass-panel rounded-2xl p-8 shadow-xl space-y-6">
            {!isForgotPasswordMode ? (
              /* LOGIN FORM */
              <>
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
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Mật khẩu *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setForgotEmail(email);
                          setForgotSuccessMsg('');
                          setForgotErrorMsg('');
                        }}
                        className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-accent text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md mt-6 cursor-pointer"
                  >
                    {isLoggingIn ? 'Đang kiểm tra...' : 'Đăng Nhập'}
                  </button>
                </form>
              </>
            ) : (
              /* FORGOT PASSWORD FORM */
              <>
                <div className="text-center space-y-2">
                  <span className="inline-block p-3.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-2">
                    <Mail className="w-8 h-8" />
                  </span>
                  <h1 className="font-heading font-bold text-2xl text-slate-900">Quên Mật Khẩu Giám Khảo</h1>
                  <p className="text-xs text-slate-600">Nhập địa chỉ Email đăng ký Giám khảo. Mật khẩu mới ngẫu nhiên sẽ được tự động gửi về Email của bạn.</p>
                </div>

                {forgotSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-semibold">
                    {forgotSuccessMsg}
                  </div>
                )}

                {forgotErrorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl text-center font-semibold">
                    {forgotErrorMsg}
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Email Giám khảo *</label>
                    <input
                      type="email"
                      required
                      placeholder="giamkhao@nhipbuocvietnam.gov.vn"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingForgot}
                    className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    {isSendingForgot ? 'Đang gửi mật khẩu...' : 'Gửi Mật Khẩu Mới Qua Email'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordMode(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                    >
                      Quay lại Đăng nhập
                    </button>
                  </div>
                </form>
              </>
            )}
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
                  onClick={() => {
                    setIsChangePasswordOpen(true);
                    setChangePassError('');
                    setChangePassSuccess('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-accent text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-sm"
                  title="Đổi mật khẩu tài khoản"
                >
                  <Key className="w-4 h-4 text-accent" />
                  <span>Đổi mật khẩu</span>
                </button>
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
                <span className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </span>
              </div>
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bản nháp lưu</span>
                  <span className="block text-2xl font-bold text-slate-900 mt-1">{stats.draft} / {gradingList.length}</span>
                </div>
                <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-6 h-6" />
                </span>
              </div>
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Chưa đánh giá</span>
                  <span className="block text-2xl font-bold text-slate-900 mt-1">{stats.pending} / {gradingList.length}</span>
                </div>
                <span className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </span>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 border border-slate-200/60 rounded-xl shadow-sm">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Tìm tiết mục theo tên, đội thi, mã số..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={catFilter}
                  onChange={(e) => {
                    setCatFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-700"
                >
                  <option value="all">Tất cả Thể loại</option>
                  <option value="dan_ca">Dân Ca</option>
                  <option value="dan_vu">Dân Vũ</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-700"
                >
                  <option value="all">Tất cả Trạng thái</option>
                  <option value="submitted">Đã hoàn thành</option>
                  <option value="draft">Bản nháp</option>
                  <option value="pending">Chưa đánh giá</option>
                </select>
              </div>
            </div>

            {/* Performance List Table */}
            <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Mã số</th>
                      <th className="py-3.5 px-4">Tên Tiết mục</th>
                      <th className="py-3.5 px-4">Đội thi</th>
                      <th className="py-3.5 px-4">Trạng thái</th>
                      <th className="py-3.5 px-4">Điểm số</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {isLoadingList ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Đang tải danh sách tiết mục...
                        </td>
                      </tr>
                    ) : paginatedList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                          Không tìm thấy tiết mục nào phù hợp với bộ tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      paginatedList.map((perf) => (
                        <tr key={perf.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">
                            #{perf.id.substring(0, 8)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {perf.performanceTitle}
                            <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                              {perf.category === 'dan_ca' ? 'Dân Ca' : 'Dân Vũ'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{perf.teamName}</td>
                          <td className="py-3.5 px-4">
                            {perf.status === 'submitted' ? (
                              <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-200">
                                <CheckCircle className="w-3 h-3" /> Đã hoàn thành
                              </span>
                            ) : perf.status === 'draft' ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200">
                                <Clock className="w-3 h-3" /> Bản nháp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                                Chưa chấm
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-accent text-sm">
                            {perf.score ? `${perf.score}/100` : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/judge/score/${perf.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-opacity-90 transition-all shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {perf.status === 'submitted' ? 'Xem lại' : 'Chấm điểm'}
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(currentPage, filteredGradingList.length, pageSize, setCurrentPage)}
            </div>

            {/* Judge Change Password Modal */}
            {isChangePasswordOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-slate-200">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-accent" />
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Đổi Mật Khẩu Giám Khảo
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {changePassSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-semibold">
                      {changePassSuccess}
                    </div>
                  )}

                  {changePassError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-semibold">
                      {changePassError}
                    </div>
                  )}

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu hiện tại *</label>
                      <div className="relative">
                        <input
                          type={showOldPass ? 'text' : 'password'}
                          required
                          value={oldPasswordInput}
                          onChange={(e) => setOldPasswordInput(e.target.value)}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu mới *</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Xác nhận mật khẩu mới *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          required
                          value={confirmNewPasswordInput}
                          onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangePasswordOpen(false)}
                        className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-1/2 py-2.5 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
