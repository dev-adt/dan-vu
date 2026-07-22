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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TeamDashboardPage() {
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

      const { data, error } = await supabase.storage
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

  // Form edit state
  const [editForm, setEditForm] = useState({
    teamName: '',
    organization: '',
    memberCount: '',
    representativeName: '',
    phone: '',
    email: '',
    category: 'dan_ca',
    performanceTitle: '',
    duration: '',
    description: '',
    technicalRequirements: '',
    audioUrl: '',
    videoUrl: '',
    photoUrl: '',
    newPassword: '',
  });

  const loadProfile = async (teamId: string) => {
    try {
      const res = await fetch(`/api/team/profile?id=${teamId}`);
      const data = await res.json();
      if (res.ok && data.team) {
        setTeam(data.team);
        // Populate edit form with current data
        setEditForm({
          teamName: data.team.team_name || '',
          organization: data.team.organization || '',
          memberCount: data.team.member_count || '',
          representativeName: data.team.representative_name || '',
          phone: data.team.phone || '',
          email: data.team.email || '',
          category: data.team.category || 'dan_ca',
          performanceTitle: data.team.performance_title || '',
          duration: data.team.duration || '',
          description: data.team.description || '',
          technicalRequirements: data.team.technical_requirements || '',
          audioUrl: data.team.audio_url || '',
          videoUrl: data.team.video_url || '',
          photoUrl: data.team.photo_url || '',
          newPassword: '',
        });
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
        category: editForm.category,
        performance_title: editForm.performanceTitle,
        duration: editForm.duration,
        description: editForm.description,
        technical_requirements: editForm.technicalRequirements,
        audio_url: editForm.audioUrl,
        video_url: editForm.videoUrl,
        photo_url: editForm.photoUrl,
      };

      if (editForm.newPassword && editForm.newPassword.trim().length >= 6) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch('/api/team/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ text: data.error || 'Cập nhật không thành công.', type: 'error' });
        return;
      }

      if (data.isPending) {
        setMessage({
          text: 'Thông tin chỉnh sửa đã được gửi đi và đang ở trạng thái Chờ duyệt bởi Ban Tổ Chức.',
          type: 'warning',
        });
      } else {
        setMessage({ text: 'Cập nhật thông tin hồ sơ thành công!', type: 'success' });
      }

      // Reload team state
      if (data.team) {
        setTeam(data.team);
      } else {
        await loadProfile(team.id);
      }
    } catch (err: any) {
      setMessage({ text: 'Lỗi máy chủ khi cập nhật dữ liệu.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-cream/30 flex items-center justify-center">
        <div className="flex items-center gap-3 text-accent font-bold">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Đang nạp thông tin hồ sơ Đội thi...</span>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Đã Duyệt Hồ Sơ
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Cần Chỉnh Sửa / Từ Chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Hồ Sơ Chờ Duyệt
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-cream/30 text-dark-obsidian selection:bg-accent selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 max-w-6xl mx-auto w-full space-y-8 relative z-10">
        {/* Header Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mã hồ sơ: <strong className="text-primary">{team?.id?.substring(0, 8).toUpperCase()}</strong>
              </span>
              {getStatusBadge(team?.status)}
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-dark-obsidian">
              {team?.team_name}
            </h1>
            <p className="text-xs text-slate-600">
              Trưởng đoàn: <strong>{team?.representative_name}</strong> | SĐT: <strong>{team?.phone}</strong> | Email: <strong>{team?.email}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4 text-slate-500" /> Đăng Xuất
          </button>
        </div>

        {/* Warning Banner if changes are pending review */}
        {team?.has_pending_update && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-2 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="text-sm font-bold block text-amber-950">Yêu cầu thay đổi thông tin đang ở trạng thái CHỜ DUYỆT BỞI BAN TỔ CHỨC:</strong>
              Các thông tin bạn vừa chỉnh sửa đã được ghi nhận. Trong thời gian chờ Ban Tổ Chức phê duyệt, các thông tin cũ được duyệt trước đó vẫn được hiển thị công khai tới khán giả và Ban giám khảo.
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : message.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-heading font-bold text-xl text-dark-obsidian flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" /> Quản Lý Thông Tin Hồ Sơ Đội Thi
            </h2>
            <span className="text-xs text-slate-400 font-medium">* Bạn có thể cập nhật thông tin bất cứ lúc nào</span>
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

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thể Loại Đăng Ký *</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
              >
                <option value="dan_ca">Dân Ca</option>
                <option value="dan_vu">Dân Vũ</option>
                <option value="both">Dân Ca & Dân Vũ</option>
              </select>
            </div>

            {/* Performance Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tên Bài Dự Thi (Tiết Mục) *</label>
              <input
                type="text"
                value={editForm.performanceTitle}
                onChange={(e) => setEditForm({ ...editForm, performanceTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thời Lượng Dự Kiến *</label>
              <input
                type="text"
                value={editForm.duration}
                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                required
              />
            </div>

            {/* Audio URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-accent" /> Link Nhạc Nền Beat (Google Drive / Mp3)
              </label>
              <input
                type="url"
                value={editForm.audioUrl}
                onChange={(e) => setEditForm({ ...editForm, audioUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                placeholder="https://drive.google.com/..."
              />
            </div>

            {/* Video URL */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-accent" /> Link Video Chạy Thử (Youtube / Google Drive)
              </label>
              <input
                type="url"
                value={editForm.videoUrl}
                onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Photo Avatar Upload & Preview */}
            <div className="space-y-2 md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
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
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
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
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Gỡ ảnh
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Hoặc dán đường dẫn (URL) ảnh trực tiếp:</span>
                    <input
                      type="url"
                      value={editForm.photoUrl}
                      onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                      placeholder="https://domain.com/photo.jpg"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tóm Tắt Ý Tưởng & Nội Dung Tiết Mục *</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
                required
              />
            </div>

            {/* Technical Requirements */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yêu Cầu Kỹ Thuật (Micro, Sân khấu, Khói lạnh...)</label>
              <textarea
                rows={2}
                value={editForm.technicalRequirements}
                onChange={(e) => setEditForm({ ...editForm, technicalRequirements: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Change Password Option */}
            <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Đổi Mật Khẩu Mới (Để trống nếu không muốn đổi)</label>
              <input
                type="password"
                value={editForm.newPassword}
                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none max-w-md"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 rounded-xl bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Đang Lưu Thay Đổi...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu Hồ Sơ Thay Đổi
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
