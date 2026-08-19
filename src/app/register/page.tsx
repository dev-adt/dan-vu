'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Video, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, X, Image as ImageIcon, Eye, EyeOff, Music, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export interface PerformanceItemData {
  title: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  duration: string;
  description: string;
  technicalRequirements: string;
  audioLink: string;
  videoLink: string;
}

export interface RegistrationFormData {
  teamName: string;
  organization: string;
  memberCount: string;
  representativeName: string;
  phone: string;
  email: string;
  loginPreference?: 'email' | 'phone';
  password?: string;
  confirmPassword?: string;
  performances: [PerformanceItemData, PerformanceItemData, PerformanceItemData];
  photoUrl: string;
}

const initialPerformance: PerformanceItemData = {
  title: '',
  category: 'dan_ca',
  duration: '',
  description: '',
  technicalRequirements: '',
  audioLink: '',
  videoLink: '',
};

const initialFormData: RegistrationFormData = {
  teamName: '',
  organization: '',
  memberCount: '',
  representativeName: '',
  phone: '',
  email: '',
  loginPreference: 'email',
  password: '',
  confirmPassword: '',
  performances: [
    { ...initialPerformance, category: 'dan_ca' },
    { ...initialPerformance, category: 'dan_vu' },
    { ...initialPerformance, category: 'both' },
  ],
  photoUrl: '',
};

