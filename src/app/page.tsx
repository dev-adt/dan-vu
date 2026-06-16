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
    <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative selection:bg-accent selection:text-white">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black/40">
        {/* Immersive background gradient & abstract decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-obsidian via-transparent to-black/50 z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
        <div className="bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
        
        {/* Subtle geometric pattern placeholder */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F4B400_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Video placeholder display */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-dark-slate/90 to-dark-obsidian flex items-center justify-center">
            <div className="text-center px-4">
              <span className="inline-block p-4 rounded-full bg-white/5 border border-white/10 text-secondary mb-4 animate-bounce">
                <Music className="w-8 h-8" />
              </span>
              <p className="text-xs tracking-[0.3em] uppercase text-light-cream/40">Cinematic Trailer Background Playing</p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/10 text-secondary text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 fill-secondary" /> Festival Dân Ca Dân Vũ Quốc Tế 2026
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl text-light-cream leading-tight tracking-wide">
              NHỊP BƯỚC VIỆT NAM
            </h1>
            <p className="text-lg sm:text-xl text-light-alabaster/80 italic font-medium tracking-wide max-w-2xl mx-auto">
              &ldquo;Nơi tôn vinh bản sắc bản địa và nhịp điệu hiện đại.&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-opacity-95 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(198,40,40,0.3)] transition-all glow-crimson-hover"
            >
              Đăng Ký Dự Thi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-opacity-95 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(0,105,92,0.3)] transition-all glow-gold-hover"
            >
              Bình Chọn Tiết Mục
            </Link>
            <a
              href="#"
              className="text-xs font-semibold text-light-alabaster/60 hover:text-secondary underline underline-offset-4 mt-2 sm:mt-0"
            >
              Tải Thể Lệ Chi Tiết (PDF)
            </a>
          </motion.div>
        </div>
      </section>

      {/* Cultural Narrative Introduction */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-light-cream leading-tight">
            Giao thoa giữa di sản ngàn năm & vũ điệu đương đại
          </h2>
          <p className="text-light-alabaster/70 leading-relaxed text-sm">
            Festival Dân ca Dân vũ Quốc tế &ldquo;Nhịp Bước Việt Nam 2026&rdquo; không chỉ đơn thuần là sân chơi tài năng nghệ thuật, mà còn là hành trình lưu giữ ngọn lửa di sản. Chúng tôi kiến tạo không gian văn hóa nơi các giai điệu cổ xưa kết duyên cùng các vũ điệu hiện đại tinh tế, tạo nên bức tranh đa sắc tộc rực rỡ sắc màu quốc gia.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-2xl font-bold text-secondary">10+</span>
              <span className="text-xs text-light-alabaster/50">Quốc gia tham dự</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-2xl font-bold text-secondary">50+</span>
              <span className="text-xs text-light-alabaster/50">Câu lạc bộ trong nước</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10 group shadow-2xl flex items-center justify-center bg-dark-slate"
        >
          {/* Mock cultural image backdrop representing traditional dancing */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 mix-blend-overlay" />
          <div className="z-10 text-center space-y-4">
            <button className="w-16 h-16 rounded-full bg-secondary text-dark-obsidian flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,180,0,0.4)]">
              <Play className="w-6 h-6 fill-dark-obsidian ml-1" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-wider text-light-cream">Xem Video Giới Thiệu Sự Kiện</p>
          </div>
        </motion.div>
      </section>

      {/* Event Timeline */}
      <section className="bg-dark-slate/20 py-20 border-y border-white/5">
        <Timeline />
      </section>

      {/* Awards Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Cơ Cấu Giải Thưởng
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-light-cream mt-2">
            Vinh Danh Tài Năng Nghệ Thuật
          </h2>
          <div className="w-12 h-0.5 bg-secondary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Second Prize */}
          <div className="bg-dark-slate/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 hover:border-white/10 transition-all">
            <div className="w-16 h-16 rounded-full bg-light-cream/10 flex items-center justify-center text-light-cream">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-light-alabaster/40 uppercase tracking-widest font-semibold">02 Giải Nhì</span>
              <h3 className="font-heading font-bold text-2xl text-light-cream mt-1">Cờ lưu niệm & Chứng nhận</h3>
              <p className="text-xs text-light-alabaster/50 mt-2">Vinh danh các tiết mục xuất sắc có kỹ thuật đồng đều và ý tưởng đột phá.</p>
            </div>
          </div>

          {/* First Prize (Highlighted) */}
          <div className="bg-gradient-to-b from-dark-slate to-dark-obsidian border-2 border-secondary p-10 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 relative shadow-[0_10px_40px_rgba(244,180,0,0.15)] glow-gold-hover md:-translate-y-4">
            <span className="absolute -top-3.5 bg-secondary text-dark-obsidian font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Danh Giá Nhất
            </span>
            <div className="w-20 h-20 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs text-secondary uppercase tracking-widest font-semibold">01 Giải Nhất Vô Địch</span>
              <h3 className="font-heading font-bold text-3xl text-light-cream mt-1">Cúp Vàng & Cờ lưu niệm</h3>
              <p className="text-xs text-light-alabaster/60 mt-2">Tiết mục đỉnh cao kết hợp trọn vẹn yếu tố dân gian bản địa và hơi thở sân khấu đương đại.</p>
            </div>
          </div>

          {/* Third Prize */}
          <div className="bg-dark-slate/40 border border-white/5 p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 hover:border-white/10 transition-all">
            <div className="w-16 h-16 rounded-full bg-light-cream/10 flex items-center justify-center text-light-cream">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-light-alabaster/40 uppercase tracking-widest font-semibold">03 Giải Ba</span>
              <h3 className="font-heading font-bold text-2xl text-light-cream mt-1">Cờ lưu niệm & Chứng nhận</h3>
              <p className="text-xs text-light-alabaster/50 mt-2">Trao cho các đội biểu diễn đầy nhiệt huyết, giàu cảm xúc truyền tải.</p>
            </div>
          </div>
        </div>

        {/* Subsidiary Awards */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <p className="text-xs text-light-alabaster/60">
            <strong className="text-secondary font-semibold">Giải Phụ Khác:</strong> Đội có trang phục đẹp nhất, Đội được yêu thích nhất (do khán giả bình chọn online), Biên đạo xuất sắc nhất.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

