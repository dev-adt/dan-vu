'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, LogIn, Users, Edit3, Award, UserCheck, Newspaper, Video,
  CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Sparkles, Settings
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageLightbox from '@/components/ImageLightbox';

export default function AdminGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('sec-admin-login');

  const navSections = [
    { id: 'sec-admin-login', label: '1. Đăng nhập Quản trị viên', icon: LogIn },
    { id: 'sec-admin-anti-cheat', label: '2. Giám sát Bình chọn (Anti-cheat)', icon: ShieldAlert },
    { id: 'sec-admin-teams', label: '3. Quản lý Hồ sơ Đội thi', icon: Users },
    { id: 'sec-admin-pending', label: '4. Duyệt Đổi Thông tin Đội thi', icon: Edit3 },
    { id: 'sec-admin-rankings', label: '5. Bảng Điểm & Xếp Hạng', icon: Award },
    { id: 'sec-admin-judges', label: '6. Quản lý Tài khoản Giám khảo', icon: UserCheck },
    { id: 'sec-admin-posts', label: '7. Quản lý Bài viết (Markdown)', icon: Newspaper },
    { id: 'sec-admin-videos', label: '8. Quản lý Video & Clips', icon: Video },
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
        <section className="w-full bg-gradient-to-br from-dark-obsidian via-slate-900 to-primary/30 text-white border-b border-slate-800 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
              <Link href="/" className="hover:text-secondary transition-colors">Trang Chủ</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/80">Hướng Dẫn Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-dark-obsidian flex items-center justify-center shadow-lg font-bold">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    Hướng Dẫn Quản Trị Hệ Thống (Admin)
                  </h1>
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Bảo Mật
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Tài liệu chi tiết hướng dẫn vận hành toàn bộ tính năng Dashboard Admin Festival Dân Ca Dân Vũ Quốc Tế 2026.
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
                  <Sparkles className="w-4 h-4 text-primary" />
                  Menu Tính Năng Admin
                </h3>
                <nav className="space-y-1">
                  {navSections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                          isActive
                            ? 'bg-dark-obsidian text-white shadow-md scale-[1.02]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-secondary' : 'text-slate-400'}`} />
                        <span>{sec.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Notice Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 space-y-2">
                <h4 className="font-heading font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Quyền Hạn Quản Trị
                </h4>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Tài khoản Admin có quyền cao nhất trên hệ thống. Vui lòng bảo mật thông tin đăng nhập và kiểm tra kỹ dữ liệu trước khi xóa hoặc duyệt.
                </p>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* SECTION 1 */}
              <section id="sec-admin-login" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Đăng Nhập Dashboard Quản Trị Vien
                    </h2>
                    <p className="text-xs text-dark-slate/60">Truy cập Cổng Quản Trị Admin qua tài khoản bảo mật</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                    <p><strong>Bước 1:</strong> Truy cập Cổng Admin tại đường dẫn <code className="bg-slate-200 px-2 py-0.5 rounded text-primary font-mono">/admin</code>.</p>
                    <p><strong>Bước 2:</strong> Nhập <strong>Tên đăng nhập (Admin Username)</strong> và <strong>Mật khẩu quản trị</strong>.</p>
                    <p><strong>Bước 3:</strong> Bấm <strong>"Đăng Nhập Quản Trị"</strong> để truy cập Dashboard toàn quyền.</p>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang đăng nhập admin.png"
                    alt="Giao diện Đăng nhập Admin"
                    caption="Hình 1.1: Giao diện Màn hình Đăng nhập Quản Trị Viên (Admin)"
                  />
                </div>
              </section>

              {/* SECTION 2 */}
              <section id="sec-admin-anti-cheat" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Giám Sát Bình Chọn Bất Thường (Anti-Cheat & Fraud Detection)
                    </h2>
                    <p className="text-xs text-dark-slate/60">Theo dõi chi tiết IP, Fingerprint và hủy các lượt vote gian lận</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tab <strong>"Nhật ký Giám sát"</strong> ghi nhận thời gian thực mọi lượt bình chọn của khán giả trên website:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li><strong>Thống kê thời gian thực:</strong> Tổng số lượt vote, số lượt vote hợp lệ và lượt vote cảnh báo.</li>
                    <li><strong>Phát hiện tự động:</strong> Cảnh báo khi một địa chỉ IP hoặc thiết bị bấm vote dồn dập trong thời gian ngắn.</li>
                    <li><strong>Thao tác Admin:</strong> Bấm <em>"Hủy lượt vote"</em> để trừ trực tiếp lượt vote ảo của tiết mục đó.</li>
                  </ul>

                  <ImageLightbox
                    src="/guide/Trang chi tiết vote admin.png"
                    alt="Nhật ký Giám sát bình chọn bất thường Admin"
                    caption="Hình 2.1: Nhật ký Giám sát Bình chọn & Công cụ phát hiện gian lận"
                  />
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="sec-admin-teams" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Quản Lý Hồ Sơ Đội Thi (Phê Duyệt / Từ Chối / Xóa)
                    </h2>
                    <p className="text-xs text-dark-slate/60">Kiểm tra thông tin bài thi, nghe thử nhạc nền và xét duyệt hồ sơ</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tại Tab <strong>"Quản lý Đội Thi"</strong>, Admin có thể:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li>Tìm kiếm theo Mã số, Tên đội, SĐT, Email hoặc lọc theo thể loại (Dân Ca / Dân Vũ).</li>
                    <li>Bấm nút <strong>"Phê duyệt"</strong> để duyệt đội thi được phép xuất hiện ở Cổng bình chọn và Bảng điểm sơ khảo.</li>
                    <li>Bấm nút <strong>"Từ chối"</strong> hoặc <strong>"Chỉnh sửa"</strong> thông tin nếu hồ sơ bị thiếu/sai lệch.</li>
                  </ul>

                  <ImageLightbox
                    src="/guide/Trang quản lý đội thi admin.png"
                    alt="Bảng quản lý danh sách đội thi Admin"
                    caption="Hình 3.1: Giao diện Quản lý danh sách Hồ sơ Đăng ký của Đội thi"
                  />
                </div>
              </section>

              {/* SECTION 4 */}
              <section id="sec-admin-pending" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Duyệt Yêu Cầu Chỉnh Sửa Thông Tin Đội Thi
                    </h2>
                    <p className="text-xs text-dark-slate/60">Xem xét và chấp nhận các thay đổi về tiết mục, người đại diện từ các Đội thi</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Khi Đội thi gửi yêu cầu sửa thông tin qua Dashboard, yêu cầu sẽ xuất hiện tại Tab <strong>"Yêu cầu Chỉnh sửa"</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li>Admin so sánh dữ liệu Cũ vs Dữ liệu Mới.</li>
                    <li>Bấm <strong>"Chấp nhận"</strong> để áp dụng dữ liệu mới vào hồ sơ chính thức.</li>
                    <li>Bấm <strong>"Bác bỏ"</strong> nếu thay đổi không hợp lệ.</li>
                  </ul>

                  <ImageLightbox
                    src="/guide/Trang quản lý yêu cầu chỉnh sửa thông tin đội nhóm của admin.png"
                    alt="Bảng duyệt yêu cầu đổi thông tin Đội thi Admin"
                    caption="Hình 4.1: Giao diện Duyệt Yêu cầu Thay đổi Thông tin Đội thi"
                  />
                </div>
              </section>

              {/* SECTION 5 */}
              <section id="sec-admin-rankings" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Bảng Điểm Sơ Khảo & Xếp Hạng Tự Động
                    </h2>
                    <p className="text-xs text-dark-slate/60">Theo dõi điểm trung bình 4 tiêu chí từ Hội Đồng Giám Khảo và in báo cáo</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tab <strong>"Bảng Điểm & Xếp Hạng"</strong> tự động tính toán điểm trung bình từ tất cả phiếu chấm của Giám khảo và sắp xếp thứ hạng từ cao xuống thấp.
                  </p>

                  <ImageLightbox
                    src="/guide/Trang xem bảng điểm xếp hạng các đội thi admin.png"
                    alt="Bảng điểm xếp hạng tự động Admin"
                    caption="Hình 5.1: Giao diện Bảng Điểm Sơ Khảo & Xếp Hạng Đội thi tự động"
                  />
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="sec-admin-judges" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    6
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Quản Lý & Cấp Tài Khoản Giám Khảo
                    </h2>
                    <p className="text-xs text-dark-slate/60">Khởi tạo tài khoản Giám khảo mới, đặt mật khẩu ban đầu và xóa tài khoản</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                    <p><strong>Tạo tài khoản Giám khảo:</strong> Điền <em>Họ và tên</em>, <em>Email</em>, <em>Mật khẩu ban đầu</em> và nhấn <strong>"Tạo tài khoản"</strong>.</p>
                    <p>Cung cấp Email & Mật khẩu này cho thành viên Giám khảo tương ứng để họ đăng nhập vào Cổng Giám Khảo.</p>
                  </div>

                  <ImageLightbox
                    src="/guide/Trang quản lý tài khoản giám khảo của admin.png"
                    alt="Bảng quản lý tài khoản Giám khảo Admin"
                    caption="Hình 6.1: Giao diện Quản lý & Khởi tạo Tài khoản Giám Khảo"
                  />
                </div>
              </section>

              {/* SECTION 7 */}
              <section id="sec-admin-posts" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    7
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Quản Lý Bài Viết & Soạn Thảo Markdown / HTML
                    </h2>
                    <p className="text-xs text-dark-slate/60">Đăng bài tin tức, chọn bài nổi bật, định dạng văn bản & chèn ảnh</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tab <strong>"Tin Tức & Bài Viết"</strong> cung cấp bộ công cụ biên tập bài viết chuyên nghiệp:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li><strong>Chế độ mặc định: Markdown</strong> — hỗ trợ căn lề (`-&gt;căn giữa&lt;-`), gạch đầu dòng, in đậm/nghiêng, chèn ảnh có caption (`_chú thích_`).</li>
                    <li><strong>Ghim nổi bật ★:</strong> Chọn tối đa 3 bài viết hiển thị nổi bật ở trang chủ.</li>
                    <li><strong>Trạng thái:</strong> Lưu nháp hoặc Đăng công khai.</li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang quản lý bài viết admin.png"
                      alt="Danh sách bài viết tin tức Admin"
                      caption="Hình 7.1: Danh sách bài viết truyền thông Admin"
                    />
                    <ImageLightbox
                      src="/guide/Trang viết bài chỉnh sửa bài viết admin.png"
                      alt="Trình soạn thảo Markdown bài viết Admin"
                      caption="Hình 7.2: Trình soạn thảo bài viết Markdown & Preview trực tiếp"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 8 */}
              <section id="sec-admin-videos" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-obsidian text-white flex items-center justify-center font-bold text-lg">
                    8
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-dark-obsidian">
                      Quản Lý Thư Viện Video & Clips
                    </h2>
                    <p className="text-xs text-dark-slate/60">Nhúng link video YouTube, Google Drive, Vimeo và tải ảnh bìa riêng</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-dark-slate/80 leading-relaxed">
                  <p>
                    Tab <strong>"Video & Clips"</strong> cho phép nhúng video từ các nền tảng trực tuyến uy tín:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                    <li><strong>Điền đường link Video (URL):</strong> Nhận diện tự động link YouTube, Drive, Vimeo hoặc MP4 trực tiếp.</li>
                    <li><strong>Ảnh bìa Video:</strong> Tự động lấy thumbnail YouTube HD hoặc cho phép tải ảnh custom từ máy tính lên.</li>
                    <li><strong>Ghim nổi bật ★:</strong> Chọn tối đa 3 video hiển thị nổi bật trên Trang chủ.</li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageLightbox
                      src="/guide/Trang quản lý video admin.png"
                      alt="Danh sách video clips Admin"
                      caption="Hình 8.1: Bảng quản lý danh sách Video Clips Admin"
                    />
                    <ImageLightbox
                      src="/guide/Trang đăng video admin.png"
                      alt="Form đăng video clip mới Admin"
                      caption="Hình 8.2: Form Đăng & Nhúng Video Clip mới"
                    />
                  </div>
                </div>
              </section>

              {/* Navigation Back */}
              <div className="pt-6 flex justify-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark-obsidian text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-opacity-90 transition-all shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Truy cập Cổng Quản Trị Admin
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
