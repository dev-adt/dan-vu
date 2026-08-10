'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Compass, UserPlus, LogIn, Heart, Edit3, Newspaper, Video,
  CheckCircle2, AlertCircle, ChevronRight, ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';
import { useLanguage } from '@/context/LanguageContext';

export default function PublicUserGuidePage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('sec-overview');

  const navSections = [
    { id: 'sec-overview', label: t('guide.sec1_nav'), icon: Compass },
    { id: 'sec-register', label: t('guide.sec2_nav'), icon: UserPlus },
    { id: 'sec-team-portal', label: t('guide.sec3_nav'), icon: LogIn },
    { id: 'sec-vote', label: t('guide.sec4_nav'), icon: Heart },
    { id: 'sec-update-info', label: t('guide.sec5_nav'), icon: Edit3 },
    { id: 'sec-news-video', label: t('guide.sec6_nav'), icon: Newspaper },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-light-alabaster to-light-cream text-dark-obsidian">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Page Banner Header */}
        <section className="w-full bg-gradient-to-br from-primary/10 via-white to-accent/5 border-b border-slate-200/60 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-dark-slate/50 font-medium mb-3">
              <Link href="/" className="hover:text-primary transition-colors">{t('guide.breadcrumb_home')}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-dark-slate/80">{t('guide.breadcrumb_current')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-dark-obsidian">
                  {t('guide.title')}
                </h1>
                <p className="text-xs sm:text-sm text-dark-slate/60 mt-1">
                  {t('guide.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Table of Contents Navigation */}
            <aside className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 px-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t('guide.menu_title')}
                </h3>
                <nav className="space-y-1">
                  {navSections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                          isActive
                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{sec.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Support Callout Box */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/10 border border-primary/20 rounded-3xl p-5 space-y-2">
                <h4 className="font-heading font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {t('guide.support_title')}
                </h4>
                <p className="text-[11px] text-dark-slate/70 leading-relaxed">
                  {t('guide.support_desc')}
                </p>
                <div className="text-xs font-bold text-dark-obsidian pt-1">
                  {t('guide.hotline_label')} <span className="text-primary">0966 925 606</span> (Mrs. Hương)
                </div>
              </div>
            </aside>

            {/* Right Main Content Panel */}
            <div className="lg:col-span-8 space-y-12">
              {/* SECTION 1 */}
              <section id="sec-overview" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec1_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec1_subtitle')}</p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-dark-slate/80 leading-relaxed space-y-3">
                  <p>{t('guide.sec1_desc1')}</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li>{t('guide.sec1_item1')}</li>
                    <li>{t('guide.sec1_item2')}</li>
                    <li>{t('guide.sec1_item3')}</li>
                  </ul>
                </div>

                <ImageLightbox
                  src="/guide/Trang chủ.png"
                  alt="Giao diện Trang chủ Festival Dân Ca Dân Vũ Quốc Tế"
                  caption={t('guide.sec1_img_caption')}
                />
              </section>

              {/* SECTION 2 */}
              <section id="sec-register" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec2_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec2_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3 text-xs sm:text-sm text-dark-slate/80">
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Step 1</span>
                      <p>{t('guide.sec2_step1')}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Step 2</span>
                      <p>{t('guide.sec2_step2')}</p>
                    </div>
                    <ul className="list-disc pl-10 space-y-1 text-xs text-slate-700">
                      <li>{t('guide.sec2_item1')}</li>
                      <li>{t('guide.sec2_item2')}</li>
                      <li>{t('guide.sec2_item3')}</li>
                      <li>{t('guide.sec2_item4')}</li>
                      <li>{t('guide.sec2_item5')}</li>
                    </ul>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Step 3</span>
                      <p>{t('guide.sec2_step3')}</p>
                    </div>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang đăng ký.png"
                    alt="Mẫu Form đăng ký đội dự thi"
                    caption={t('guide.sec2_img_caption')}
                  />
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="sec-team-portal" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec3_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec3_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>{t('guide.sec3_desc1')}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                      <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <LogIn className="w-4 h-4" /> {t('guide.sec3_login_title')}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t('guide.sec3_login_desc')}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                      <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('guide.sec3_status_title')}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {t('guide.sec3_status_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang đăng nhập.png"
                      alt="Trang đăng nhập Cổng Đội Thi"
                      caption={t('guide.sec3_img1_caption')}
                    />
                    <ImageLightbox
                      src="/guide/Trang dashboard đội thi.png"
                      alt="Dashboard Quản lý Hồ sơ Đội thi"
                      caption={t('guide.sec3_img2_caption')}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 4 */}
              <section id="sec-vote" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec4_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec4_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">1</span>
                      <p>{t('guide.sec4_step1')}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">2</span>
                      <p>{t('guide.sec4_step2')}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">3</span>
                      <p>{t('guide.sec4_step3')}</p>
                    </div>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang bình chọn.png"
                    alt="Giao diện Cổng Bình Chọn khán giả"
                    caption={t('guide.sec4_img_caption')}
                  />
                </div>
              </section>

              {/* SECTION 5 */}
              <section id="sec-update-info" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec5_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec5_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>{t('guide.sec5_desc1')}</p>
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="sec-news-video" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    6
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      {t('guide.sec6_title')}
                    </h2>
                    <p className="text-xs text-dark-slate/60">{t('guide.sec6_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang tin tức.png"
                      alt="Trang Tin tức & Bài viết"
                      caption="Figure 6.1"
                    />
                    <ImageLightbox
                      src="/guide/Trang video.png"
                      alt="Trang Thư viện Video & Clips"
                      caption="Figure 6.2"
                    />
                  </div>
                </div>
              </section>

              {/* Back to Home Button */}
              <div className="pt-6 flex justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark-obsidian text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-opacity-85 transition-all shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.back')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
