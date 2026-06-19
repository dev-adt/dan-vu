'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Play, Heart, Award, Calendar, ChevronLeft, ShieldCheck, Mail, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

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
  photoUrl: string;
  videoUrl: string;
  audioUrl: string;
}

function getVideoEmbedUrl(url: string): string {
  if (!url) return '';

  // Google Drive
  if (url.includes('drive.google.com')) {
    if (url.includes('drive.google.com/file/d/')) {
      const parts = url.split('drive.google.com/file/d/');
      if (parts.length > 1) {
        const fileId = parts[1].split('/')[0].split('?')[0].split('&')[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    if (url.includes('drive.google.com/open?id=')) {
      const parts = url.split('drive.google.com/open?id=');
      if (parts.length > 1) {
        const fileId = parts[1].split('&')[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
  }

  // YouTube
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

export default function CandidateDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVotedToday, setHasVotedToday] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votedSuccess, setVotedSuccess] = useState(false);

  // Auth User state
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } }: any = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Reload team details whenever page params or user state changes (to evaluate hasVotedToday correctly)
  useEffect(() => {
    loadTeamDetails();
  }, [unwrappedParams.id, user]);

  const loadTeamDetails = async () => {
    if (!unwrappedParams) return;
    setIsLoading(true);
    try {
      // Pass authorization header if user is logged in to fetch hasVotedToday dynamically
      const headers: HeadersInit = {};
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/teams/detail?id=${unwrappedParams.id}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCandidate(data.team);
        setHasVotedToday(data.hasVotedToday);
      } else {
        setCandidate(null);
      }
    } catch (err) {
      console.error('Failed to load team details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Use NEXT_PUBLIC_SITE_URL on VPS (behind reverse proxy, window.location.origin may return localhost)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/api/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
      },
    });
    if (error) console.error('OAuth error:', error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleVoteSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      handleGoogleLogin();
      return;
    }

    if (!candidate) return;

    setIsVoting(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          teamId: candidate.id,
          fingerprint: 'canvas_hash_mock_fingerprint',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Bình chọn thất bại.');
        setIsVoting(false);
        return;
      }

      setVotedSuccess(true);
      setHasVotedToday(true);
      setTimeout(() => {
        setVotedSuccess(false);
      }, 4000);

      // Reload to update count
      loadTeamDetails();
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareZalo = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://sp.zalo.me/share_to_zalo?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareMessenger = () => {
    if (navigator.share) {
      navigator.share({
        title: candidate?.performanceTitle || 'Nhịp Bước Việt Nam 2026',
        text: `Bình chọn cho tiết mục "${candidate?.performanceTitle}" của đội ${candidate?.teamName} tại Festival 2026!`,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết chia sẻ vào khay nhớ tạm!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative justify-center items-center">
        <p className="text-sm text-dark-slate/60 animate-pulse">Đang tải thông tin tiết mục...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative justify-center items-center gap-4">
        <p className="text-sm text-dark-slate/60">Không tìm thấy tiết mục hoặc chưa được BTC phê duyệt.</p>
        <Link href="/vote" className="px-4 py-2 bg-accent text-white font-bold text-xs uppercase rounded-xl">
          Quay lại cổng bình chọn
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative overflow-x-clip w-full">
      <Navbar />

      {/* Background watermark wrapper to prevent layout shift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
            <path
              d="M200,170 L205,190 L225,185 L210,197 L227,210 L206,204 L200,225 L194,204 L173,210 L190,197 L175,185 L195,190 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </motion.svg>
        </div>
      </div>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        {/* Back Link Button */}
        <div className="mb-6">
          <Link
            href="/vote"
            className="inline-flex items-center gap-1.5 text-xs text-dark-slate/60 hover:text-primary transition-colors uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bình chọn
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Video Player */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-300/40 shadow-sm flex items-center justify-center bg-black">
              {/* Overlay graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              {candidate.videoUrl && (candidate.videoUrl.startsWith('http://') || candidate.videoUrl.startsWith('https://')) ? (
                <iframe
                  className="w-full h-full border-0 absolute inset-0 z-0"
                  src={getVideoEmbedUrl(candidate.videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="z-10 text-center space-y-4">
                  <button className="w-20 h-20 rounded-full bg-secondary text-[#111827] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_25px_rgba(244,180,0,0.4)]">
                    <Play className="w-8 h-8 fill-[#111827] ml-1" />
                  </button>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Chưa tải lên video dự thi chính thức</p>
                </div>
              )}
            </div>

            {/* Performance Descriptions */}
            <div className="glass-panel rounded-2xl border border-slate-300/60 bg-light-alabaster/90 p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-primary">Giới thiệu Tiết mục</span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-dark-obsidian mt-2">
                  {candidate.performanceTitle}
                </h2>
                <div className="flex items-center gap-4 text-xs text-dark-slate/60 mt-3 border-y border-slate-100 py-3">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> {candidate.teamName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> {candidate.origin}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-dark-slate/90 leading-relaxed">
                <div>
                  <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">Ý tưởng & Câu chuyện Văn hóa</h4>
                  <p>{candidate.culturalBackground || 'Chưa cung cấp thông tin mô tả chi tiết ý tưởng của tiết mục.'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">Trưởng đoàn / Đại diện</h4>
                  <p className="text-xs">{candidate.representative}</p>
                </div>
                <div>
                  <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">Yêu cầu kỹ thuật sân khấu (Rider)</h4>
                  <p className="text-xs italic">{candidate.technicalRequirements || 'Chưa có yêu cầu kỹ thuật sân khấu đặc biệt.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vote Panel & Social Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel bg-light-alabaster/90 rounded-2xl border-2 border-secondary/30 p-6 space-y-6 shadow-sm">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-[#111827] bg-secondary px-3 py-1 rounded-full uppercase tracking-wider">
                  Cổng Bình Chọn
                </span>
                <p className="text-xs text-dark-slate/60 mt-2">Mã số tiết mục: {candidate.id.substring(0, 8).toUpperCase()}</p>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Heart className="w-6 h-6 text-primary fill-primary/10 animate-pulse" />
                  <span className="text-3xl font-extrabold text-dark-obsidian">{candidate.votesCount.toLocaleString()}</span>
                  <span className="text-xs text-dark-slate/60">lượt vote</span>
                </div>
              </div>

              {/* User panel */}
              <div className="border-t border-b border-slate-200/60 py-4 text-center">
                {user ? (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-dark-slate/60">Bạn đang đăng nhập bằng Google:</p>
                    <span className="text-xs font-bold font-mono text-dark-obsidian">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="text-[10px] uppercase font-bold text-slate-400 hover:text-primary mt-1 underline cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-dark-slate/60">Bạn chưa đăng nhập. Đăng nhập Google để bình chọn:</p>
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer text-slate-700"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Đăng nhập Google
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                {hasVotedToday ? (
                  <div className="w-full text-center py-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-semibold">
                    ✓ Bạn đã bình chọn cho tiết mục này hôm nay
                  </div>
                ) : (
                  <button
                    onClick={handleVoteSubmit}
                    disabled={isVoting}
                    className="w-full bg-accent text-white hover:bg-opacity-90 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all glow-gold-hover cursor-pointer"
                  >
                    {isVoting ? 'ĐANG GỬI...' : 'BÌNH CHỌN NGAY'}
                  </button>
                )}
              </div>

              <div className="border-t border-slate-200/60 pt-4 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-dark-slate/60 text-center">
                  Chia sẻ tiết mục
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleShareFacebook}
                    className="py-2 text-xs font-semibold rounded-lg bg-light-cream hover:bg-light-cream/80 border border-slate-300/40 transition-colors text-dark-slate cursor-pointer"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={handleShareMessenger}
                    className="py-2 text-xs font-semibold rounded-lg bg-light-cream hover:bg-light-cream/80 border border-slate-300/40 transition-colors text-dark-slate cursor-pointer"
                  >
                    Messenger
                  </button>
                  <button
                    onClick={handleShareZalo}
                    className="py-2 text-xs font-semibold rounded-lg bg-light-cream hover:bg-light-cream/80 border border-slate-300/40 transition-colors text-dark-slate cursor-pointer"
                  >
                    Zalo
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-fraud advisory */}
            <div className="glass-panel rounded-2xl border border-slate-300/60 bg-light-alabaster/90 p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Hệ thống bảo mật</span>
              </div>
              <p className="text-[11px] text-dark-slate/85 leading-relaxed">
                Platform sử dụng công nghệ định danh vân tay thiết bị (Device Canvas Fingerprinting), giám sát địa chỉ IP thời gian thực, kết hợp kiểm định Google reCAPTCHA v3 chống spam. Mọi lượt bình chọn gian lận đều được ghi nhận tự động và xử lý lọc bỏ định kỳ 12h/lần bởi BTC.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {votedSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Bình Chọn Thành Công!</h3>
              <p className="text-xs text-slate-600">Lượt bình chọn của bạn đã được ghi nhận vào hệ thống. Mỗi thiết bị và tài khoản được phép vote 1 lần/ngày cho mỗi đội.</p>
              <button
                onClick={() => setVotedSuccess(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
