'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Video, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FormData {
  teamName: string;
  organization: string;
  memberCount: string;
  representativeName: string;
  phone: string;
  email: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performanceTitle: string;
  duration: string;
  description: string;
  technicalRequirements: string;
  audioLink: string;
  videoLink: string;
  photoUrl: string;
}

const initialFormData: FormData = {
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
  audioLink: '',
  videoLink: '',
  photoUrl: '',
};

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá giới hạn 5MB.');
      return;
    }

    // Check type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (.jpg, .jpeg, .png).');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockUrl = `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80`;
        setFormData((prev) => ({ ...prev, photoUrl: mockUrl }));
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `team-photos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, photoUrl: publicUrl }));
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert('Không thể tải lên ảnh: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('nhip_buoc_viet_nam_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse draft storage', e);
      }
    }
  }, []);

  // Save draft to localStorage on change
  useEffect(() => {
    if (formData !== initialFormData) {
      const timer = setTimeout(() => {
        localStorage.setItem('nhip_buoc_viet_nam_draft', JSON.stringify(formData));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const tempErrors: Partial<Record<keyof FormData, string>> = {};

    if (currentStep === 1) {
      if (!(formData.teamName || '').trim()) tempErrors.teamName = 'Tên đội/nhóm không được bỏ trống.';
      if (!(formData.memberCount || '').trim()) tempErrors.memberCount = 'Số lượng thành viên không được bỏ trống.';
      if (!(formData.representativeName || '').trim()) tempErrors.representativeName = 'Họ và tên trưởng đoàn không được bỏ trống.';
      if (!(formData.phone || '').trim()) tempErrors.phone = 'Số điện thoại không được bỏ trống.';
      if (!(formData.email || '').trim()) {
        tempErrors.email = 'Email không được bỏ trống.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Địa chỉ email không hợp lệ.';
      }
    } else if (currentStep === 2) {
      if (!(formData.performanceTitle || '').trim()) tempErrors.performanceTitle = 'Tên tiết mục không được bỏ trống.';
      if (!(formData.duration || '').trim()) tempErrors.duration = 'Thời lượng dự kiến không được bỏ trống.';
      if (!(formData.description || '').trim()) tempErrors.description = 'Tóm tắt ý tưởng không được bỏ trống.';
    } else if (currentStep === 3) {
      if (!(formData.audioLink || '').trim() && !(formData.videoLink || '').trim()) {
        tempErrors.audioLink = 'Bạn phải điền ít nhất link nhạc nền (Beat) hoặc link video chạy thử.';
      }
      if (!(formData.photoUrl || '').trim()) {
        tempErrors.photoUrl = 'Vui lòng tải lên ảnh đại diện của đội thi.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Đã có lỗi xảy ra khi nộp hồ sơ.');
        setIsSaving(false);
        return;
      }

      setSubmittedId(result.id);
      setIsSaving(false);
      setIsSubmitted(true);
      localStorage.removeItem('nhip_buoc_viet_nam_draft');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
      setIsSaving(false);
    }
  };

  const stepTitles = [
    'Thông tin Đội thi',
    'Tiết mục & Kỹ thuật',
    'Tư liệu & Đính kèm',
    'Xác nhận Hồ sơ',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 max-w-4xl mx-auto w-full">
        {/* Header Summary */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Đăng Ký Trực Tuyến
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 mt-2">
            Hồ Sơ Đăng Ký Dự Thi
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Hoàn tất biểu mẫu trong vòng 5 phút. Bản nháp tự động lưu.
          </p>
        </div>

        {/* Dynamic Wizard Steps indicator */}
        <div className="grid grid-cols-4 gap-2 mb-10 max-w-xl mx-auto">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < step;
            const isActive = stepNum === step;

            return (
              <div key={title} className="flex flex-col items-center space-y-2">
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-accent' : isActive ? 'bg-secondary' : 'bg-slate-200'
                }`} />
                <span className={`text-[10px] text-center font-bold tracking-wider uppercase transition-colors hidden sm:block ${
                  isActive ? 'text-secondary' : isCompleted ? 'text-accent' : 'text-slate-400'
                }`}>
                  Bước {stepNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Panel */}
        <div className="glass-panel rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 relative overflow-hidden shadow-sm">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-heading font-bold text-2xl text-slate-900">Gửi Hồ Sơ Thành Công!</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Mã số hồ sơ của bạn là <strong className="text-secondary">{submittedId}</strong>. Ban tổ chức đã gửi một email xác nhận tự động. Vui lòng kiểm tra hộp thư (bao gồm cả spam) trong vòng 15 phút tới.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setStep(1);
                      setFormData(initialFormData);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all"
                  >
                    Đăng Ký Đội Mới
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Representative Details */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg border-b border-slate-100 pb-3">
                      <User className="w-5 h-5" />
                      <span>Bước 1: Thông tin liên hệ Trưởng đoàn</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tên Đội/Nhóm/CLB *</label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder="Ví dụ: CLB Sen Vàng"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.teamName && <p className="text-xs text-primary">{errors.teamName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đơn vị đại diện (Trường học, Phường/Xã... nếu có)</label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Ví dụ: Phường Tràng Tiền"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Số lượng thành viên *</label>
                        <input
                          type="text"
                          name="memberCount"
                          value={formData.memberCount}
                          onChange={handleChange}
                          placeholder="Ví dụ: 15 người (Từ 5 - 30 người)"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.memberCount && <p className="text-xs text-primary">{errors.memberCount}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Trưởng đoàn / Người Đại diện *</label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder="Họ và tên"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.representativeName && <p className="text-xs text-primary">{errors.representativeName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Số điện thoại liên hệ (Zalo) *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.phone && <p className="text-xs text-primary">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email liên hệ *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.email && <p className="text-xs text-primary">{errors.email}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Performance Concept */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg border-b border-slate-100 pb-3">
                      <Video className="w-5 h-5" />
                      <span>Bước 2: Chi tiết tiết mục dự thi</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tên bài dự thi (Tiết mục) *</label>
                          <input
                            type="text"
                            name="performanceTitle"
                            value={formData.performanceTitle}
                            onChange={handleChange}
                            placeholder="Ví dụ: Hào Khí Việt Nam"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          {errors.performanceTitle && <p className="text-xs text-primary">{errors.performanceTitle}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Thể loại đăng ký *</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          >
                            <option value="dan_ca">Dân Ca</option>
                            <option value="dan_vu">Dân Vũ</option>
                            <option value="both">Cả hai (Dân Ca & Dân Vũ)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Thời lượng dự kiến *</label>
                          <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Ví dụ: 5 phút 30 giây (Tối đa 7 phút)"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          {errors.duration && <p className="text-xs text-primary">{errors.duration}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ý tưởng & Nội dung (MC giới thiệu & BGK thẩm định) *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Mô tả ngắn gọn về thông điệp, văn hóa vùng miền tôn vinh trong tiết mục..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                        />
                        {errors.description && <p className="text-xs text-primary">{errors.description}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Yêu cầu kỹ thuật sân khấu (Số lượng Micro, đạo cụ...)</label>
                        <textarea
                          name="technicalRequirements"
                          value={formData.technicalRequirements}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ví dụ: Cần 3 micro không dây cầm tay, 1 bục đứng trung tâm..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Attachments & Media Link */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg border-b border-slate-100 pb-3">
                      <Upload className="w-5 h-5" />
                      <span>Bước 3: Tải lên tư liệu âm nhạc / video</span>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đường dẫn file Nhạc nền (Google Drive / Dropbox) *</label>
                        <input
                          type="url"
                          name="audioLink"
                          value={formData.audioLink}
                          onChange={handleChange}
                          placeholder="Dán link Drive đã mở quyền truy cập"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.audioLink && <p className="text-xs text-primary">{errors.audioLink}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đường dẫn Video chạy thử / Tập luyện (YouTube / Google Drive)</label>
                        <input
                          type="url"
                          name="videoLink"
                          value={formData.videoLink}
                          onChange={handleChange}
                          placeholder="Dán link video tập luyện của đội"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ảnh Đại Diện Đội Thi *</label>
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                            isDragActive ? 'border-secondary bg-secondary/5' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                          />

                          {isUploadingPhoto ? (
                            <div className="space-y-2 py-4">
                              <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" />
                              <p className="text-xs text-slate-500">Đang tải ảnh lên máy chủ...</p>
                            </div>
                          ) : formData.photoUrl ? (
                            <div className="relative group w-48 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm" onClick={(e) => e.stopPropagation()}>
                              <img
                                src={formData.photoUrl}
                                alt="Xem trước ảnh đại diện"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm animate-fadeIn"
                                title="Xóa ảnh"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                              <p className="text-xs font-medium text-slate-600">
                                Kéo thả ảnh vào đây, hoặc <span className="text-secondary hover:underline">nhấp để chọn</span>
                              </p>
                              <p className="text-[10px] text-slate-400">Định dạng JPG, PNG. Dung lượng tối đa: 5MB.</p>
                            </>
                          )}
                        </div>
                        {errors.photoUrl && <p className="text-xs text-primary mt-1">{errors.photoUrl}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Preview and Terms */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg border-b border-slate-100 pb-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Bước 4: Xác nhận hồ sơ đăng ký</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Tên Đội Thi:</span>
                          <strong className="text-slate-800">{formData.teamName}</strong>
                        </div>
                        {formData.organization && (
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Đơn vị đại diện:</span>
                            <strong className="text-slate-800">{formData.organization}</strong>
                          </div>
                        )}
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Số lượng thành viên:</span>
                          <strong className="text-slate-800">{formData.memberCount}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Trưởng Đoàn:</span>
                          <strong className="text-slate-800">{formData.representativeName}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Số Điện Thoại:</span>
                          <span className="text-slate-800">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Email liên hệ:</span>
                          <span className="text-slate-800">{formData.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Tên tiết mục:</span>
                            <strong className="text-secondary">{formData.performanceTitle}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Thời lượng dự kiến:</span>
                            <strong className="text-secondary">{formData.duration}</strong>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Ý tưởng tiết mục:</span>
                          <p className="text-xs text-slate-600 italic">&ldquo;{formData.description}&rdquo;</p>
                        </div>
                        {formData.audioLink && (
                          <div className="text-xs text-accent">
                            ✓ Nhạc nền đính kèm hợp lệ.
                          </div>
                        )}
                        {formData.photoUrl && (
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-100/50 mt-2 animate-fadeIn">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Ảnh đại diện:</span>
                            <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                              <img src={formData.photoUrl} alt="Ảnh đại diện" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                      <input type="checkbox" required id="agreement" className="mt-1 accent-primary" />
                      <label htmlFor="agreement" className="text-xs text-slate-600 leading-relaxed">
                        Tôi cam kết tất cả thông tin khai báo trên là chính xác. Bản quyền âm nhạc của tiết mục hoàn toàn thuộc trách nhiệm tự thỏa thuận của đội thi. Ban tổ chức được toàn quyền sử dụng hình ảnh tiết mục để làm tư liệu truyền thông.
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Quay lại
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all glow-gold-hover"
                    >
                      Tiếp tục <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all glow-crimson-hover disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi hồ sơ...
                        </>
                      ) : (
                        'Xác Nhận & Gửi Đăng Ký'
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
