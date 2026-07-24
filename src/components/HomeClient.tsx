'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music, ArrowRight, Star, Heart, Award, Calendar, User, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import { parseMarkdownToHtml } from '@/lib/parseMarkdown';
import VideoModal, { VideoItem } from '@/components/VideoModal';
import { parseVideoUrl } from '@/lib/videoUtils';


interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  photo_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  author: string;
  format?: 'html' | 'text' | 'markdown';
  summary?: string;
  source?: string;
}


const bgImages = [
  '/images/hero-bg-1.png',
  '/images/hero-bg-2.png',
  '/images/hero-bg-3.png',
];

export default function HomeClient() {
  const [currentBgIndex, setCurrentBgIndex] = React.useState(0);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = React.useState(true);
  const [selectedVideo, setSelectedVideo] = React.useState<VideoItem | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 6000); // changes every 6 seconds
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const fetchHomePosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Failed to load news posts:', err);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    const fetchHomeVideos = async () => {
      try {
        const res = await fetch('/api/videos?limit=3');
        if (res.ok) {
          const data = await res.json();
          setVideos(data.videos || []);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchHomePosts();
    fetchHomeVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative selection:bg-accent selection:text-white overflow-x-clip w-full">
      <Navbar />

      {/* Background watermark wrapper to prevent layout shift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Rotating Dong Son Bronze Drum Watermarks */}
        <div className="absolute top-[10%] -left-48 w-96 sm:w-[500px] h-96 sm:h-[500px] opacity-[0.025] select-none">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
            viewBox="0 0 400 400"
            className="w-full h-full text-accent"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="200" cy="200" r="190" strokeWidth="1" />
            <circle cx="200" cy="200" r="180" strokeWidth="0.5" strokeDasharray="3,3" />
            <circle cx="200" cy="200" r="150" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="120" strokeWidth="1" />
            <circle cx="200" cy="200" r="90" strokeWidth="0.5" strokeDasharray="4,2" />
            <circle cx="200" cy="200" r="60" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="30" strokeWidth="0.5" />
            <path
              d="M200,170 L205,190 L225,185 L210,197 L227,210 L206,204 L200,225 L194,204 L173,210 L190,197 L175,185 L195,190 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={200 + 190 * Math.cos((i * 30 * Math.PI) / 180)}
                y2={200 + 190 * Math.sin((i * 30 * Math.PI) / 180)}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            ))}
          </motion.svg>
        </div>

        <div className="absolute top-[50%] -right-48 w-96 sm:w-[600px] h-96 sm:h-[600px] opacity-[0.02] select-none">
          <motion.svg
            animate={{ rotate: -360 }}
            transition={{ duration: 220, repeat: Infinity, ease: 'linear' }}
            viewBox="0 0 400 400"
            className="w-full h-full text-primary"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="200" cy="200" r="190" strokeWidth="1" />
            <circle cx="200" cy="200" r="175" strokeWidth="0.5" strokeDasharray="4,4" />
            <circle cx="200" cy="200" r="145" strokeWidth="1" />
            <circle cx="200" cy="200" r="115" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="85" strokeWidth="0.5" strokeDasharray="2,2" />
            <circle cx="200" cy="200" r="55" strokeWidth="1.5" />
            <path
              d="M200,175 L204,192 L221,187 L208,197 L222,208 L205,203 L200,220 L195,203 L178,208 L192,197 L179,187 L196,192 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={200 + 190 * Math.cos((i * 30 * Math.PI) / 180)}
                y2={200 + 190 * Math.sin((i * 30 * Math.PI) / 180)}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            ))}
          </motion.svg>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-transparent border-b border-slate-200/20">
        {/* Background elements wrapper to prevent absolute-flex rendering shift */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Background Image Slider with Crossfade */}
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentBgIndex}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.28, scale: 1.02 }}
                exit={{ opacity: 0, scale: 1.00 }}
                transition={{ duration: 2.0, ease: 'easeInOut' }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgImages[currentBgIndex]})` }}
              />
            </AnimatePresence>
          </div>

          {/* Soft elegant background gradient & abstract decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-light-alabaster via-light-alabaster/65 to-light-alabaster/20 z-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[100px] animate-pulse" />

          {/* Subtle geometric pattern placeholder */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#C62828_1px,transparent_1px)] [background-size:24px_24px] z-10" />

          {/* Clean background gradient */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 fill-primary" /> Festival Dân Ca Dân Vũ Quốc Tế 2026
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl text-dark-obsidian leading-tight tracking-wide">
              NHỊP BƯỚC VIỆT NAM
            </h1>
            <p className="text-base sm:text-xl text-primary font-bold tracking-wide max-w-3xl mx-auto">
              Chủ đề: &ldquo;Kết nối văn hóa - Lan tỏa hòa bình - Vươn tầm hội nhập&rdquo;
            </p>
            <div className="pt-2">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl backdrop-blur-sm shadow-sm">
                📍 Từ 28/08 đến 02/09/2026 tại Quảng trường 7/5, phường Điện Biên Phủ, tỉnh Điện Biên
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-opacity-95 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(198,40,40,0.25)] transition-all glow-crimson-hover"
            >
              Đăng Ký Dự Thi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-opacity-95 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(0,105,92,0.25)] transition-all"
            >
              Bình Chọn Tiết Mục
            </Link>
            <a
              href="/files/the-le-chi-tiet.pdf"
              download="The_le_chi_tiet_Nhip_buoc_Viet_Nam_2026.pdf"
              className="text-xs font-semibold text-dark-slate/60 hover:text-primary underline underline-offset-4 mt-2 sm:mt-0"
            >
              Tải Thể Lệ Chi Tiết (PDF)
            </a>
          </motion.div>
        </div>
      </section>

      {/* Cultural Narrative Introduction */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-6 bg-accent rounded-full" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">
              Văn Hóa & Sứ Mệnh
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-dark-obsidian leading-tight">
            Giao thoa giữa di sản ngàn năm & vũ điệu đương đại
          </h2>
          <p className="text-dark-slate/95 leading-relaxed text-sm">
            Festival Dân ca Dân vũ Quốc tế &ldquo;Nhịp Bước Việt Nam 2026&rdquo; chào mừng 81 năm Quốc khánh (02/9/1945 - 02/9/2026). Đây là ngày hội văn hóa quy tụ các đoàn nghệ thuật dân gian, dân vũ trong nước và quốc tế (Lào, Thái Lan, Trung Quốc,...), kết nối di sản văn hóa phi vật thể và quảng bá hình ảnh đất nước, con người Việt Nam cùng tỉnh Điện Biên.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-4 bg-light-alabaster/80 rounded-xl border border-slate-300/40 shadow-sm backdrop-blur-sm">
              <span className="block text-xl sm:text-2xl font-bold text-primary">50-100</span>
              <span className="text-[11px] text-dark-slate/70 font-medium">Đoàn NT & CLB dự thi</span>
            </div>
            <div className="p-4 bg-light-alabaster/80 rounded-xl border border-slate-300/40 shadow-sm backdrop-blur-sm">
              <span className="block text-xl sm:text-2xl font-bold text-accent">300</span>
              <span className="text-[11px] text-dark-slate/70 font-medium">Gian hàng hội chợ & OCOP</span>
            </div>
            <div className="p-4 bg-light-alabaster/80 rounded-xl border border-slate-300/40 shadow-sm backdrop-blur-sm">
              <span className="block text-xl sm:text-2xl font-bold text-amber-600">Khinh Khí Cầu</span>
              <span className="text-[11px] text-dark-slate/70 font-medium">Trình diễn độc đáo</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-300/60 group shadow-md flex items-center justify-center bg-light-cream/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 mix-blend-overlay" />
          <div className="z-10 text-center space-y-4">
            <button className="w-16 h-16 rounded-full bg-secondary text-[#111827] flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <Play className="w-6 h-6 fill-[#111827] ml-1" />
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-dark-obsidian">Xem Video Giới Thiệu Sự Kiện</p>
          </div>
        </motion.div>
      </section>

      {/* Logo & Brand Identity Contest Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-amber-500/10 via-primary/5 to-accent/10 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-amber-500/20 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-600" /> Cuộc Thi Thiết Kế Chính Thức
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                PHÁT ĐỘNG CUỘC THI THIẾT KẾ LOGO VÀ BỘ NHẬN DIỆN FESTIVAL
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-3xl">
                Tìm kiếm biểu trưng chính thức cho Festival Dân ca Dân vũ Quốc tế 2026. Dành cho các công dân Việt Nam và người nước ngoài có năng lực sáng tạo mỹ thuật & thiết kế.
              </p>
            </div>
            <div className="bg-white/90 border border-amber-500/40 px-5 py-3.5 rounded-2xl text-center shadow-sm shrink-0">
              <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Thời gian tiếp nhận</span>
              <span className="font-bold text-sm text-primary">21/07/2026 – 30/07/2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contest Awards */}
            <div className="space-y-4 bg-white/80 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" /> Cơ Cấu Giải Thưởng Cuộc Thi Logo
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/60">
                  <span className="font-bold text-amber-900 shrink-0">01 Giải Nhất:</span>
                  <div>
                    <strong className="text-amber-900 text-base">20.000.000 VNĐ</strong> + Chuyến du lịch nước ngoài.
                    <p className="text-[11px] text-slate-600 mt-0.5">Tác phẩm đạt giải sẽ được lựa chọn làm Logo chính thức của Festival.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 shrink-0">02 Giải Khuyến Khích:</span>
                  <div>
                    <strong className="text-slate-900 text-base">5.000.000 VNĐ / giải</strong> + Chuyến du lịch Điện Biên.
                  </div>
                </li>
              </ul>
            </div>

            {/* Submission Info */}
            <div className="space-y-4 bg-white/80 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-accent" /> Hồ Sơ & Địa Chỉ Tiếp Nhận
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Tác phẩm dự thi bảo đảm tính sáng tạo, tính biểu trưng, khả năng ứng dụng cao và chưa từng tham gia hoặc đạt giải tại các cuộc thi khác.
                </p>
                <div className="mt-4 p-3.5 bg-slate-100/90 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <p><strong>Hồ sơ gửi về:</strong> Văn phòng Ban Tổ chức, số 53 Nguyễn Du, phường Hai Bà Trưng, thành phố Hà Nội.</p>
                  <p><strong>Trưởng Ban Truyền Thông:</strong> Mrs. Hương - 0966 925 606</p>
                  <p><strong>Email chính thức:</strong> festval2026@dancadanvu.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="bg-light-cream/30 py-20 border-y border-slate-200/40 relative z-10">
        <Timeline />
      </section>

      {/* Awards Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Cơ Cấu Giải Thưởng Festival
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-dark-obsidian mt-2">
            Giải Thưởng Toàn Đoàn & Chuyên Đề
          </h2>
          <div className="w-12 h-0.5 bg-secondary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Second Prize */}
          <div className="bg-light-alabaster border border-slate-300/60 shadow-sm p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 hover:border-slate-400/60 transition-all">
            <div className="w-16 h-16 rounded-full bg-light-cream flex items-center justify-center text-dark-slate">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-dark-slate/60 uppercase tracking-widest font-semibold">02 Giải Nhì</span>
              <h3 className="font-heading font-bold text-2xl text-dark-obsidian mt-1">100.000.000 VNĐ</h3>
              <p className="text-xs text-accent font-bold uppercase tracking-wider mt-1">Mỗi giải / Cờ & Chứng nhận</p>
              <p className="text-xs text-dark-slate/85 mt-2">Vinh danh các tập thể xuất sắc có kỹ thuật đồng đều và ý tưởng dàn dựng đột phá.</p>
            </div>
          </div>

          {/* First Prize (Highlighted) */}
          <div className="bg-gradient-to-b from-light-alabaster to-light-cream border-2 border-secondary p-10 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 relative shadow-[0_10px_40px_rgba(244,180,0,0.08)] glow-gold-hover md:-translate-y-4">
            <span className="absolute -top-3.5 bg-secondary text-[#111827] font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Danh Giá Nhất
            </span>
            <div className="w-20 h-20 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs text-secondary uppercase tracking-widest font-semibold">01 Giải Nhất Toàn Đoàn</span>
              <h3 className="font-heading font-bold text-3xl text-dark-obsidian mt-1">150.000.000 VNĐ</h3>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Cúp Vàng, Cờ & Chứng nhận</p>
              <p className="text-xs text-dark-slate/95 mt-2">Trao cho đoàn nghệ thuật xuất sắc nhất kết hợp trọn vẹn bản sắc dân gian và tinh hoa vũ đạo.</p>
            </div>
          </div>

          {/* Third Prize */}
          <div className="bg-light-alabaster border border-slate-300/60 shadow-sm p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 hover:border-slate-400/60 transition-all">
            <div className="w-16 h-16 rounded-full bg-light-cream flex items-center justify-center text-dark-slate">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-dark-slate/60 uppercase tracking-widest font-semibold">03 Giải Ba</span>
              <h3 className="font-heading font-bold text-2xl text-dark-obsidian mt-1">80.000.000 VNĐ</h3>
              <p className="text-xs text-accent font-bold uppercase tracking-wider mt-1">Mỗi giải / Cờ & Chứng nhận</p>
              <p className="text-xs text-dark-slate/85 mt-2">Trao cho các đoàn biểu diễn nhiệt huyết, giàu cảm xúc truyền tải di sản.</p>
            </div>
          </div>
        </div>

        {/* Consolation & Special Category Prizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel border border-slate-300/40 rounded-2xl p-6 bg-light-alabaster shadow-sm">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Các Giải Khuyến Khích</h4>
            <p className="text-xs text-dark-slate/90 leading-relaxed">
              Mỗi giải trị giá dự kiến <strong className="text-primary font-bold text-sm">50.000.000 VNĐ</strong>, kèm Cờ lưu niệm & Giấy chứng nhận của Ban Tổ chức.
            </p>
          </div>
          <div className="glass-panel border border-amber-400/40 rounded-2xl p-6 bg-amber-50/50 shadow-sm">
            <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-2">Hệ Thống Giải Chuyên Đề</h4>
            <p className="text-xs text-dark-slate/90 leading-relaxed">
              Các giải: <em className="font-semibold text-slate-800">Tiết mục xuất sắc, Biên đạo xuất sắc, Đội hình đẹp nhất, Trang phục đẹp nhất, Giải Sáng tạo, Giải được khán giả yêu thích, Giải Giao lưu quốc tế</em>. Mỗi giải trị giá <strong className="text-amber-900 font-bold text-sm">30.000.000 VNĐ</strong> kèm Cúp (Biểu trưng), Giấy chứng nhận & Kỷ niệm chương.
            </p>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="bg-gradient-to-b from-white to-light-cream/40 py-24 px-4 border-t border-slate-200/40 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/60 pb-6 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
                TIN TỨC & HOẠT ĐỘNG
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-dark-obsidian mt-1.5">
                Tin nổi bật
              </h2>
            </div>
          </div>

          {/* Cards Grid — max 3 bài, ưu tiên nổi bật rồi mới nhất */}
          {isLoadingPosts ? (
            <div className="text-center py-16">
              <p className="text-xs text-dark-slate/60 animate-pulse">Đang tải tin tức mới nhất...</p>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Container */}
                    <Link href={`/posts/${post.id}`} className="block relative h-48 w-full overflow-hidden bg-slate-100 select-none">
                      {post.photo_url ? (
                        <img
                          src={post.photo_url}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-primary/30">
                          <Newspaper className="w-12 h-12" />
                        </div>
                      )}
                      {post.is_featured && (
                        <span className="absolute top-3 right-3 bg-secondary text-[#111827] font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                          NỔI BẬT ★
                        </span>
                      )}
                    </Link>

                    {/* Body Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Link href={`/posts/${post.id}`}>
                          <h3 className="font-heading font-extrabold text-sm text-dark-obsidian leading-snug line-clamp-2 min-h-[40px] hover:text-primary transition-colors cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-dark-slate/70">
                          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[9px]">
                            {post.author ? post.author.substring(0, 2).toUpperCase() : 'BTC'}
                          </div>
                          <span className="font-semibold">{post.author || 'Ban Tổ Chức'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-[10px] text-dark-slate/50 font-medium">
                          {new Date(post.created_at).toLocaleDateString('vi-VN')}
                        </span>
                        <Link
                          href={`/posts/${post.id}`}
                          className="px-4 py-2 bg-[#0074DA] text-white hover:bg-opacity-90 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm"
                        >
                          Đọc bài
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Xem tất cả button */}
              <div className="flex justify-center mt-10">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-dark-obsidian text-white font-bold text-sm rounded-2xl hover:bg-opacity-85 transition-all shadow-md group"
                >
                  Xem tất cả tin tức
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs text-dark-slate/50 italic">Hiện tại chưa có bài viết tin tức nào được xuất bản.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video & Clips Section */}
      <section className="py-24 px-4 border-t border-slate-200/40 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/60 pb-6 gap-4 text-left">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent block">
                THƯ VIỆN VIDEO & CLIPS
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-dark-obsidian mt-1.5">
                Video nổi bật
              </h2>
            </div>
          </div>

          {/* Video Cards Grid — max 3 videos */}
          {isLoadingVideos ? (
            <div className="text-center py-16">
              <p className="text-xs text-dark-slate/60 animate-pulse">Đang tải video mới nhất...</p>
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {videos.slice(0, 3).map((vid) => {
                  const parsed = parseVideoUrl(vid.video_url, vid.thumbnail_url);
                  return (
                    <div
                      key={vid.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left"
                      onClick={() => setSelectedVideo(vid)}
                    >
                      {/* Thumbnail & Play Overlay */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900 select-none">
                        {parsed.thumbnailUrl ? (
                          <img
                            src={parsed.thumbnailUrl}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white/40">
                            <Play className="w-16 h-16" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>

                        {vid.is_featured && (
                          <span className="absolute top-3 right-3 bg-secondary text-[#111827] font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md z-10">
                            NỔI BẬT ★
                          </span>
                        )}
                      </div>

                      {/* Body Content */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-heading font-extrabold text-sm text-dark-obsidian leading-snug line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
                            {vid.title}
                          </h3>
                          {vid.summary && (
                            <p className="text-[11px] text-dark-slate/60 line-clamp-2 italic">{vid.summary}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-[10px] text-dark-slate/50 font-medium">
                            {new Date(vid.created_at).toLocaleDateString('vi-VN')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideo(vid);
                            }}
                            className="flex items-center gap-1 px-4 py-2 bg-[#0074DA] text-white hover:bg-opacity-90 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Xem Video
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Xem tất cả Video button */}
              <div className="flex justify-center mt-10">
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-dark-obsidian text-white font-bold text-sm rounded-2xl hover:bg-opacity-85 transition-all shadow-md group"
                >
                  Xem tất cả Video
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs text-dark-slate/50 italic">Hiện tại chưa có video nào được xuất bản.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal Popup */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      <Footer />
    </div>
  );
}
