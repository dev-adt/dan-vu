'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Video, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FormData {
  teamName: string;
  representativeName: string;
  phone: string;
  email: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performanceTitle: string;
  description: string;
  technicalRequirements: string;
  audioLink: string;
  videoLink: string;
}

const initialFormData: FormData = {
  teamName: '',
  representativeName: '',
  phone: '',
  email: '',
  category: 'dan_ca',
  performanceTitle: '',
  description: '',
  technicalRequirements: '',
  audioLink: '',
  videoLink: '',
};

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('nhip_buoc_viet_nam_draft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
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
      if (!formData.teamName.trim()) tempErrors.teamName = 'Tên đội/nhóm không được bỏ trống.';
      if (!formData.representativeName.trim()) tempErrors.representativeName = 'Họ và tên trưởng đoàn không được bỏ trống.';
      if (!formData.phone.trim()) tempErrors.phone = 'Số điện thoại không được bỏ trống.';
      if (!formData.email.trim()) {
        tempErrors.email = 'Email không được bỏ trống.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Địa chỉ email không hợp lệ.';
      }
    } else if (currentStep === 2) {
      if (!formData.performanceTitle.trim()) tempErrors.performanceTitle = 'Tên tiết mục không được bỏ trống.';
      if (!formData.description.trim()) tempErrors.description = 'Tóm tắt ý tưởng không được bỏ trống.';
    } else if (currentStep === 3) {
      if (!formData.audioLink.trim() && !formData.videoLink.trim()) {
        tempErrors.audioLink = 'Bạn phải điền ít nhất link nhạc nền (Beat) hoặc link video chạy thử.';
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
    // Simulate API registration delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaving(false);
    setIsSubmitted(true);
    localStorage.removeItem('nhip_buoc_viet_nam_draft');
  };

  const stepTitles = [
    'Thông tin Đội thi',
    'Tiết mục & Kỹ thuật',
    'Tư liệu & Đính kèm',
    'Xác nhận Hồ sơ',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 max-w-4xl mx-auto w-full">
        {/* Header Summary */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Đăng Ký Trực Tuyến
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-light-cream mt-2">
            Hồ Sơ Đăng Ký Dự Thi
          </h1>
          <p className="text-xs text-light-alabaster/50 mt-2">
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
                  isCompleted ? 'bg-accent' : isActive ? 'bg-secondary' : 'bg-white/10'
                }`} />
                <span className={`text-[10px] text-center font-semibold tracking-wider uppercase transition-colors hidden sm:block ${
                  isActive ? 'text-secondary' : isCompleted ? 'text-accent' : 'text-light-alabaster/40'
                }`}>
                  Bước {stepNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto text-accent shadow-[0_0_20px_rgba(0,105,92,0.3)]">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-heading font-bold text-2xl text-light-cream">Gửi Hồ Sơ Thành Công!</h2>
                  <p className="text-sm text-light-alabaster/60 max-w-md mx-auto">
                    Mã số hồ sơ của bạn là <strong className="text-secondary">DC-{Math.floor(1000 + Math.random() * 9000)}</strong>. Ban tổ chức đã gửi một email xác nhận tự động. Vui lòng kiểm tra hộp thư (bao gồm cả spam) trong vòng 15 phút tới.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setStep(1);
                      setFormData(initialFormData);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all"
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
                    <div className="flex items-center gap-2 text-secondary font-heading font-semibold text-lg border-b border-white/5 pb-3">
                      <User className="w-5 h-5" />
                      <span>Bước 1: Thông tin liên hệ Trưởng đoàn</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Tên Đội/Nhóm/CLB *</label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder="Ví dụ: CLB Sen Vàng"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.teamName && <p className="text-xs text-primary">{errors.teamName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Trưởng đoàn / Người Đại diện *</label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder="Họ và tên"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.representativeName && <p className="text-xs text-primary">{errors.representativeName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Số điện thoại liên hệ (Zalo) *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.phone && <p className="text-xs text-primary">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Email liên hệ *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@gmail.com"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
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
                    <div className="flex items-center gap-2 text-secondary font-heading font-semibold text-lg border-b border-white/5 pb-3">
                      <Video className="w-5 h-5" />
                      <span>Bước 2: Chi tiết tiết mục dự thi</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Tên bài dự thi (Tiết mục) *</label>
                          <input
                            type="text"
                            name="performanceTitle"
                            value={formData.performanceTitle}
                            onChange={handleChange}
                            placeholder="Ví dụ: Hào Khí Việt Nam"
                            className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                          />
                          {errors.performanceTitle && <p className="text-xs text-primary">{errors.performanceTitle}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Thể loại đăng ký *</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                          >
                            <option value="dan_ca">Dân Ca</option>
                            <option value="dan_vu">Dân Vũ</option>
                            <option value="both">Cả hai (Dân Ca & Dân Vũ)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Ý tưởng & Nội dung (MC giới thiệu & BGK thẩm định) *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Mô tả ngắn gọn về thông điệp, văn hóa vùng miền tôn vinh trong tiết mục..."
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors resize-none"
                        />
                        {errors.description && <p className="text-xs text-primary">{errors.description}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Yêu cầu kỹ thuật sân khấu (Số lượng Micro, đạo cụ...)</label>
                        <textarea
                          name="technicalRequirements"
                          value={formData.technicalRequirements}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ví dụ: Cần 3 micro không dây cầm tay, 1 bục đứng trung tâm..."
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors resize-none"
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
                    <div className="flex items-center gap-2 text-secondary font-heading font-semibold text-lg border-b border-white/5 pb-3">
                      <Upload className="w-5 h-5" />
                      <span>Bước 3: Tải lên tư liệu âm nhạc / video</span>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Đường dẫn file Nhạc nền (Google Drive / Dropbox) *</label>
                        <input
                          type="url"
                          name="audioLink"
                          value={formData.audioLink}
                          onChange={handleChange}
                          placeholder="Dán link Drive đã mở quyền truy cập"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                        />
                        {errors.audioLink && <p className="text-xs text-primary">{errors.audioLink}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-light-alabaster/70 uppercase tracking-wider">Đường dẫn Video chạy thử / Tập luyện (YouTube / Google Drive)</label>
                        <input
                          type="url"
                          name="videoLink"
                          value={formData.videoLink}
                          onChange={handleChange}
                          placeholder="Dán link video tập luyện của đội"
                          className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="border border-dashed border-white/10 rounded-xl p-8 text-center space-y-2 bg-dark-obsidian/30">
                        <Upload className="w-8 h-8 text-light-alabaster/40 mx-auto" />
                        <p className="text-xs text-light-alabaster/60">Kéo thả ảnh đại diện của đội thi (định dạng JPG/PNG)</p>
                        <p className="text-[10px] text-light-alabaster/40">Dung lượng tối đa: 5MB. Phục vụ truyền thông bình chọn.</p>
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
                    <div className="flex items-center gap-2 text-secondary font-heading font-semibold text-lg border-b border-white/5 pb-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Bước 4: Xác nhận hồ sơ đăng ký</span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Tên Đội Thi:</span>
                          <strong className="text-light-cream">{formData.teamName}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Trưởng Đoàn:</span>
                          <strong className="text-light-cream">{formData.representativeName}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Số Điện Thoại:</span>
                          <span className="text-light-cream">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Email liên hệ:</span>
                          <span className="text-light-cream">{formData.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Tên tiết mục:</span>
                          <strong className="text-secondary">{formData.performanceTitle}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-light-alabaster/40 uppercase tracking-wider">Ý tưởng tiết mục:</span>
                          <p className="text-xs text-light-alabaster/70 italic">&ldquo;{formData.description}&rdquo;</p>
                        </div>
                        {formData.audioLink && (
                          <div className="text-xs text-accent">
                            ✓ Nhạc nền đính kèm hợp lệ.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                      <input type="checkbox" required id="agreement" className="mt-1 accent-primary" />
                      <label htmlFor="agreement" className="text-xs text-light-alabaster/70 leading-relaxed">
                        Tôi cam kết tất cả thông tin khai báo trên là chính xác. Bản quyền âm nhạc của tiết mục hoàn toàn thuộc trách nhiệm tự thỏa thuận của đội thi. Ban tổ chức được toàn quyền sử dụng hình ảnh tiết mục để làm tư liệu truyền thông.
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-light-cream hover:bg-white/5 transition-colors"
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
