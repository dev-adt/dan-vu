'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Play, Heart, Share2, Award, Calendar, ChevronLeft, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface CandidateDetails {
  id: string;
  teamName: string;
  representative: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  votesCount: number;
  origin: string;
  culturalBackground: string;
  technicalRequirements: string;
}

const mockDb: Record<string, CandidateDetails> = {
  'dc-001': {
    id: 'dc-001',
    teamName: 'Đoàn Nghệ Thuật CLB Sen Vàng',
    representative: 'Nguyễn Thị Tuyết',
    performanceTitle: 'Liên khúc Dân ca Ba miền',
    category: 'dan_ca',
    votesCount: 3410,
    origin: 'Hà Nội, Việt Nam',
    culturalBackground: 'Tiết mục hòa quyện điệu chèo cổ Quan họ Bắc Ninh, lý kéo chài Nam Bộ và hò Huế miền Trung, kể về hành trình khai phá đất nước đầy tự hào của người Việt cổ qua các thế hệ dòng chảy.',
    technicalRequirements: 'Cần 5 micro không dây cầm tay, 2 bục đứng gỗ sơn mài đỏ, ánh sáng vàng ấm rải đều sân khấu.',
  },
  'dv-002': {
    id: 'dv-002',
    teamName: 'CLB Dân Vũ Hòa Bình',
    representative: 'Bùi Văn Hùng',
    performanceTitle: 'Vũ điệu Gặt Lúa Tây Bắc',
    category: 'dan_vu',
    votesCount: 2894,
    origin: 'Hòa Bình, Việt Nam',
    culturalBackground: 'Tái hiện sinh động không khí ngày hội thu hoạch trên các ruộng bậc thang Tây Bắc. Điệu múa mang tính cộng đồng cao, kết hợp nhạc cụ khèn Mông và trống gỗ truyền thống.',
    technicalRequirements: 'Đạo cụ đặc thù gồm gùi tre, bó lúa mô phỏng. Cần khói lạnh sân khấu ở phần mở đầu.',
  },
  'dc-003': {
    id: 'dc-003',
    teamName: 'CLB Dân Ca Sông Trà',
    representative: 'Lê Hoàng Nam',
    performanceTitle: 'Điệu Lý Giao Duyên Xứ Quảng',
    category: 'dan_ca',
    votesCount: 1540,
    origin: 'Quảng Ngãi, Việt Nam',
    culturalBackground: 'Lấy cảm hứng từ điệu hò lý vùng sông nước duyên hải Trung Bộ, ca ngợi tình yêu lứa đôi, nét duyên dáng của người con gái Việt Nam và cuộc sống chài lưới mộc mạc.',
    technicalRequirements: 'Micro nhạc cụ cho sáo trúc và đàn tranh, 2 micro cài tai cho ca sĩ chính.',
  },
  'dv-004': {
    id: 'dv-004',
    teamName: 'Nhóm Múa Chăm Hữu Nghị',
    representative: 'Đoàn Thị Trà My',
    performanceTitle: 'Vũ điệu Tháp Cổ Chămpa',
    category: 'dan_vu',
    votesCount: 4230,
    origin: 'Ninh Thuận, Việt Nam',
    culturalBackground: 'Lồng ghép các động tác múa Apsara cổ kính trước đền tháp Chàm linh thiêng. Tiết mục tôn vinh nét đẹp kiến trúc tâm linh và văn hóa dân gian Chăm đặc trưng truyền thống.',
    technicalRequirements: 'Hệ thống ánh sáng đổi màu liên tục (đỏ, vàng, xanh ngọc). Yêu cầu khói nặng làm mờ chân múa.',
  },
};

