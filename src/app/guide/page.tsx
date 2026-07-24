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

export default function PublicUserGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('sec-overview');

  const navSections = [
    { id: 'sec-overview', label: '1. Tổng quan & Trang chủ', icon: Compass },
    { id: 'sec-register', label: '2. Đăng ký Đội dự thi', icon: UserPlus },
    { id: 'sec-team-portal', label: '3. Cổng Đội Thi & Dashboard', icon: LogIn },
    { id: 'sec-vote', label: '4. Bình chọn Khán giả', icon: Heart },
    { id: 'sec-update-info', label: '5. Đổi thông tin Hồ sơ', icon: Edit3 },
    { id: 'sec-news-video', label: '6. Tin tức & Thư viện Video', icon: Newspaper },
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
              <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-dark-slate/80">Hướng Dẫn Sử Dụng</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-dark-obsidian">
                  Cẩm Nang & Hướng Dẫn Sử Dụng
                </h1>
                <p className="text-xs sm:text-sm text-dark-slate/60 mt-1">
                  Tài liệu chi tiết hướng dẫn dành cho Đội thi, Khán giả bình chọn và Người dùng Festival Dân Ca Dân Vũ Quốc Tế 2026.
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
                  Danh mục Hướng dẫn
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
                  Hỗ trợ trực tiếp 24/7
                </h4>
                <p className="text-[11px] text-dark-slate/70 leading-relaxed">
                  Nếu bạn cần hỗ trợ kỹ thuật hoặc có thắc mắc trong quá trình đăng ký, vui lòng liên hệ Ban Tổ Chức:
                </p>
                <div className="text-xs font-bold text-dark-obsidian pt-1">
                  📞 Hotline: <span className="text-primary">0966 925 606</span> (Mrs. Hương)
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
                      Tổng Quan Trang Chủ & Giao Diện Chính
                    </h2>
                    <p className="text-xs text-dark-slate/60">Khám phá các tính năng chính trên website Festival 2026</p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-dark-slate/80 leading-relaxed space-y-3">
                  <p>
                    Website <strong>Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026</strong> là cổng thông tin chính thức kết nối Ban Tổ Chức, các Đoàn nghệ thuật / Đội thi dự thi và Khán giả trên toàn quốc.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li><strong>Thanh điều hướng chính (Navbar):</strong> Truy cập nhanh Trang chủ, Cổng bình chọn, Đăng ký dự thi, Cổng Đội Thi.</li>
                    <li><strong>Bảng tin tức & Video:</strong> Cập nhật liên tục tin tức báo chí, video thông điệp và hình ảnh festival.</li>
                    <li><strong>Cổng bình chọn khán giả:</strong> Theo dõi bảng điểm và bình chọn trực tiếp cho đội yêu thích.</li>
                  </ul>
                </div>

                <ImageLightbox
                  src="/guide/Trang chủ.png"
                  alt="Giao diện Trang chủ Festival Dân Ca Dân Vũ Quốc Tế"
                  caption="Hình 1.1: Giao diện Trang chủ chính thức với các phân vùng chức năng"
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
                      Hướng Dẫn Đăng Ký Đội Dự Thi
                    </h2>
                    <p className="text-xs text-dark-slate/60">Quy trình nộp hồ sơ tham gia Festival dành cho các Đội nhóm / Câu lạc bộ</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3 text-xs sm:text-sm text-dark-slate/80">
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Bước 1</span>
                      <p>Trên thanh Menu chính, chọn <strong>"Đăng Ký Dự Thi"</strong> hoặc truy cập đường dẫn <code className="bg-slate-200 px-1 py-0.5 rounded text-xs text-primary font-mono">/register</code>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Bước 2</span>
                      <p>Điền đầy đủ thông tin vào Form đăng ký:</p>
                    </div>
                    <ul className="list-disc pl-10 space-y-1 text-xs text-slate-700">
                      <li><strong>Tên Đoàn / CLB / Đội thi:</strong> Nhập chính xác tên đơn vị biểu diễn.</li>
                      <li><strong>Thể loại dự thi:</strong> Chọn <em>Dân Ca</em>, <em>Dân Vũ</em> hoặc <em>Cả hai thể loại</em>.</li>
                      <li><strong>Thông tin đại diện:</strong> Họ tên người đại diện, Số điện thoại và Email chính xác (Email sẽ dùng để đăng nhập Cổng Đội Thi).</li>
                      <li><strong>Thông tin tiết mục:</strong> Tên tiết mục, thời lượng dự kiến, mô tả ý tưởng và yêu cầu kỹ thuật (micro, khói lạnh, bục bệ...).</li>
                      <li><strong>Mật khẩu quản trị đội thi:</strong> Tạo mật khẩu bảo mật (tối thiểu 6 ký tự).</li>
                    </ul>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Bước 3</span>
                      <p>Kiểm tra kỹ thông tin và nhấn nút <strong>"Gửi Hồ Sơ Đăng Ký"</strong>. Hệ thống sẽ tạo hồ sơ ở trạng thái <em>Chờ phê duyệt</em>.</p>
                    </div>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang đăng ký.png"
                    alt="Mẫu Form đăng ký đội dự thi"
                    caption="Hình 2.1: Giao diện Form nộp hồ sơ đăng ký tham gia Festival 2026"
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
                      Cổng Đội Thi & Dashboard Quản Lý Hồ Sơ
                    </h2>
                    <p className="text-xs text-dark-slate/60">Đăng nhập tài khoản đội thi, theo dõi trạng thái duyệt & nộp file nhạc/ảnh</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Sau khi đăng ký thành công, mỗi Đội thi có một <strong>Dashboard riêng</strong> để quản lý toàn bộ hồ sơ dự thi.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                      <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <LogIn className="w-4 h-4" /> Đăng nhập Cổng Đội Thi
                      </h4>
                      <p className="text-xs text-slate-600">
                        Chọn menu <strong>"Cổng Đội Thi"</strong> hoặc truy cập <code className="bg-slate-200 px-1 py-0.5 rounded text-primary">/team/login</code>. Đăng nhập bằng Email & Mật khẩu đã tạo.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                      <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Trạng thái Phê duyệt
                      </h4>
                      <p className="text-xs text-slate-600">
                        Hồ sơ sẽ hiển thị nhãn trạng thái: <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Chờ duyệt</span>, <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Đã duyệt</span> hoặc <span className="bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">Từ chối</span>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang đăng nhập.png"
                      alt="Trang đăng nhập Cổng Đội Thi"
                      caption="Hình 3.1: Giao diện đăng nhập tài khoản Đội thi"
                    />
                    <ImageLightbox
                      src="/guide/Trang dashboard đội thi.png"
                      alt="Dashboard Quản lý Hồ sơ Đội thi"
                      caption="Hình 3.2: Giao diện Dashboard Quản lý Hồ sơ Đội thi"
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
                      Hướng Dẫn Khán Giả Đăng Nhập & Bình Chọn
                    </h2>
                    <p className="text-xs text-dark-slate/60">Bình chọn ủng hộ các tiết mục yêu thích tại Festival 2026</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">1</span>
                      <p>Truy cập menu <strong>"Cổng Bình Chọn"</strong> trên thanh điều hướng hoặc xem danh sách các Đội thi ở Trang chủ.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">2</span>
                      <p>Tìm kiếm tên Đội thi hoặc Tiết mục cần bình chọn, nhấn nút <strong>"Bình Chọn Ngay"</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-accent text-white font-bold px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">3</span>
                      <p>Xác thực lượt bình chọn hợp lệ. Mỗi lượt vote đều được kiểm soát bởi hệ thống bảo mật để đảm bảo tính công bằng chuyên nghiệp.</p>
                    </div>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang bình chọn.png"
                    alt="Giao diện Cổng Bình Chọn khán giả"
                    caption="Hình 4.1: Cổng Bình Chọn trực tuyến với bảng xếp hạng lượt vote thời gian thực"
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
                      Hướng Dẫn Gửi Yêu Cầu Chỉnh Sửa Thông Tin
                    </h2>
                    <p className="text-xs text-dark-slate/60">Quy trình cập nhật tên tiết mục, SĐT, danh sách thành viên hoặc kỹ thuật sân khấu</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Khi Đội thi cần cập nhật lại thông tin tiết mục hoặc người đại diện sau khi đã được phê duyệt, đội thi thực hiện các bước:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
                    <li>Đăng nhập vào <strong>Dashboard Cổng Đội Thi</strong>.</li>
                    <li>Bấm nút <strong>"Gửi Yêu Cầu Chỉnh Sửa"</strong> bên cạnh thông tin cần thay đổi.</li>
                    <li>Nhập thông tin mới và lý do thay đổi, sau đó bấm <strong>"Xác nhận gửi yêu cầu"</strong>.</li>
                    <li>Yêu cầu sẽ được chuyển tới Ban Quản Trị (Admin). Sau khi Admin kiểm tra và bấm <em>Chấp nhận</em>, thông tin mới sẽ tự động cập nhật trên hệ thống.</li>
                  </ol>
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
                      Khám Phá Tin Tức & Thư Viện Video Clips
                    </h2>
                    <p className="text-xs text-dark-slate/60">Theo dõi thông tin báo chí, thông điệp truyền thông và xem video biểu diễn</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang tin tức.png"
                      alt="Trang Tin tức & Bài viết"
                      caption="Hình 6.1: Trang danh sách Tin tức & Bài viết truyền thông"
                    />
                    <ImageLightbox
                      src="/guide/Trang video.png"
                      alt="Trang Thư viện Video & Clips"
                      caption="Hình 6.2: Thư viện Video Clips phát trực tiếp trên Modal"
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
                  Quay về Trang Chủ
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
