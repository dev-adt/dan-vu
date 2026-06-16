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
      <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative justify-center items-center">
        <p className="text-sm text-slate-600 animate-pulse">Đang tải thông tin tiết mục...</p>
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
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Back Link Button */}
        <div className="mb-6">
          <Link
            href="/vote"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bình chọn
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Video Player */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-200 shadow-sm flex items-center justify-center bg-black">
              {/* Overlay graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="z-10 text-center space-y-4">
                <button className="w-20 h-20 rounded-full bg-secondary text-dark-obsidian flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_25px_rgba(244,180,0,0.4)]">
                  <Play className="w-8 h-8 fill-dark-obsidian ml-1" />
                </button>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Trình Phát Video Dự Thi Sơ Loại</p>
              </div>
            </div>

            {/* Performance Descriptions */}
            <div className="glass-panel rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-primary">Giới thiệu Tiết mục</span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
                  {candidate.performanceTitle}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 border-y border-slate-100 py-3">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> {candidate.teamName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> {candidate.origin}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Ý tưởng & Câu chuyện Văn hóa</h4>
                  <p>{candidate.culturalBackground}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Trưởng đoàn / Đại diện</h4>
                  <p className="text-xs">{candidate.representative}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Yêu cầu kỹ thuật sân khấu (Rider)</h4>
                  <p className="text-xs italic">{candidate.technicalRequirements}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vote Panel & Social Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel bg-white rounded-2xl border-2 border-secondary/30 p-6 space-y-6 shadow-sm">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-dark-obsidian bg-secondary px-3 py-1 rounded-full uppercase tracking-wider">
                  Cổng Bình Chọn
                </span>
                <p className="text-xs text-slate-500 mt-2">Mã số tiết mục: {candidate.id.toUpperCase()}</p>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Heart className="w-6 h-6 text-primary fill-primary/10 animate-pulse" />
                  <span className="text-3xl font-extrabold text-slate-900">{localVotes.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">lượt vote</span>
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

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                  Chia sẻ tiết mục
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700">
                    Facebook
                  </button>
                  <button className="py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700">
                    Messenger
                  </button>
                  <button className="py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700">
                    Zalo
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-fraud advisory */}
            <div className="glass-panel rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Hệ thống bảo mật</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Platform sử dụng công nghệ định danh vân tay thiết bị (Device Canvas Fingerprinting), giám sát địa chỉ IP thời gian thực, kết hợp kiểm định Google reCAPTCHA v3 chống spam. Mọi lượt bình chọn gian lận đều được ghi nhận tự động và xử lý lọc bỏ định kỳ 12h/lần bởi BTC.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Auth Modal (Gmail Login Mocked) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-10 h-10 text-primary mx-auto" />
              <h3 className="font-heading font-bold text-xl text-slate-900">Xác thực Google Gmail</h3>
              <p className="text-xs text-slate-500">Mỗi tài khoản Gmail chỉ được bình chọn 01 lần/ngày cho mỗi tiết mục.</p>
            </div>

            {!emailInput ? (
              /* Google OAuth Trigger Button */
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifying(true);
                    setTimeout(() => {
                      setIsVerifying(false);
                      setEmailInput('user.gmail@gmail.com');
                    }, 1200);
                  }}
                  disabled={isVerifying}
                  className="w-full py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
                >
                  {isVerifying ? (
                    <span className="animate-pulse">Đang kết nối tới Google Accounts...</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.286 4.114-3.52 0-6.376-2.857-6.376-6.377s2.857-6.377 6.376-6.377c1.782 0 3.32.73 4.46 1.91l3.185-3.185C19.348 2.115 16.03.738 12.24.738 5.912.738.738 5.912.738 12.24s5.174 11.502 11.502 11.502c6.262 0 11.378-5.076 11.378-11.502 0-.785-.09-1.542-.26-2.255H12.24z"/>
                      </svg>
                      <span>ĐĂNG NHẬP BẰNG GMAIL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-2 rounded-xl border border-slate-100 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            ) : (
              /* Success confirmation */
              <form onSubmit={handleVoteSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">
                    G
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Đã xác thực Gmail:</span>
                    <span className="text-xs font-semibold text-slate-800">{emailInput}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('');
                    }}
                    className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-1/2 py-2.5 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-90 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    {isVerifying ? 'Đang gửi...' : 'Gửi Bình Chọn'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