export default function CandidateDetail({ params }: { params: Promise<{ id: string }> }) {
  // Handle Next.js 15 dynamic params unwrapping
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [localVotes, setLocalVotes] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVotedToday, setHasVotedToday] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setUnwrappedParams(p);
      const data = mockDb[p.id];
      if (data) {
        setCandidate(data);
        setLocalVotes(data.votesCount);
      }
    });
  }, [params]);

  if (!candidate) {
    return (
      <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative justify-center items-center">
        <p className="text-sm text-light-alabaster/60 animate-pulse">Đang tải thông tin tiết mục...</p>
      </div>
    );
  }

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsVerifying(true);
    // Simulate reCAPTCHA and verify OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setShowAuthModal(false);
    setLocalVotes((prev) => prev + 1);
    setHasVotedToday(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Back Link Button */}
        <div className="mb-6">
          <Link
            href="/vote"
            className="inline-flex items-center gap-1.5 text-xs text-light-alabaster/60 hover:text-secondary transition-colors uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bình chọn
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Video Player */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center bg-black">
              {/* Overlay graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="z-10 text-center space-y-4">
                <button className="w-20 h-20 rounded-full bg-secondary text-dark-obsidian flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_25px_rgba(244,180,0,0.5)]">
                  <Play className="w-8 h-8 fill-dark-obsidian ml-1" />
                </button>
                <p className="text-xs font-semibold uppercase tracking-wider text-light-cream">Trình Phát Video Dự Thi Sơ Loại</p>
              </div>
            </div>

            {/* Performance Descriptions */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-secondary">Giới thiệu Tiết mục</span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-light-cream mt-2">
                  {candidate.performanceTitle}
                </h2>
                <div className="flex items-center gap-4 text-xs text-light-alabaster/40 mt-3 border-y border-white/5 py-3">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> {candidate.teamName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> {candidate.origin}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-light-alabaster/70 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-light-cream mb-1 text-xs uppercase tracking-wider">Ý tưởng & Câu chuyện Văn hóa</h4>
                  <p>{candidate.culturalBackground}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-light-cream mb-1 text-xs uppercase tracking-wider">Trưởng đoàn / Đại diện</h4>
                  <p className="text-xs">{candidate.representative}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-light-cream mb-1 text-xs uppercase tracking-wider">Yêu cầu kỹ thuật sân khấu (Rider)</h4>
                  <p className="text-xs italic">{candidate.technicalRequirements}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vote Panel & Social Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl border-2 border-secondary/20 p-6 space-y-6 shadow-xl">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-dark-obsidian bg-secondary px-3 py-1 rounded-full uppercase tracking-wider">
                  Cổng Bình Chọn
                </span>
                <p className="text-xs text-light-alabaster/40 mt-2">Mã số tiết mục: {candidate.id.toUpperCase()}</p>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Heart className="w-6 h-6 text-primary fill-primary/30" />
                  <span className="text-3xl font-extrabold text-light-cream">{localVotes.toLocaleString()}</span>
                  <span className="text-xs text-light-alabaster/40">lượt vote</span>
                </div>
              </div>

              <div className="pt-4">
                {hasVotedToday ? (
                  <div className="w-full text-center py-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-semibold">
                    ✓ Bạn đã bình chọn cho tiết mục này hôm nay
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-accent text-white hover:bg-opacity-90 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all glow-gold-hover"
                  >
                    BÌNH CHỌN NGAY
                  </button>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-light-alabaster/40 text-center">
                  Chia sẻ tiết mục
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-light-cream">
                    Facebook
                  </button>
                  <button className="py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-light-cream">
                    Messenger
                  </button>
                  <button className="py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-light-cream">
                    Zalo
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-fraud advisory */}
            <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Hệ thống bảo mật</span>
              </div>
              <p className="text-[11px] text-light-alabaster/50 leading-relaxed">
                Platform sử dụng công nghệ định danh vân tay thiết bị (Device Canvas Fingerprinting), giám sát địa chỉ IP thời gian thực, kết hợp kiểm định Google reCAPTCHA v3 chống spam. Mọi lượt bình chọn gian lận đều được ghi nhận tự động và xử lý lọc bỏ định kỳ 12h/lần bởi BTC.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="glass-panel border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-10 h-10 text-secondary mx-auto" />
              <h3 className="font-heading font-bold text-xl text-light-cream">Xác thực Tài khoản Bình chọn</h3>
              <p className="text-xs text-light-alabaster/60">Để chống tình trạng bình chọn tự động (bot/spam), vui lòng nhập email liên kết.</p>
            </div>

            <form onSubmit={handleVoteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-light-alabaster/40">Địa chỉ Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-light-alabaster/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-dark-obsidian border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-1/2 py-2.5 border border-white/10 rounded-xl text-xs font-semibold text-light-cream hover:bg-white/5 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-1/2 py-2.5 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isVerifying ? 'Đang xác thực...' : 'Xác nhận Vote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
