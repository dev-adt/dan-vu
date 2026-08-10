'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Video, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

interface FormData {
  teamName: string;
  organization: string;
  memberCount: string;
  representativeName: string;
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
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
  password: '',
  confirmPassword: '',
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
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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
      if (!(formData.password || '').trim()) {
        tempErrors.password = 'Mật khẩu quản lý tài khoản không được bỏ trống.';
      } else if ((formData.password || '').length < 6) {
        tempErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
      }
      if (formData.confirmPassword !== formData.password) {
        tempErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
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
    t('reg.step1'),
    t('reg.step2'),
    t('reg.step3'),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 max-w-4xl mx-auto w-full">
        {/* Header Summary */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            {t('nav.register')}
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 mt-2">
            {t('reg.wizard_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            {t('reg.draft_saved')}
          </p>
        </div>

        {/* Dynamic Wizard Steps indicator */}
        <div className="grid grid-cols-3 gap-2 mb-10 max-w-xl mx-auto">
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
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '32px', boxSizing: 'border-box' }} className="glass-panel rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 relative overflow-hidden shadow-sm">
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
                  <h2 className="font-heading font-bold text-2xl text-slate-900">{t('reg.success_title')}</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {t('reg.success_desc')}
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href="/team/login"
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all"
                  >
                    {t('reg.go_team_portal')}
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-300 transition-all"
                  >
                    {t('reg.go_home')}
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
                      <span>{t('reg.step1')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.team_name')}</label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder={t('reg.team_name_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.teamName && <p className="text-xs text-primary">{errors.teamName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.organization')}</label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder={t('reg.organization_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.member_count')}</label>
                        <input
                          type="text"
                          name="memberCount"
                          value={formData.memberCount}
                          onChange={handleChange}
                          placeholder={t('reg.member_count_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.memberCount && <p className="text-xs text-primary">{errors.memberCount}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.rep_name')}</label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder={t('reg.rep_name_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.representativeName && <p className="text-xs text-primary">{errors.representativeName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.phone')}</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('reg.phone_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.phone && <p className="text-xs text-primary">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.email')}</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('reg.email_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.email && <p className="text-xs text-primary">{errors.email}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.pass')}</label>
                        <div className="relative">
                          <input
                            type={showRegPass ? 'text' : 'password'}
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder={t('reg.pass_placeholder')}
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
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.confirm_pass')}</label>
                        <div className="relative">
                          <input
                            type={showRegConfirmPass ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword || ''}
                            onChange={handleChange}
                            placeholder={t('reg.confirm_pass_placeholder')}
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
                      <span>{t('reg.step2')}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.performance_title')}</label>
                          <input
                            type="text"
                            name="performanceTitle"
                            value={formData.performanceTitle}
                            onChange={handleChange}
                            placeholder={t('reg.performance_title_placeholder')}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          {errors.performanceTitle && <p className="text-xs text-primary">{errors.performanceTitle}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.category')}</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          >
                            <option value="dan_ca">{t('reg.cat_dan_ca')}</option>
                            <option value="dan_vu">{t('reg.cat_dan_vu')}</option>
                            <option value="both">{t('reg.cat_both')}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.duration')}</label>
                          <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder={t('reg.duration_placeholder')}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                          />
                          {errors.duration && <p className="text-xs text-primary">{errors.duration}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.description')}</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder={t('reg.description_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                        />
                        {errors.description && <p className="text-xs text-primary">{errors.description}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t('reg.tech_req')}</label>
                        <textarea
                          name="technicalRequirements"
                          value={formData.technicalRequirements}
                          onChange={handleChange}
                          rows={3}
                          placeholder={t('reg.tech_req_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Preview and Terms */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-secondary font-heading font-bold text-lg border-b border-slate-100 pb-3">
                      <Sparkles className="w-5 h-5" />
                      <span>{t('reg.step3')}</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.team_name')}</span>
                          <strong className="text-slate-800">{formData.teamName}</strong>
                        </div>
                        {formData.organization && (
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.organization')}</span>
                            <strong className="text-slate-800">{formData.organization}</strong>
                          </div>
                        )}
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.member_count')}</span>
                          <strong className="text-slate-800">{formData.memberCount}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.rep_name')}</span>
                          <strong className="text-slate-800">{formData.representativeName}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.phone')}</span>
                          <span className="text-slate-800">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.email')}</span>
                          <span className="text-slate-800">{formData.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.performance_title')}</span>
                            <strong className="text-secondary">{formData.performanceTitle}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.duration')}</span>
                            <strong className="text-secondary">{formData.duration}</strong>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t('reg.description')}</span>
                          <p className="text-xs text-slate-600 italic">&ldquo;{formData.description}&rdquo;</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                      <input type="checkbox" required id="agreement" className="mt-1 accent-primary" />
                      <label htmlFor="agreement" className="text-xs text-slate-600 leading-relaxed">
                        {t('reg.step3_confirm_sub')}
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
                      <ArrowLeft className="w-4 h-4" /> {t('reg.prev_btn')}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all glow-gold-hover"
                    >
                      {t('reg.next_btn')} <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all glow-crimson-hover disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> {t('reg.submitting')}
                        </>
                      ) : (
                        t('reg.submit_btn')
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
