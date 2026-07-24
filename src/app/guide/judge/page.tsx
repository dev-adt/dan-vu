'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award, LogIn, ListChecks, FileText, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';

export default function JudgeGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('sec-judge-login');

  const navSections = [
    { id: 'sec-judge-login', label: '1. Đăng nhập Cổng Giám khảo', icon: LogIn },
    { id: 'sec-judge-list', label: '2. Danh sách Tiết mục chấm', icon: ListChecks },
    { id: 'sec-judge-scoring', label: '3. Phiếu chấm 4 Tiêu chí & Nhận xét', icon: FileText },
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
        {/* Banner Header */}
        <section className="w-full bg-gradient-to-br from-accent/10 via-white to-primary/5 border-b border-slate-200/60 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-dark-slate/50 font-medium mb-3">
              <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-dark-slate/80">Hướng Dẫn Giám Khảo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-dark-obsidian">
                    Hướng Dẫn Dành Cho Giám Khảo
                  </h1>
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Nội Bộ
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-dark-slate/60 mt-1">
                  Tài liệu quy trình đăng nhập Cổng Giám Khảo, xem danh sách bài thi và nhập điểm 4 tiêu chí chuyên môn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar */}
            <aside className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 px-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Quy trình Chấm điểm
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
                            ? 'bg-accent text-white shadow-md shadow-accent/20 scale-[1.02]'
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

              {/* Callout box */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-2 border border-slate-800">
                <h4 className="font-heading font-bold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Bảo mật thông tin chấm
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tài khoản và điểm số của Giám khảo được bảo mật tuyệt đối. Điểm số sau khi lưu sẽ tự động tổng hợp vào hệ thống tính điểm trung bình sơ khảo.
                </p>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* SECTION 1 */}
              <section id="sec-judge-login" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Đăng Nhập Cổng Giám Khảo
                    </h2>
                    <p className="text-xs text-dark-slate/60">Truy cập giao diện chấm điểm dành riêng cho thành viên Hội Đồng Giám Khảo</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                    <p><strong>Bước 1:</strong> Truy cập Cổng Giám khảo tại đường dẫn <code className="bg-slate-200 px-2 py-0.5 rounded text-accent font-mono">/judge</code>.</p>
                    <p><strong>Bước 2:</strong> Nhập <strong>Email</strong> và <strong>Mật khẩu ban đầu</strong> được Ban Tổ Chức cấp riêng cho từng Giám khảo.</p>
                    <p><strong>Bước 3:</strong> Nhấn <strong>"Đăng Nhập Giám Khảo"</strong> để vào bảng làm việc.</p>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang đăng nhập giám khảo.png"
                    alt="Giao diện đăng nhập Giám khảo"
                    caption="Hình 1.1: Màn hình Đăng nhập Cổng Giám Khảo"
                  />
                </div>
              </section>

              {/* SECTION 2 */}
              <section id="sec-judge-list" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Danh Sách Tiết Mục & Quản Lý Phiếu Chấm
                    </h2>
                    <p className="text-xs text-dark-slate/60">Theo dõi danh sách bài thi, trạng thái đã chấm/chưa chấm</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tại màn hình chính của Giám khảo, danh sách các tiết mục dự thi thuộc thể loại <strong>Dân Ca</strong> và <strong>Dân Vũ</strong> sẽ được liệt kê đầy đủ.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li>Sử dụng ô <strong>Tìm kiếm</strong> để tìm theo Tên Đội thi hoặc Tên tiết mục.</li>
                    <li>Lọc theo thể loại: <em>Tất cả</em>, <em>Dân Ca</em>, <em>Dân Vũ</em>.</li>
                    <li>Xem trạng thái: <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Đã chấm</span> hoặc <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">Chưa chấm</span>.</li>
                    <li>Nhấn nút <strong>"Chấm điểm"</strong> để mở Phiếu chấm điểm chi tiết.</li>
                  </ul>

                  <ImageLightbox
                    src="/guide/Trang danh sách chấm bài của giám khảo.png"
                    alt="Danh sách tiết mục chấm điểm của Giám khảo"
                    caption="Hình 2.1: Giao diện Bảng danh sách các tiết mục dự thi dành cho Giám khảo"
                  />
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="sec-judge-scoring" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Phiếu Chấm Điểm 4 Tiêu Chí & Nhận Xét Chuyên Môn
                    </h2>
                    <p className="text-xs text-dark-slate/60">Quy định thang điểm 100 và nhập lời nhận xét cho từng tiết mục</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                    <h4 className="font-bold text-xs text-accent uppercase tracking-wider">Thang điểm đánh giá sơ khảo (Tối đa 100 điểm):</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-primary block">1. Nội dung & Ý tưởng nghệ thuật</span>
                        <span className="text-slate-500">Tối đa: <strong>30 điểm</strong></span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-primary block">2. Kỹ thuật biểu diễn & Trang phục</span>
                        <span className="text-slate-500">Tối đa: <strong>40 điểm</strong></span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-primary block">3. Tính sáng tạo & Hiệu ứng sân khấu</span>
                        <span className="text-slate-500">Tối đa: <strong>20 điểm</strong></span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-primary block">4. Tổng thể & Ấn tượng nghệ thuật</span>
                        <span className="text-slate-500">Tối đa: <strong>10 điểm</strong></span>
                      </div>
                    </div>
                  </div>

                  <p>
                    Sau khi nhập điểm cho 4 tiêu chí và viết nhận xét (nếu có), Giám khảo nhấn <strong>"Lưu Phiếu Chấm Điểm"</strong>. Điểm số sẽ tự động đồng bộ hóa trên Bảng điểm tổng hợp của Ban Quản Trị.
                  </p>

                  <ImageLightbox
                    src="/guide/Trang chấm bài chi tiết của giám khảo.png"
                    alt="Phiếu chấm điểm chi tiết của Giám khảo"
                    caption="Hình 3.1: Giao diện Phiếu chấm điểm 4 tiêu chí & Ô nhập nhận xét chuyên môn"
                  />
                </div>
              </section>

              {/* Navigation Back */}
              <div className="pt-6 flex justify-center">
                <Link
                  href="/judge"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-opacity-90 transition-all shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Truy cập Cổng Giám Khảo
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
