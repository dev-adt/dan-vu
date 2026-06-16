'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LayoutDashboard, Users, Heart, AlertOctagon, UserCheck, ShieldAlert, Ban, Download, CheckCircle } from 'lucide-react';

interface FraudLog {
  id: string;
  teamName: string;
  ip: string;
  fingerprint: string;
  timestamp: string;
  score: number;
  status: 'valid' | 'flagged' | 'voided';
}

const mockFraudLogs: FraudLog[] = [
  {
    id: 'log-01',
    teamName: 'Nhóm Múa Chăm Hữu Nghị',
    ip: '113.161.42.10',
    fingerprint: 'canvas_hash_a1f9e2b8',
    timestamp: '2026-06-16 11:20:44',
    score: 0.12,
    status: 'flagged',
  },
  {
    id: 'log-02',
    teamName: 'Đoàn Nghệ Thuật CLB Sen Vàng',
    ip: '42.119.89.201',
    fingerprint: 'canvas_hash_7c62d04a',
    timestamp: '2026-06-16 11:18:02',
    score: 0.95,
    status: 'valid',
  },
  {
    id: 'log-03',
    teamName: 'CLB Dân Vũ Hòa Bình',
    ip: '113.161.42.10',
    fingerprint: 'canvas_hash_a1f9e2b8',
    timestamp: '2026-06-16 11:15:30',
    score: 0.08,
    status: 'flagged',
  },
  {
    id: 'log-04',
    teamName: 'CLB Dân Ca Sông Trà',
    ip: '172.56.21.98',
    fingerprint: 'canvas_hash_d389a9f2',
    timestamp: '2026-06-16 11:10:15',
    score: 0.88,
    status: 'valid',
  },
];

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [logs, setLogs] = useState<FraudLog[]>(mockFraudLogs);
  const [stats, setStats] = useState({
    teamsCount: 52,
    votesCount: 12074,
    fraudCount: 14,
    judgesCount: 5,
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    setTimeout(() => {
      setIsLoggingIn(false);
      if (username === 'admin' && password === 'admin') {
        setIsAdminLoggedIn(true);
      } else {
        setLoginError('Sai tài khoản hoặc mật khẩu quản trị.');
      }
    }, 1000);
  };

  const handleVoidVote = (id: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'voided' as const } : l))
    );
    setStats((prev) => ({
      ...prev,
      votesCount: prev.votesCount - 1,
      fraudCount: prev.fraudCount - 1,
    }));
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    alert(`Đang khởi tạo đường ống kết xuất báo cáo định dạng ${format}...`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!isAdminLoggedIn ? (
          /* Secure Admin Login Gate */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md space-y-6 mt-10">
            <div className="text-center space-y-2">
              <span className="inline-block p-3.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-2">
                <LayoutDashboard className="w-8 h-8" />
              </span>
              <h1 className="font-heading font-bold text-2xl text-slate-900">Bảng điều hành Quản trị viên</h1>
              <p className="text-xs text-slate-500">Cổng truy cập riêng tư dành cho Ban Tổ Chức Festival 2026.</p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tên đăng nhập *</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-95 transition-all shadow-sm mt-6 glow-crimson-hover"
              >
                {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Admin'}
              </button>
            </form>
          </div>
        ) : (
          /* Enterprise Admin Dashboard Content */
          <div className="space-y-10">
            {/* Title summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">Cổng điều hành Admin</span>
                <h1 className="font-heading font-bold text-3xl text-slate-900">Real-time Analytics Dashboard</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Excel')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs font-semibold text-accent hover:bg-accent/25 transition-all"
                >
                  <Download className="w-4 h-4" /> Xuất Excel
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs font-semibold text-primary hover:bg-primary/25 transition-all"
                >
                  <Download className="w-4 h-4" /> Xuất PDF Điểm
                </button>
              </div>
            </div>

            {/* Real-time counters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Đội Dự Thi</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.teamsCount}</span>
                </div>
                <Users className="w-8 h-8 text-accent opacity-65" />
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Lượt Bình Chọn</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.votesCount.toLocaleString()}</span>
                </div>
                <Heart className="w-8 h-8 text-primary opacity-65" />
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lượt Nghi Vấn Fraud</span>
                  <span className="block text-3xl font-extrabold text-secondary mt-1">{stats.fraudCount}</span>
                </div>
                <AlertOctagon className="w-8 h-8 text-secondary opacity-65" />
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Giám Khảo Chấm</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.judgesCount}</span>
                </div>
                <UserCheck className="w-8 h-8 text-accent opacity-65" />
              </div>
            </div>

            {/* Voter Audit log */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-secondary" />
                <h2 className="font-heading font-bold text-xl text-slate-900">Nhật ký Giám sát Bình chọn bất thường</h2>
              </div>

              <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4">Thời gian</th>
                        <th className="px-6 py-4">Tiết mục</th>
                        <th className="px-6 py-4">Địa chỉ IP</th>
                        <th className="px-6 py-4">Device Fingerprint</th>
                        <th className="px-6 py-4 text-center">Hệ số reCAPTCHA</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {logs.map((log) => {
                        const isFlagged = log.status === 'flagged';
                        const isVoided = log.status === 'voided';
                        const isLowScore = log.score < 0.3;

                        return (
                          <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-4 text-slate-600 font-mono">
                              {log.timestamp}
                            </td>
                            <td className="px-6 py-4 font-heading font-semibold text-slate-800">
                              {log.teamName}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-600">
                              {log.ip}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">
                              {log.fingerprint}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`font-semibold ${isLowScore ? 'text-primary' : 'text-accent'}`}>
                                {log.score}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {isVoided ? (
                                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                  Đã hủy
                                </span>
                              ) : isFlagged ? (
                                <span className="text-secondary font-semibold uppercase tracking-wider text-[10px] animate-pulse">
                                  Nghi vấn
                                </span>
                              ) : (
                                <span className="text-accent font-semibold uppercase tracking-wider text-[10px]">
                                  Hợp lệ
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isFlagged ? (
                                <button
                                  onClick={() => handleVoidVote(log.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-sm"
                                >
                                  <Ban className="w-3.5 h-3.5" /> Hủy Vote
                                </button>
                              ) : isVoided ? (
                                <span className="text-slate-400 text-[10px]">Đã xử lý</span>
                              ) : (
                                <span className="text-accent inline-flex items-center gap-1 text-[10px] font-semibold">
                                  <CheckCircle className="w-3.5 h-3.5" /> An toàn
                                </span>
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
