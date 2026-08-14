'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  Save,
  Upload,
  Video,
  Music,
  FileText,
  Phone,
  Mail,
  Building,
  Award,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
  X,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export interface PerformanceFormItem {
  id: string;
  title: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  duration: string;
  description: string;
  technicalRequirements?: string;
  audioUrl?: string;
  videoUrl?: string;
}

const defaultPerformances: PerformanceFormItem[] = [
  { id: 'p1', title: '', category: 'dan_ca', duration: '', description: '', technicalRequirements: '', audioUrl: '', videoUrl: '' },
  { id: 'p2', title: '', category: 'dan_ca', duration: '', description: '', technicalRequirements: '', audioUrl: '', videoUrl: '' },
  { id: 'p3', title: '', category: 'dan_ca', duration: '', description: '', technicalRequirements: '', audioUrl: '', videoUrl: '' },
];

export default function TeamDashboardPage() {
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [activePerfTab, setActivePerfTab] = useState(0);

  // Form edit state
  const [editForm, setEditForm] = useState({
    teamName: '',
    organization: '',
    memberCount: '',
    representativeName: '',
    phone: '',
    email: '',
    photoUrl: '',
  });

  const [performances, setPerformances] = useState<PerformanceFormItem[]>(defaultPerformances);

  // Password change state
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá giới hạn 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (.jpg, .jpeg, .png).');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUrl = `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80`;
        setEditForm((prev) => ({ ...prev, photoUrl: mockUrl }));
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `team-photos/${fileName}`;

      const { error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setEditForm((prev) => ({ ...prev, photoUrl: publicUrl }));
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert('Không thể tải lên ảnh: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const updateActivePerformance = (field: keyof PerformanceFormItem, value: any) => {
    setPerformances((prev) => {
      const updated = [...prev];
      updated[activePerfTab] = {
        ...updated[activePerfTab],
        [field]: value,
      };
      return updated;
    });
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (!passForm.oldPassword || !passForm.newPassword || !passForm.confirmNewPassword) {
      setPassMessage({ text: 'Vui lòng nhập đầy đủ cả 3 ô mật khẩu.', type: 'error' });
      return;
    }

    if (passForm.newPassword.trim().length < 6) {
      setPassMessage({ text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.', type: 'error' });
      return;
    }

    if (passForm.newPassword !== passForm.confirmNewPassword) {
      setPassMessage({ text: 'Mật khẩu mới và Xác nhận mật khẩu mới không trùng khớp.', type: 'error' });
      return;
    }

    setPassSaving(true);
    try {
      const res = await fetch('/api/team/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: team.id,
          oldPassword: passForm.oldPassword,
          newPassword: passForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPassMessage({ text: data.error || 'Đổi mật khẩu thất bại.', type: 'error' });
        return;
      }

      setPassMessage({ text: data.message || 'Đổi mật khẩu thành công!', type: 'success' });
      setPassForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      setPassMessage({ text: 'Lỗi máy chủ khi đổi mật khẩu.', type: 'error' });
    } finally {
      setPassSaving(false);
    }
  };

  const loadProfile = async (teamId: string) => {
    try {
      const res = await fetch(`/api/team/profile?id=${teamId}`);
      const data = await res.json();
      if (res.ok && data.team) {
        setTeam(data.team);
        // Populate basic edit form
        setEditForm({
          teamName: data.team.team_name || '',
          organization: data.team.organization || '',
          memberCount: data.team.member_count || '',
          representativeName: data.team.representative_name || '',
          phone: data.team.phone || '',
          email: data.team.email || '',
          photoUrl: data.team.photo_url || '',
        });

        // Populate 3 performances
        if (Array.isArray(data.team.performances) && data.team.performances.length > 0) {
          const perfs = [...data.team.performances];
          while (perfs.length < 3) {
            perfs.push({
              id: `p${perfs.length + 1}`,
              title: '',
              category: 'dan_ca',
              duration: '',
              description: '',
              technicalRequirements: '',
              audioUrl: '',
              videoUrl: '',
            });
          }
          setPerformances(perfs);
        } else {
          setPerformances([
            {
              id: 'p1',
              title: data.team.performance_title || '',
              category: data.team.category || 'dan_ca',
              duration: data.team.duration || '',
              description: data.team.description || '',
              technicalRequirements: data.team.technical_requirements || '',
              audioUrl: data.team.audio_url || '',
              videoUrl: data.team.video_url || '',
            },
            {
              id: 'p2',
              title: '',
              category: 'dan_ca',
              duration: '',
              description: '',
              technicalRequirements: '',
              audioUrl: '',
              videoUrl: '',
            },
            {
              id: 'p3',
              title: '',
              category: 'dan_ca',
              duration: '',
              description: '',
              technicalRequirements: '',
              audioUrl: '',
              videoUrl: '',
            },
          ]);
        }
      } else {
        router.push('/team/login');
      }
    } catch (err) {
      console.error('Error loading team profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessionStr = sessionStorage.getItem('team_session');
    if (!sessionStr) {
      router.push('/team/login');
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      if (parsed?.id) {
        loadProfile(parsed.id);
      } else {
        router.push('/team/login');
      }
    } catch {
      router.push('/team/login');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('team_session');
    router.push('/team/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    setMessage(null);
    setSaving(true);

    try {
      const payload: any = {
        id: team.id,
        team_name: editForm.teamName,
        organization: editForm.organization,
        member_count: editForm.memberCount,
        representative_name: editForm.representativeName,
        phone: editForm.phone,
        email: editForm.email,
        photo_url: editForm.photoUrl,
        performances: performances,
        // Backward compatibility
        performance_title: performances[0]?.title || '',
        category: performances[0]?.category || 'dan_ca',
        duration: performances[0]?.duration || '',
        description: performances[0]?.description || '',
        technical_requirements: performances[0]?.technicalRequirements || '',
        audio_url: performances[0]?.audioUrl || '',
        video_url: performances[0]?.videoUrl || '',
      };

      const res = await fetch('/api/team/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Cập nhật hồ sơ thất bại.', type: 'error' });
        return;
      }

      if (data.isPending) {
        setMessage({
          text: 'Yêu cầu cập nhật thông tin 3 tiết mục đã được gửi đến Ban Tổ Chức để xem xét duyệt.',
          type: 'warning',
        });
        setTeam({ ...team, has_pending_update: true });
      } else {
        setMessage({ text: 'Cập nhật thông tin hồ sơ thành công!', type: 'success' });
        setTeam(data.team);
      }
    } catch (err) {
      setMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Đang tải hồ sơ đội thi...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPerf = performances[activePerfTab] || performances[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-dark-obsidian">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Top Header & Team Identity */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md font-extrabold text-2xl shrink-0 overflow-hidden">
              {editForm.photoUrl ? (
                <img src={editForm.photoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                team.team_name?.charAt(0) || 'Đ'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Mã hồ sơ: {team.id?.substring(0, 8).toUpperCase()}
                </span>
                {team.status === 'approved' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" /> Đã Duyệt Chính Thức
                  </span>
                ) : team.status === 'rejected' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3" /> Từ Chối
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Chờ Ban Tổ Chức Duyệt
                  </span>
                )}
              </div>
              <h1 className="font-heading font-extrabold text-2xl text-dark-obsidian mt-1">
                {team.team_name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Trưởng đoàn: <strong className="text-slate-700">{team.representative_name}</strong> | Đơn vị: {team.organization || 'Tự do'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Đăng Xuất
            </button>
          </div>
        </div>

        {/* Warning notification if pending changes */}
        {team.has_pending_update && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs shadow-xs"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hồ sơ có yêu cầu chỉnh sửa đang chờ Ban Tổ Chức phê duyệt.</p>
              <p className="text-amber-700 mt-0.5">
                Thông tin chỉnh sửa của bạn đang được kiểm duyệt. Các thông tin hiện hành trên cổng bình chọn sẽ được cập nhật sau khi BTC chấp thuận.
              </p>
            </div>
          </motion.div>
        )}

        {/* Main Save Notification Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-xs ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : message.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          {/* SECTION 1: Thông tin đội thi & Trưởng đoàn */}
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-dark-obsidian flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" /> 1. Thông Tin Đội Thi & Trưởng Đoàn
              </h2>
              <span className="text-xs text-slate-400 font-medium">Thông tin hành chính liên hệ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tên Đội / Nhóm / CLB *</label>
                <input
                  type="text"
                  value={editForm.teamName}
                  onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Organization */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Đơn Vị Đại Diện</label>
                <input
                  type="text"
                  value={editForm.organization}
                  onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                  placeholder="Ví dụ: Trung tâm VH-TT Tỉnh..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                />
              </div>

              {/* Member Count */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Số Lượng Thành Viên *</label>
                <input
                  type="text"
                  value={editForm.memberCount}
                  onChange={(e) => setEditForm({ ...editForm, memberCount: e.target.value })}
                  placeholder="Ví dụ: 15 người"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Representative Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trưởng Đoàn / Người Đại Diện *</label>
                <input
                  type="text"
                  value={editForm.representativeName}
                  onChange={(e) => setEditForm({ ...editForm, representativeName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Số Điện Thoại Liên Hệ (Zalo) *</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Liên Hệ *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Photo Avatar Upload & Preview */}
            <div className="space-y-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-accent" /> Ảnh Đại Diện Đội Thi (Logo / Ảnh Đội) *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                {/* Preview Image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0 relative">
                  {editForm.photoUrl ? (
                    <img
                      src={editForm.photoUrl}
                      alt="Ảnh đại diện đội thi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                      <span className="text-[10px]">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải ảnh lên...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" /> Chọn & Tải Ảnh Mới (Tối đa 5MB)
                        </>
                      )}
                    </button>

                    {editForm.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, photoUrl: '' }))}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Gỡ ảnh
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Hoặc dán đường dẫn (URL) ảnh trực tiếp:
                    </span>
                    <input
                      type="url"
                      value={editForm.photoUrl}
                      onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: 3 Tiết mục dự thi chính thức (Thể Lệ Mới) */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-heading font-bold text-xl text-dark-obsidian flex items-center gap-2">
                  <Layers className="w-5 h-5 text-secondary" /> 2. Thông Tin 3 Tiết Mục Dự Thi (Thể Lệ Mới)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mỗi đội thi đăng ký 3 tiết mục hoàn chỉnh kèm theo link beat và link video dự thi.
                </p>
              </div>

              {/* Sub-tabs for 3 performances */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                {[0, 1, 2].map((idx) => {
                  const pNum = idx + 1;
                  const pTitle = performances[idx]?.title;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePerfTab(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activePerfTab === idx
                          ? 'bg-secondary text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Tiết mục {pNum}</span>
                      {pTitle && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Performance Inputs */}
            <div className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Đang chỉnh sửa: Tiết mục số {activePerfTab + 1} / 3
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {currentPerf.title ? currentPerf.title : '(Chưa đặt tên)'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Title */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tên Tiết Mục {activePerfTab + 1} *
                  </label>
                  <input
                    type="text"
                    value={currentPerf.title}
                    onChange={(e) => updateActivePerformance('title', e.target.value)}
                    placeholder={`Ví dụ: Tiết mục biểu diễn số ${activePerfTab + 1}...`}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none font-semibold"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Thể Loại Tiết Mục {activePerfTab + 1} *
                  </label>
                  <select
                    value={currentPerf.category}
                    onChange={(e) => updateActivePerformance('category', e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  >
                    <option value="dan_ca">Dân Ca</option>
                    <option value="dan_vu">Dân Vũ</option>
                    <option value="both">Dân Ca & Dân Vũ kết hợp</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Thời Lượng Dự Kiến *
                  </label>
                  <input
                    type="text"
                    value={currentPerf.duration}
                    onChange={(e) => updateActivePerformance('duration', e.target.value)}
                    placeholder="Ví dụ: 5:30"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                {/* Audio URL (Beat) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-accent" /> Link Nhạc Nền Beat Tiết Mục {activePerfTab + 1}
                  </label>
                  <input
                    type="url"
                    value={currentPerf.audioUrl || ''}
                    onChange={(e) => updateActivePerformance('audioUrl', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                {/* Video URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-accent" /> Link Video Dự Thi Tiết Mục {activePerfTab + 1}
                  </label>
                  <input
                    type="url"
                    value={currentPerf.videoUrl || ''}
                    onChange={(e) => updateActivePerformance('videoUrl', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tóm Tắt Ý Tưởng & Nội Dung Nghệ Thuật Tiết Mục {activePerfTab + 1} *
                  </label>
                  <textarea
                    rows={3}
                    value={currentPerf.description}
                    onChange={(e) => updateActivePerformance('description', e.target.value)}
                    placeholder="Giới thiệu câu chuyện, văn hóa truyền tải và ý nghĩa biểu diễn..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Technical Requirements */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Yêu Cầu Sân Khấu & Kỹ Thuật Tiết Mục {activePerfTab + 1} (Micro, Đạo cụ, Khói lạnh...)
                  </label>
                  <textarea
                    rows={2}
                    value={currentPerf.technicalRequirements || ''}
                    onChange={(e) => updateActivePerformance('technicalRequirements', e.target.value)}
                    placeholder="Ví dụ: 4 micro không dây, đạo cụ nón quai thao..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 rounded-xl bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Đang Lưu Hồ Sơ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu Toàn Bộ Thông Tin Hồ Sơ & 3 Tiết Mục
                </>
              )}
            </button>
          </div>
        </form>

        {/* Separate Dedicated Card for Changing Password */}
        <form onSubmit={handleChangePasswordSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-heading font-bold text-xl text-dark-obsidian flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Đổi Mật Khẩu Tài Khoản Đội Thi
            </h2>
            <span className="text-xs text-slate-400 font-medium">* Thay đổi có hiệu lực ngay (không cần chờ duyệt)</span>
          </div>

          {passMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold ${
                passMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {passMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Old Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Mật Khẩu Hiện Tại *
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  value={passForm.oldPassword}
                  onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                  placeholder="Nhập mật khẩu cũ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-primary" /> Mật Khẩu Mới *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-primary" /> Xác Nhận Mật Khẩu Mới *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={passForm.confirmNewPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmNewPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={passSaving}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {passSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Đang Cập Nhật Mật Khẩu...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Cập Nhật Mật Khẩu Mới
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