export default function RegisterWizard() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [activePerfTab, setActivePerfTab] = useState(0); // 0: Tiết mục 1, 1: Tiết mục 2, 2: Tiết mục 3

  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockUrl = `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80`;
        setFormData((prev) => ({ ...prev, photoUrl: mockUrl }));
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `team-photos/${fileName}`;

      const { error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

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
    const draft = localStorage.getItem('nhip_buoc_viet_nam_draft_v2');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.performances && Array.isArray(parsed.performances) && parsed.performances.length === 3) {
          setFormData(parsed);
        }
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  // Auto-save draft on form change
  useEffect(() => {
    if (!isSubmitted && formData.teamName) {
      localStorage.setItem('nhip_buoc_viet_nam_draft_v2', JSON.stringify(formData));
    }
  }, [formData, isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePerformanceChange = (
    index: number,
    field: keyof PerformanceItemData,
    value: string
  ) => {
    setFormData((prev) => {
      const newPerfs = [...prev.performances] as [PerformanceItemData, PerformanceItemData, PerformanceItemData];
      newPerfs[index] = {
        ...newPerfs[index],
        [field]: value,
      };
      return {
        ...prev,
        performances: newPerfs,
      };
    });

    const errorKey = `perf_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const tempErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!(formData.teamName || '').trim()) tempErrors.teamName = 'Tên đội/nhóm không được bỏ trống.';
      if (!(formData.memberCount || '').trim()) tempErrors.memberCount = 'Số lượng thành viên không được bỏ trống.';
      if (!(formData.representativeName || '').trim()) tempErrors.representativeName = 'Họ và tên trưởng đoàn không được bỏ trống.';
      if (!(formData.phone || '').trim()) tempErrors.phone = 'Số điện thoại không được bỏ trống.';
      if ((formData.email || '').trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
        tempErrors.email = 'Địa chỉ email không hợp lệ.';
      }
      if (!(formData.password || '').trim()) {
        tempErrors.password = 'Mật khẩu quản lý tài khoản không được bỏ trống.';
      } else if ((formData.password || '').length < 6) {
        tempErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
      }
      if (formData.confirmPassword !== formData.password) {
        tempErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
      }
    } else if (currentStep === 2) {
      // Validate all 3 performances
      formData.performances.forEach((p, idx) => {
        const pNum = idx + 1;
        if (!p.title.trim()) {
          tempErrors[`perf_${idx}_title`] = `Tiết mục ${pNum}: Vui lòng nhập tên tiết mục.`;
        }
        if (!p.duration.trim()) {
          tempErrors[`perf_${idx}_duration`] = `Tiết mục ${pNum}: Vui lòng nhập thời lượng.`;
        }
        if (!p.description.trim()) {
          tempErrors[`perf_${idx}_description`] = `Tiết mục ${pNum}: Vui lòng nhập tóm tắt ý tưởng.`;
        }
        if (!p.audioLink.trim() && !p.videoLink.trim()) {
          tempErrors[`perf_${idx}_audioLink`] = `Tiết mục ${pNum}: Vui lòng dán link nhạc beat hoặc link video dự thi.`;
        }
      });
    } else if (currentStep === 3) {
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
    } else {
      // If error in step 2, automatically jump to the first tab that has an error
      if (step === 2) {
        for (let i = 0; i < 3; i++) {
          if (
            errors[`perf_${i}_title`] ||
            errors[`perf_${i}_duration`] ||
            errors[`perf_${i}_description`] ||
            errors[`perf_${i}_audioLink`]
          ) {
            setActivePerfTab(i);
            break;
          }
        }
      }
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Vui lòng kiểm tra lại đầy đủ thông tin ở các bước trước.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: formData.teamName,
          organization: formData.organization,
          memberCount: formData.memberCount,
          representativeName: formData.representativeName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          photoUrl: formData.photoUrl,
          performances: formData.performances,
        }),
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
      localStorage.removeItem('nhip_buoc_viet_nam_draft_v2');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
      setIsSaving(false);
    }
  };

  const stepTitles = [
    t('reg.step1', '1. Thông Tin Đội Thi'),
    language === 'en' ? '2. 3 Performances Info' : '2. 3 Tiết Mục Dự Thi',
    language === 'en' ? '3. Team Photo' : '3. Ảnh Đại Diện Đội Thi',
    t('reg.step4', '4. Xác Nhận & Gửi'),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 max-w-4xl mx-auto w-full">
        {/* Header Summary */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            {t('nav.register', 'ĐĂNG KÝ TRỰC TUYẾN')}
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 mt-2">
            {t('reg.wizard_title', 'Hồ Sơ Đăng Ký Dự Thi')}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            {language === 'en'
              ? 'Each team prepares 3 official performances. Drafts are auto-saved.'
              : 'Mỗi đội thi đăng ký 3 tiết mục chính thức. Bản nháp tự động lưu.'}
          </p>
        </div>

        {/* Dynamic Wizard Steps indicator */}
        <div className="grid grid-cols-4 gap-2 mb-10 max-w-2xl mx-auto">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < step;
            const isActive = stepNum === step;

            return (
              <div key={title} className="flex flex-col items-center space-y-2">
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-accent' : isActive ? 'bg-secondary' : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[10px] text-center font-bold tracking-wider uppercase transition-colors hidden sm:block ${
                    isActive ? 'text-secondary' : isCompleted ? 'text-accent' : 'text-slate-400'
                  }`}
                >
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Panel */}
        <div
          style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '32px', boxSizing: 'border-box' }}
          className="glass-panel rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 relative overflow-hidden shadow-sm"
        >
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
                  <h2 className="font-heading font-bold text-2xl text-slate-900">
                    {t('reg.success_title', 'Gửi Hồ Sơ Đăng Ký Thành Công!')}
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {t('reg.success_desc', 'Hồ sơ 3 tiết mục dự thi của bạn đã được tiếp nhận. Mã hồ sơ của bạn là:')}{' '}
                    <strong className="text-primary font-mono text-base">{submittedId}</strong>
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href="/team/login"
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all"
                  >
                    {t('reg.go_team_portal', 'Vào Cổng Đội Thi Ngay')}
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-300 transition-all"
                  >
                    {t('reg.go_home', 'Về Trang Chủ')}
                  </Link>
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
                      <span>{t('reg.step1', '1. Thông Tin Đội Thi')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.team_name', 'Tên Đội Thi / Câu Lạc Bộ *')}
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder={t('reg.team_name_placeholder', 'Nhập tên đội thi hoặc câu lạc bộ...')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.teamName && <p className="text-xs text-primary">{errors.teamName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.organization', 'Đơn Vị Trực Thuộc / Tỉnh Thành *')}
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder={t('reg.organization_placeholder', 'VD: Trung tâm Văn hóa Tỉnh Điện Biên')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.member_count', 'Số Lượng Thành Viên *')}
                        </label>
                        <input
                          type="text"
                          name="memberCount"
                          value={formData.memberCount}
                          onChange={handleChange}
                          placeholder={t('reg.member_count_placeholder', 'VD: 25')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.memberCount && <p className="text-xs text-primary">{errors.memberCount}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.rep_name', 'Họ và Tên Trưởng Đoàn *')}
                        </label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder={t('reg.rep_name_placeholder', 'Nhập họ tên trưởng đoàn...')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.representativeName && <p className="text-xs text-primary">{errors.representativeName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.phone', 'Số Điện Thoại Liên Hệ *')}
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('reg.phone_placeholder', '0988xxxxxx')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.phone && <p className="text-xs text-primary">{errors.phone}</p>}
                        {!formData.email.trim() && formData.phone.trim() && (
                          <p className="text-[11px] text-secondary font-medium">
                            * Số điện thoại này sẽ được dùng làm Tên đăng nhập vào Cổng Đội Thi.
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                          <span>{t('reg.email', 'Email Liên Hệ')}</span>
                          <span className="text-[10px] text-slate-400 font-normal normal-case">(Tùy chọn)</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('reg.email_placeholder', 'truongdoan@gmail.com (không bắt buộc)')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.email && <p className="text-xs text-primary">{errors.email}</p>}
                      </div>

                      {/* Login Identifier Preference if both are entered */}
                      {formData.phone.trim() && formData.email.trim() && (
                        <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Tài khoản đăng nhập ưu tiên vào Cổng Đội Thi:
                          </label>
                          <div className="flex flex-wrap gap-4 text-xs">
                            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-secondary transition-colors">
                              <input
                                type="radio"
                                name="loginPreference"
                                value="email"
                                checked={formData.loginPreference !== 'phone'}
                                onChange={() => setFormData((prev) => ({ ...prev, loginPreference: 'email' }))}
                                className="text-secondary focus:ring-secondary cursor-pointer"
                              />
                              Sử dụng Email (<span className="text-secondary">{formData.email}</span>)
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-secondary transition-colors">
                              <input
                                type="radio"
                                name="loginPreference"
                                value="phone"
                                checked={formData.loginPreference === 'phone'}
                                onChange={() => setFormData((prev) => ({ ...prev, loginPreference: 'phone' }))}
                                className="text-secondary focus:ring-secondary cursor-pointer"
                              />
                              Sử dụng Số điện thoại (<span className="text-secondary">{formData.phone}</span>)
                            </label>
                          </div>
                          <p className="text-[11px] text-slate-500 italic">
                            * Gợi ý: Bạn vẫn có thể dùng cả Email hoặc Số điện thoại cùng Mật khẩu để đăng nhập bất cứ lúc nào.
                          </p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.pass', 'Mật Khẩu Đăng Nhập Cổng Đội Thi *')}
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPass ? 'text' : 'password'}
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder={t('reg.pass_placeholder', 'Tối thiểu 6 ký tự')}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-4 pr-10 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPass(!showRegPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                          >
                            {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-primary">{errors.password}</p>}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {t('reg.confirm_pass', 'Xác Nhận Mật Khẩu *')}
                        </label>
                        <div className="relative">
                          <input
                            type={showRegConfirmPass ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword || ''}
                            onChange={handleChange}
                            placeholder={t('reg.confirm_pass_placeholder', 'Nhập lại mật khẩu...')}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-4 pr-10 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                          >
                            {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-primary">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: 3 Performances Details */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg">
                        <Layers className="w-5 h-5" />
                        <span>{language === 'en' ? 'Step 2: 3 Official Performances' : 'Bước 2: 3 Tiết Mục Dự Thi'}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                        {language === 'en' ? 'Rule: 3 performances per team' : 'Quy định: Mỗi đội thi gửi 3 tiết mục'}
                      </span>
                    </div>

                    {/* Performance Sub-tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      {[0, 1, 2].map((idx) => {
                        const pNum = idx + 1;
                        const hasErr =
                          errors[`perf_${idx}_title`] ||
                          errors[`perf_${idx}_duration`] ||
                          errors[`perf_${idx}_description`] ||
                          errors[`perf_${idx}_audioLink`];
                        const isDone =
                          formData.performances[idx].title &&
                          formData.performances[idx].duration &&
                          formData.performances[idx].description;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePerfTab(idx)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              activePerfTab === idx
                                ? 'bg-secondary text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            } ${hasErr ? 'border border-red-400' : ''}`}
                          >
                            <span>Tiết mục {pNum}</span>
                            {isDone ? (
                              <span className="w-2 h-2 rounded-full bg-green-400" />
                            ) : hasErr ? (
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Performance Form */}
                    {(() => {
                      const idx = activePerfTab;
                      const perf = formData.performances[idx];
                      const pNum = idx + 1;

                      return (
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                              Thông tin chi tiết: Tiết mục số {pNum}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              (Phần thi {pNum} / 3)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Tên Tiết Mục Số {pNum} *
                              </label>
                              <input
                                type="text"
                                value={perf.title}
                                onChange={(e) => handlePerformanceChange(idx, 'title', e.target.value)}
                                placeholder={`VD: ${idx === 0 ? 'Múa Xòe Hoa Tây Bắc' : idx === 1 ? 'Hát Xoan Đất Tổ' : 'Vũ điệu Khèn Mông'}`}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                              />
                              {errors[`perf_${idx}_title`] && (
                                <p className="text-xs text-primary">{errors[`perf_${idx}_title`]}</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {t('reg.category', 'Thể Loại Dự Thi *')}
                              </label>
                              <select
                                value={perf.category}
                                onChange={(e) => handlePerformanceChange(idx, 'category', e.target.value as any)}
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                              >
                                <option value="dan_ca">{t('reg.cat_dan_ca', 'Dân Ca')}</option>
                                <option value="dan_vu">{t('reg.cat_dan_vu', 'Dân Vũ')}</option>
                                <option value="both">{t('reg.cat_both', 'Cả Dân Ca & Dân Vũ')}</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Thời Lượng (phút) *
                              </label>
                              <input
                                type="text"
                                value={perf.duration}
                                onChange={(e) => handlePerformanceChange(idx, 'duration', e.target.value)}
                                placeholder="VD: 5-7 phút"
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                              />
                              {errors[`perf_${idx}_duration`] && (
                                <p className="text-xs text-primary">{errors[`perf_${idx}_duration`]}</p>
                              )}
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Đường Dẫn Nhạc Nền (Beat / Audio) *
                              </label>
                              <input
                                type="url"
                                value={perf.audioLink}
                                onChange={(e) => handlePerformanceChange(idx, 'audioLink', e.target.value)}
                                placeholder="https://drive.google.com/... hoặc link MP3 / Youtube"
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                              />
                              {errors[`perf_${idx}_audioLink`] && (
                                <p className="text-xs text-primary">{errors[`perf_${idx}_audioLink`]}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Video Dự Thi Tiết Mục Số {pNum} (Youtube / Google Drive) *
                            </label>
                            <input
                              type="url"
                              value={perf.videoLink}
                              onChange={(e) => handlePerformanceChange(idx, 'videoLink', e.target.value)}
                              placeholder="https://youtube.com/watch?v=... hoặc Google Drive link"
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                            />
                            <p className="text-[10px] text-slate-400">
                              Dán đường dẫn video trình diễn tiết mục số {pNum} để khán giả bình chọn và giám khảo chấm điểm.
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Mô Tả Tiết Mục / Ý Tưởng Nghệ Thuật *
                            </label>
                            <textarea
                              value={perf.description}
                              onChange={(e) => handlePerformanceChange(idx, 'description', e.target.value)}
                              rows={3}
                              placeholder="Tóm tắt ý tưởng, nội dung bài thi và trang phục trình diễn..."
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                            />
                            {errors[`perf_${idx}_description`] && (
                              <p className="text-xs text-primary">{errors[`perf_${idx}_description`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Yêu Cầu Sân Khấu & Kỹ Thuật (Đạo cụ, ánh sáng...)
                            </label>
                            <textarea
                              value={perf.technicalRequirements}
                              onChange={(e) => handlePerformanceChange(idx, 'technicalRequirements', e.target.value)}
                              rows={2}
                              placeholder="VD: Cần 2 micro cầm tay, khói lạnh, đạo cụ quạt lụa..."
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                            />
                          </div>

                          {/* Navigation between performance tabs */}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                            {idx > 0 ? (
                              <button
                                type="button"
                                onClick={() => setActivePerfTab(idx - 1)}
                                className="text-xs text-secondary hover:underline font-semibold"
                              >
                                ← Sang Tiết mục {idx}
                              </button>
                            ) : <div />}
                            {idx < 2 ? (
                              <button
                                type="button"
                                onClick={() => setActivePerfTab(idx + 1)}
                                className="text-xs text-secondary hover:underline font-semibold"
                              >
                                Điền tiếp Tiết mục {idx + 2} →
                              </button>
                            ) : <div />}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* STEP 3: Media Uploads (Team Photo) */}
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
                      <span>{language === 'en' ? 'Step 3: Team Representative Photo' : 'Bước 3: Tải Ảnh Đại Diện Đội Thi'}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Ảnh Đại Diện Đội Thi (Banner / Poster / Ảnh tập thể) *
                        </label>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Upload box */}
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                            isDragActive
                              ? 'border-secondary bg-secondary/10'
                              : formData.photoUrl
                              ? 'border-accent bg-accent/5'
                              : 'border-slate-300 hover:border-secondary bg-slate-50'
                          }`}
                        >
                          {isUploadingPhoto ? (
                            <div className="flex flex-col items-center gap-2 py-4">
                              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                              <span className="text-xs text-slate-500 font-medium">Đang tải ảnh lên...</span>
                            </div>
                          ) : formData.photoUrl ? (
                            <div className="relative group w-full flex flex-col items-center">
                              <div className="relative w-64 h-40 rounded-xl overflow-hidden border border-slate-200 shadow-md">
                                <img
                                  src={formData.photoUrl}
                                  alt="Ảnh đội thi"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto();
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md transition-opacity"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-xs text-accent font-semibold mt-3">
                                ✓ Đã tải lên ảnh đại diện thành công. Nhấp để chọn ảnh khác.
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-1">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-semibold text-slate-700">
                                Kéo thả ảnh đội thi vào đây, hoặc <span className="text-secondary underline">nhấp để chọn tệp</span>
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa: 5MB.
                              </p>
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
                      <span>{t('reg.step4', '4. Xác Nhận & Gửi')}</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6 text-sm">
                      {/* Team Info Summary */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                          1. Thông tin Đội thi
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.team_name', 'Tên Đội Thi:')}</span>
                            <strong className="text-slate-800">{formData.teamName}</strong>
                          </div>
                          {formData.organization && (
                            <div>
                              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.organization', 'Đơn vị đại diện:')}</span>
                              <strong className="text-slate-800">{formData.organization}</strong>
                            </div>
                          )}
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.member_count', 'Số lượng thành viên:')}</span>
                            <strong className="text-slate-800">{formData.memberCount}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.rep_name', 'Trưởng Đoàn:')}</span>
                            <strong className="text-slate-800">{formData.representativeName}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.phone', 'Số Điện Thoại Liên Hệ:')}</span>
                            <strong className="text-slate-800">{formData.phone}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.email', 'Email Liên Hệ:')}</span>
                            <span className="text-slate-800">{formData.email || '(Không cung cấp)'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Tên Đăng Nhập Cổng Đội Thi:</span>
                            <span className="text-secondary font-bold font-mono">
                              {formData.email
                                ? formData.loginPreference === 'phone'
                                  ? formData.phone
                                  : formData.email
                                : formData.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3 Performances Summary */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                          2. Danh sách 3 Tiết mục đăng ký
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {formData.performances.map((perf, pIdx) => (
                            <div
                              key={pIdx}
                              className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <strong className="text-secondary font-heading text-sm">
                                  Tiết mục {pIdx + 1}: {perf.title || '(Chưa đặt tên)'}
                                </strong>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold">
                                  {perf.category === 'dan_ca' ? 'Dân Ca' : perf.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'} ({perf.duration})
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 italic">
                                &ldquo;{perf.description}&rdquo;
                              </p>
                              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                                {perf.audioLink && (
                                  <div className="flex items-center gap-1 text-accent">
                                    <Music className="w-3.5 h-3.5" />
                                    <span>Beat: <a href={perf.audioLink} target="_blank" rel="noreferrer" className="underline">{perf.audioLink}</a></span>
                                  </div>
                                )}
                                {perf.videoLink && (
                                  <div className="flex items-center gap-1 text-secondary">
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Video: <a href={perf.videoLink} target="_blank" rel="noreferrer" className="underline">{perf.videoLink}</a></span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Photo Preview */}
                      {formData.photoUrl && (
                        <div className="pt-2 border-t border-slate-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            3. Ảnh Đại Diện
                          </h4>
                          <div className="w-24 h-16 rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                            <img src={formData.photoUrl} alt="Ảnh đại diện" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                      <input type="checkbox" required id="agreement" className="mt-1 accent-primary cursor-pointer" />
                      <label htmlFor="agreement" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                        {t(
                          'reg.step3_confirm_sub',
                          'Tôi cam kết tất cả thông tin khai báo trên là chính xác. Bản quyền âm nhạc của cả 3 tiết mục hoàn toàn thuộc trách nhiệm tự thỏa thuận của đội thi. Ban tổ chức được toàn quyền sử dụng hình ảnh tiết mục để làm tư liệu truyền thông.'
                        )}
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
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t('reg.prev_btn', 'Quay lại')}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all glow-gold-hover cursor-pointer"
                    >
                      {t('reg.next_btn', 'Tiếp tục')} <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all glow-crimson-hover disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> {t('reg.submitting', 'Đang gửi hồ sơ...')}
                        </>
                      ) : (
                        t('reg.submit_btn', 'Xác Nhận & Gửi Đăng Ký 3 Tiết Mục')
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
