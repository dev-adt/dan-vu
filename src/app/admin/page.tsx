'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  LayoutDashboard, Users, Heart, AlertOctagon, UserCheck,
  ShieldAlert, Ban, Download, CheckCircle, Trash2, Edit3, X, Save, UserPlus, PlusCircle
} from 'lucide-react';

interface FraudLog {
  id: string;
  teamName: string;
  ip: string;
  fingerprint: string;
  timestamp: string;
  score: number;
  status: 'valid' | 'flagged' | 'voided';
}

interface Team {
  id: string;
  created_at: string;
  team_name: string;
  organization?: string;
  member_count?: string;
  representative_name: string;
  phone: string;
  email: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performance_title: string;
  duration: string;
  description: string;
  technical_requirements: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface Judge {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authHeader, setAuthHeader] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'monitoring' | 'teams' | 'judges' | 'rankings'>('monitoring');

  // Dashboard state loaded from backend APIs
  const [stats, setStats] = useState({
    teamsCount: 0,
    votesCount: 0,
    fraudCount: 0,
    judgesCount: 0,
  });
  const [logs, setLogs] = useState<FraudLog[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);

  // Editing state for Team
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // New Judge creation state
  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [newJudgePassword, setNewJudgePassword] = useState('');
  const [newJudgeName, setNewJudgeName] = useState('');
  const [isCreatingJudge, setIsCreatingJudge] = useState(false);
  const [judgeError, setJudgeError] = useState('');

  // Load state from API when logged in
  useEffect(() => {
    if (isAdminLoggedIn && authHeader) {
      fetchStats();
      fetchTeams();
      fetchJudges();
      fetchRankings();
    }
  }, [isAdminLoggedIn, authHeader, activeTab]);

  // Fetch Rankings & Grades
  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const res = await fetch('/api/admin/scorecards', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings || []);
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // Fetch Dashboard Stats & Logs
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // Fetch Teams
  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/admin/teams', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  // Fetch Judges
  const fetchJudges = async () => {
    try {
      const res = await fetch('/api/admin/judges', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setJudges(data.judges);
      }
    } catch (err) {
      console.error('Failed to fetch judges:', err);
    }
  };

  // Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const token = 'Basic ' + btoa(username + ':' + password);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: token },
      });

      if (res.ok) {
        setAuthHeader(token);
        setIsAdminLoggedIn(true);
        // Save token in sessionStorage
        sessionStorage.setItem('admin_auth', token);
      } else {
        setLoginError('Sai tài khoản hoặc mật khẩu quản trị.');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Auto-restore session from sessionStorage on mount
  useEffect(() => {
    const cachedToken = sessionStorage.getItem('admin_auth');
    if (cachedToken) {
      setAuthHeader(cachedToken);
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Void a vote
  const handleVoidVote = async (id: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, is_valid: false }),
      });

      if (res.ok) {
        fetchStats();
      } else {
        alert('Lỗi khi hủy vote.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve / Reject a team submission
  const handleUpdateTeamStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchTeams();
        fetchStats();
      } else {
        alert('Cập nhật trạng thái đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited team details
  const handleSaveEditedTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    setIsSavingTeam(true);
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(editingTeam),
      });

      if (res.ok) {
        setEditingTeam(null);
        fetchTeams();
      } else {
        alert('Cập nhật thông tin đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTeam(false);
    }
  };

  // Delete a team
  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đội thi này khỏi cơ sở dữ liệu?')) return;

    try {
      const res = await fetch(`/api/admin/teams?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      if (res.ok) {
        fetchTeams();
        fetchStats();
      } else {
        alert('Xóa đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new judge account
  const handleCreateJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    setJudgeError('');
    setIsCreatingJudge(true);

    try {
      const res = await fetch('/api/admin/judges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          email: newJudgeEmail,
          password: newJudgePassword,
          fullName: newJudgeName,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setNewJudgeEmail('');
        setNewJudgePassword('');
        setNewJudgeName('');
        fetchJudges();
        fetchStats();
        alert('Tạo tài khoản giám khảo thành công.');
      } else {
        setJudgeError(result.error || 'Tạo tài khoản giám khảo thất bại.');
      }
    } catch (err) {
      setJudgeError('Lỗi kết nối máy chủ.');
    } finally {
      setIsCreatingJudge(false);
    }
  };

  // Delete a judge account
  const handleDeleteJudge = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản giám khảo này?')) return;

    try {
      const res = await fetch(`/api/admin/judges?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      if (res.ok) {
        fetchJudges();
        fetchStats();
      } else {
        alert('Xóa tài khoản giám khảo thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    if (rankings.length === 0) {
      alert('Không có dữ liệu để kết xuất.');
      return;
    }

    if (format === 'Excel') {
      let csvContent = '\uFEFF'; // UTF-8 BOM
      csvContent += 'Xếp Hạng,Mã Số,Tên Đội,Thể Loại,Tiết Mục,Giám Khảo Đã Chấm,Ý Tưởng (Trung bình),Kỹ Thuật (Trung bình),Trang Phục (Trung bình),Hiệu Ứng Sân Khấu (Trung bình),Điểm Trung Bình\n';
      
      rankings.forEach((r, index) => {
        const categoryLabel = r.category === 'dan_ca' ? 'Dân Ca' : r.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ';
        const row = [
          index + 1,
          r.id.substring(0, 8).toUpperCase(),
          `"${r.teamName.replace(/"/g, '""')}"`,
          `"${categoryLabel}"`,
          `"${r.performanceTitle.replace(/"/g, '""')}"`,
          r.gradedCount,
          r.avgConcept,
          r.avgTechnique,
          r.avgCostume,
          r.avgStage,
          r.averageScore
        ];
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Bang_xep_hang_diem_so_Nhip_buoc_Viet_Nam_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // PDF print
      setActiveTab('rankings');
      setTimeout(() => {
        window.print();
      }, 150);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <div className="print:hidden">
        <Navbar />
      </div>

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
                className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-95 transition-all shadow-sm mt-6 glow-crimson-hover cursor-pointer"
              >
                {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Admin'}
              </button>
            </form>
          </div>
        ) : (
          /* Enterprise Admin Dashboard Content */
          <div className="space-y-10">
            {/* Print Only Header */}
            <div className="hidden print:block text-center text-slate-900 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-wider font-heading">FESTIVAL DÂN CA DÂN VŨ QUỐC TẾ 2026</h1>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#00695C] mt-1">BÁO CÁO ĐIỂM SỐ & BẢNG XẾP HẠNG CHI TIẾT</h2>
              <p className="text-[10px] text-slate-500 mt-1.5">Xuất từ hệ thống quản trị lúc: {new Date().toLocaleString('vi-VN')}</p>
              <div className="border-b border-slate-300 w-full mt-4" />
            </div>

            {/* Title summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4 print:hidden">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">Cổng điều hành Admin</span>
                <h1 className="font-heading font-bold text-3xl text-slate-900">Real-time Analytics Dashboard</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Excel')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs font-semibold text-accent hover:bg-accent/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Xuất Excel
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs font-semibold text-primary hover:bg-primary/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Xuất PDF Điểm
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('admin_auth');
                    setIsAdminLoggedIn(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-600 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Real-time counters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
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

            {/* Dashboard Tab Navigation */}
            <div className="border-b border-slate-200 flex gap-4 print:hidden">
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'monitoring' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Giám Sát Bình Chọn
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'teams' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Quản Lý Đội Thi
              </button>
              <button
                onClick={() => setActiveTab('rankings')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'rankings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Bảng Điểm & Xếp Hạng
              </button>
              <button
                onClick={() => setActiveTab('judges')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'judges' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tài Khoản Giám Khảo
              </button>
            </div>

            {/* Content for Monitoring Tab */}
            {activeTab === 'monitoring' && (
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
                        {logs.length > 0 ? (
                          logs.map((log) => {
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
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Hủy Vote
                                    </button>
                                  ) : isVoided ? (
                                    <span className="text-slate-400 text-[10px]">Đã hủy</span>
                                  ) : (
                                    <span className="text-accent inline-flex items-center gap-1 text-[10px] font-semibold">
                                      <CheckCircle className="w-3.5 h-3.5" /> An toàn
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Chưa ghi nhận phiếu bầu nào trong hệ thống.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Teams Management Tab */}
            {activeTab === 'teams' && (
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl text-slate-900">Quản Lý Hồ Sơ Đăng Ký</h2>

                <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <tr>
                          <th className="px-6 py-4">Mã số</th>
                          <th className="px-6 py-4">Tên Đội</th>
                          <th className="px-6 py-4">Tiết mục / Thể loại</th>
                          <th className="px-6 py-4">Đại diện & SĐT</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {teams.length > 0 ? (
                          teams.map((team) => {
                            const isSubmitted = team.status === 'submitted';
                            const isApproved = team.status === 'approved';
                            const isRejected = team.status === 'rejected';

                            return (
                              <tr key={team.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-slate-500">
                                  {team.id.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-slate-800 block">{team.team_name}</span>
                                  {team.organization && <span className="text-[10px] text-slate-500 block">ĐV: {team.organization}</span>}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold block">{team.performance_title}</span>
                                  <span className="text-[10px] text-slate-500 block">
                                    {team.category === 'dan_ca' ? 'Dân Ca' : team.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'} ({team.duration})
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="block">{team.representative_name}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{team.phone}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {isApproved ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                                      Đã Duyệt
                                    </span>
                                  ) : isRejected ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                                      Từ Chối
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase animate-pulse">
                                      Chờ Duyệt
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                  {!isApproved && (
                                    <button
                                      onClick={() => handleUpdateTeamStatus(team.id, 'approved')}
                                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                                    >
                                      Duyệt
                                    </button>
                                  )}
                                  {!isRejected && (
                                    <button
                                      onClick={() => handleUpdateTeamStatus(team.id, 'rejected')}
                                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                                    >
                                      Từ chối
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setEditingTeam(team)}
                                    className="p-1 text-slate-500 hover:text-accent transition-colors cursor-pointer inline-block"
                                    title="Sửa thông tin"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeam(team.id)}
                                    className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer inline-block"
                                    title="Xóa vĩnh viễn"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                              Không tìm thấy đội đăng ký nào trong hệ thống.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Judges Tab */}
            {activeTab === 'judges' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: list of judges */}
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Danh Sách Giám Khảo</h2>

                  <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          <tr>
                            <th className="px-6 py-4">Họ và Tên</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Ngày tạo</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {judges.length > 0 ? (
                            judges.map((judge) => (
                              <tr key={judge.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800">
                                  {judge.full_name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-mono">
                                  {judge.email}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                  {new Date(judge.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteJudge(judge.id)}
                                    className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer inline-block"
                                    title="Xóa tài khoản"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                                Chưa có tài khoản giám khảo nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right: create judge form */}
                <div className="lg:col-span-4 space-y-4">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Tạo tài khoản Giám khảo</h2>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    {judgeError && (
                      <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-xl text-center font-semibold">
                        {judgeError}
                      </div>
                    )}

                    <form onSubmit={handleCreateJudge} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          value={newJudgeName}
                          onChange={(e) => setNewJudgeName(e.target.value)}
                          placeholder="Ví dụ: GS. NSND Lê Văn Minh"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email đăng nhập *</label>
                        <input
                          type="email"
                          required
                          value={newJudgeEmail}
                          onChange={(e) => setNewJudgeEmail(e.target.value)}
                          placeholder="giamkhao@nhipbuocvietnam.gov.vn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu ban đầu *</label>
                        <input
                          type="password"
                          required
                          value={newJudgePassword}
                          onChange={(e) => setNewJudgePassword(e.target.value)}
                          placeholder="Mật khẩu ít nhất 6 ký tự"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isCreatingJudge}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        {isCreatingJudge ? 'Đang khởi tạo...' : 'Tạo tài khoản'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Rankings Tab */}
            {activeTab === 'rankings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between print:hidden">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Bảng Điểm Sơ Khảo & Xếp Hạng Đội Thi</h2>
                  <span className="text-xs text-slate-500 font-medium">Sắp xếp theo Điểm Trung Bình giảm dần</span>
                </div>

                <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white print:border-none print:shadow-none print:bg-white print:text-black">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold print:bg-white print:text-black print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 text-center w-16">Xếp Hạng</th>
                          <th className="px-6 py-4">Mã số</th>
                          <th className="px-6 py-4">Tên Đội</th>
                          <th className="px-6 py-4">Tiết mục / Thể loại</th>
                          <th className="px-6 py-4 text-center">GK Đã Chấm</th>
                          <th className="px-6 py-4 text-center hidden md:table-cell print:table-cell">Chi tiết Tiêu chí (Trung bình)</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-800 print:text-black">Điểm Trung Bình</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs print:divide-y print:divide-black/20">
                        {isLoadingRankings ? (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Đang tính toán bảng điểm và xếp hạng...
                            </td>
                          </tr>
                        ) : rankings.length > 0 ? (
                          rankings.map((row, index) => {
                            return (
                              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors print:hover:bg-transparent">
                                <td className="px-6 py-4 text-center font-bold text-sm text-slate-700 print:text-black">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 font-mono font-semibold text-slate-500 print:text-black">
                                  {row.id.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-slate-900 block print:text-black">{row.teamName}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold block text-slate-800 print:text-black">{row.performanceTitle}</span>
                                  <span className="text-[10px] text-slate-500 block print:text-black">
                                    {row.category === 'dan_ca' ? 'Dân Ca' : row.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-slate-700 print:text-black">
                                  {row.gradedCount} giám khảo
                                </td>
                                <td className="px-6 py-4 text-center hidden md:table-cell print:table-cell text-slate-500 font-medium">
                                  {row.gradedCount > 0 ? (
                                    <div className="flex justify-center gap-3 text-[10px]">
                                      <span title="Nội dung & Ý tưởng">Ý tưởng: {row.avgConcept}/30</span>
                                      <span title="Kỹ thuật biểu diễn">Kỹ thuật: {row.avgTechnique}/40</span>
                                      <span title="Trang phục & Đạo cụ">Trang phục: {row.avgCostume}/20</span>
                                      <span title="Hiệu ứng sân khấu">Hiệu ứng: {row.avgStage}/10</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">Chưa có dữ liệu</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-extrabold text-sm text-primary print:text-black">
                                  {row.gradedCount > 0 ? `${row.averageScore} / 100` : 'Chưa chấm'}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Chưa có đội thi nào được duyệt để xếp hạng.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Print only sign off */}
                <div className="hidden print:flex justify-between mt-16 text-xs text-slate-800">
                  <div className="text-center w-48">
                    <p className="font-bold">Trưởng Ban Tổ Chức</p>
                    <p className="text-[10px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div className="text-center w-48">
                    <p className="font-bold">Đại Diện Hội Đồng Giám Khảo</p>
                    <p className="text-[10px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-slate-900">Sửa thông tin hồ sơ: {editingTeam.team_name}</h3>
              <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTeam} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Tên Đội *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.team_name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, team_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Đơn vị đại diện</label>
                  <input
                    type="text"
                    value={editingTeam.organization || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, organization: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Số lượng thành viên *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.member_count}
                    onChange={(e) => setEditingTeam({ ...editingTeam, member_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Trưởng đoàn đại diện *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.representative_name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, representative_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.phone}
                    onChange={(e) => setEditingTeam({ ...editingTeam, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingTeam.email}
                    onChange={(e) => setEditingTeam({ ...editingTeam, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Tên tiết mục *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.performance_title}
                    onChange={(e) => setEditingTeam({ ...editingTeam, performance_title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Thời lượng dự kiến *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.duration}
                    onChange={(e) => setEditingTeam({ ...editingTeam, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Mô tả ý tưởng</label>
                <textarea
                  value={editingTeam.description || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Yêu cầu kỹ thuật</label>
                <textarea
                  value={editingTeam.technical_requirements || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, technical_requirements: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSavingTeam}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  {isSavingTeam ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
