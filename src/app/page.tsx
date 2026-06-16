'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music, ArrowRight, Star, Heart, Award } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative selection:bg-accent selection:text-white overflow-x-hidden w-full">
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
          {/* Soft elegant background gradient & abstract decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-light-alabaster via-light-alabaster/70 to-light-alabaster/30 z-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[100px] animate-pulse" />
          
          {/* Subtle geometric pattern placeholder */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C62828_1px,transparent_1px)] [background-size:24px_24px]" />

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
            <p className="text-lg sm:text-xl text-dark-slate/85 italic font-semibold tracking-wide max-w-2xl mx-auto">
              &ldquo;Nơi tôn vinh bản sắc bản địa và nhịp điệu hiện đại.&rdquo;
            </p>
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
              href="#"
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
              Vần Hóa & Sứ Mệnh
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-dark-obsidian leading-tight">
            Giao thoa giữa di sản ngàn năm & vũ điệu đương đại
          </h2>
          <p className="text-dark-slate/95 leading-relaxed text-sm">
            Festival Dân ca Dân vũ Quốc tế &ldquo;Nhịp Bước Việt Nam 2026&rdquo; không chỉ đơn thuần là sân chơi tài năng nghệ thuật, mà còn là hành trình lưu giữ ngọn lửa di sản. Chúng tôi kiến tạo không gian văn hóa nơi các giai điệu cổ xưa kết duyên cùng các vũ điệu hiện đại tinh tế, tạo nên bức tranh đa sắc tộc rực rỡ sắc màu quốc gia.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-5 bg-light-alabaster/80 rounded-xl border border-slate-300/40 shadow-sm backdrop-blur-sm">
              <span className="block text-2xl font-bold text-primary">10+</span>
              <span className="text-xs text-dark-slate/60">Quốc gia tham dự</span>
            </div>
            <div className="p-5 bg-light-alabaster/80 rounded-xl border border-slate-300/40 shadow-sm backdrop-blur-sm">
              <span className="block text-2xl font-bold text-primary">50+</span>
              <span className="text-xs text-dark-slate/60">Câu lạc bộ trong nước</span>
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

      {/* Event Timeline */}
      <section className="bg-light-cream/30 py-20 border-y border-slate-200/40 relative z-10">
        <Timeline />
      </section>

      {/* Awards Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Cơ Cấu Giải Thưởng
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-dark-obsidian mt-2">
            Vinh Danh Tài Năng Nghệ Thuật
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
              <h3 className="font-heading font-bold text-2xl text-dark-obsidian mt-1">Cờ lưu niệm & Chứng nhận</h3>
              <p className="text-xs text-dark-slate/85 mt-2">Vinh danh các tiết mục xuất sắc có kỹ thuật đồng đều và ý tưởng đột phá.</p>
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
              <span className="text-xs text-secondary uppercase tracking-widest font-semibold">01 Giải Nhất Vô Địch</span>
              <h3 className="font-heading font-bold text-3xl text-dark-obsidian mt-1">Cúp Vàng & Cờ lưu niệm</h3>
              <p className="text-xs text-dark-slate/95 mt-2">Tiết mục đỉnh cao kết hợp trọn vẹn yếu tố dân gian bản địa và hơi thở sân khấu đương đại.</p>
            </div>
          </div>

          {/* Third Prize */}
          <div className="bg-light-alabaster border border-slate-300/60 shadow-sm p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 hover:border-slate-400/60 transition-all">
            <div className="w-16 h-16 rounded-full bg-light-cream flex items-center justify-center text-dark-slate">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-dark-slate/60 uppercase tracking-widest font-semibold">03 Giải Ba</span>
              <h3 className="font-heading font-bold text-2xl text-dark-obsidian mt-1">Cờ lưu niệm & Chứng nhận</h3>
              <p className="text-xs text-dark-slate/85 mt-2">Trao cho các đội biểu diễn đầy nhiệt huyết, giàu cảm xúc truyền tải.</p>
            </div>
          </div>
        </div>

        {/* Subsidiary Awards */}
        <div className="glass-panel border border-slate-300/40 rounded-2xl p-6 text-center max-w-2xl mx-auto bg-light-alabaster shadow-sm">
          <p className="text-xs text-dark-slate/90">
            <strong className="text-secondary font-semibold">Giải Phụ Khác:</strong> Đội có trang phục đẹp nhất, Đội được yêu thích nhất (do khán giả bình chọn online), Biên đạo xuất sắc nhất.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

