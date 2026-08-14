'use client';

import React, { useCallback, useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Play, Heart, Award, Calendar, ChevronLeft, ShieldCheck, LogIn, CheckCircle2, Music, Video, Sparkles, Layers } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getBrowserSiteUrl } from '@/lib/auth-redirect';

export interface PerformanceDetail {
  id?: string;
  title: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  duration: string;
  description: string;
  technicalRequirements?: string;
  audioUrl?: string;
  videoUrl?: string;
  audioLink?: string;
  videoLink?: string;
}

interface CandidateDetails {
  id: string;
  teamName: string;
  representative: string;
  phone?: string;
  duration?: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  votesCount: number;
  origin: string;
  culturalBackground: string;
  technicalRequirements: string;
  photoUrl: string;
  videoUrl: string;
  audioUrl: string;
  performances?: PerformanceDetail[];
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

  // View mode: 'all' | 0 | 1 | 2 (Phần thi 1/2/3)
  const [selectedView, setSelectedView] = useState<'all' | number>(0);

  // Auth User state
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const loadTeamDetails = useCallback(async () => {
    if (!unwrappedParams) return;
    try {
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
  }, [unwrappedParams]);

  useEffect(() => {
    const checkVoterSession = (session: Session | null) => {
      if (session?.user && session.user.user_metadata?.role !== 'judge') {
        setUser(session.user);
      } else {
        setUser(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      checkVoterSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      checkVoterSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadTeamDetails();
  }, [loadTeamDetails, user]);

  const handleGoogleLogin = async () => {
    const siteUrl = getBrowserSiteUrl();
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
    if (isVoting || !candidate) return;
    setIsVoting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.user_metadata?.role === 'judge') {
        alert('Tài khoản Giám khảo không được thực hiện bình chọn khán giả. Vui lòng đăng nhập tài khoản Google.');
        setIsVoting(false);
        return;
      }

      if (!session || !session.user) {
        handleGoogleLogin();
        setIsVoting(false);
        return;
      }

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
        text: `Bình chọn cho đội ${candidate?.teamName} tại Festival Dân Ca Dân Vũ Quốc Tế 2026!`,
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

  // Ensure 3 performances are available
  const perfs: PerformanceDetail[] =
    candidate.performances && candidate.performances.length > 0
      ? candidate.performances
      : [
          {
            id: 'p1',
            title: candidate.performanceTitle,
            category: candidate.category,
            duration: candidate.duration || '',
            description: candidate.culturalBackground || '',
            technicalRequirements: candidate.technicalRequirements || '',
            audioUrl: candidate.audioUrl || '',
            videoUrl: candidate.videoUrl || '',
          },
        ];

  // Active performance when a single performance is chosen
  const activePerf: PerformanceDetail =
    typeof selectedView === 'number' && perfs[selectedView]
      ? perfs[selectedView]
      : perfs[0];

  const currentVideoUrl =
    typeof selectedView === 'number'
      ? activePerf.videoUrl || candidate.videoUrl
      : perfs[0]?.videoUrl || candidate.videoUrl;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative overflow-x-clip w-full">
      <Navbar />

      {/* Background watermark */}
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/vote"
            className="inline-flex items-center gap-1.5 text-xs text-dark-slate/60 hover:text-primary transition-colors uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bình chọn
          </Link>

          {/* Quick Performance View Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedView('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedView === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Xem toàn bộ ({perfs.length} phần thi)
            </button>
            {perfs.map((p, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => setSelectedView(pIdx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedView === pIdx
                    ? 'bg-secondary text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-secondary hover:bg-slate-50'
                }`}
              >
                Phần thi {pIdx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video & Performance Details */}
          <div className="lg:col-span-8 space-y-6">
            {selectedView !== 'all' ? (
              <>
                {/* Single Performance Video Player */}
                <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-slate-300/40 shadow-sm flex items-center justify-center bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                  {currentVideoUrl && (currentVideoUrl.startsWith('http://') || currentVideoUrl.startsWith('https://')) ? (
                    <iframe
                      className="w-full h-full border-0 absolute inset-0 z-0"
                      src={getVideoEmbedUrl(currentVideoUrl)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="z-10 text-center space-y-4">
                      <button className="w-20 h-20 rounded-full bg-secondary text-[#111827] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_25px_rgba(244,180,0,0.4)]">
                        <Play className="w-8 h-8 fill-[#111827] ml-1" />
                      </button>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">
                        Chưa tải lên video dự thi cho Phần thi {(selectedView as number) + 1}
                      </p>
                    </div>
                  )}
                </div>

                {/* Single Performance Info */}
                <div className="glass-panel rounded-2xl border border-slate-300/60 bg-light-alabaster/90 p-6 sm:p-8 space-y-6 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest font-bold text-primary">
                        Phần thi số {(selectedView as number) + 1} / {perfs.length}
                      </span>
                      <span className="text-xs font-bold text-secondary bg-secondary/15 px-3 py-1 rounded-full">
                        {activePerf.category === 'dan_ca'
                          ? 'Dân Ca'
                          : activePerf.category === 'dan_vu'
                          ? 'Dân Vũ'
                          : 'Dân Ca & Dân Vũ'} ({activePerf.duration})
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-2xl sm:text-3xl text-dark-obsidian mt-2">
                      {activePerf.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-dark-slate/60 mt-3 border-y border-slate-100 py-3">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-accent" /> {candidate.teamName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-accent" /> {candidate.origin}
                      </span>
                      {activePerf.audioLink || activePerf.audioUrl ? (
                        <a
                          href={activePerf.audioLink || activePerf.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-accent hover:underline font-semibold"
                        >
                          <Music className="w-4 h-4" /> Nghe nhạc Beat
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-dark-slate/90 leading-relaxed">
                    <div>
                      <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">
                        Ý tưởng & Câu chuyện Văn hóa
                      </h4>
                      <p>{activePerf.description || 'Chưa cung cấp thông tin mô tả chi tiết ý tưởng của tiết mục.'}</p>
                    </div>

                    {activePerf.technicalRequirements && (
                      <div>
                        <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">
                          Yêu cầu kỹ thuật sân khấu (Rider)
                        </h4>
                        <p className="text-xs italic">{activePerf.technicalRequirements}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-dark-obsidian mb-1 text-xs uppercase tracking-wider">
                        Trưởng đoàn / Đại diện
                      </h4>
                      <p className="text-xs">{candidate.representative} ({candidate.phone})</p>
                    </div>
                  </div>

                  {/* Switch to next performance */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {(selectedView as number) > 0 ? (
                      <button
                        type="button"
                        onClick={() => setSelectedView((selectedView as number) - 1)}
                        className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                      >
                        ← Xem Phần thi {(selectedView as number)}
                      </button>
                    ) : <div />}

                    {(selectedView as number) < perfs.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setSelectedView((selectedView as number) + 1)}
                        className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                      >
                        Xem Phần thi {(selectedView as number) + 2} →
                      </button>
                    ) : <div />}
                  </div>
                </div>
              </>
            ) : (
              /* All 3 Performances View */
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="font-heading font-bold text-xl text-primary flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    <span>Toàn bộ 3 Phần thi của {candidate.teamName}</span>
                  </h3>
                  <p className="text-xs text-dark-slate/70 mt-1">
                    Khán giả có thể xem toàn bộ các video dự thi và bình chọn chung cho toàn đội.
                  </p>
                </div>

                <div className="space-y-6">
                  {perfs.map((perf, pIdx) => (
                    <div
                      key={pIdx}
                      className="glass-panel rounded-2xl border border-slate-300/60 bg-light-alabaster/90 p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                            Phần thi số {pIdx + 1} / {perfs.length}
                          </span>
                          <h3 className="font-heading font-bold text-xl text-dark-obsidian mt-0.5">
                            {perf.title}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/15 text-secondary self-start">
                          {perf.category === 'dan_ca'
                            ? 'Dân Ca'
                            : perf.category === 'dan_vu'
                            ? 'Dân Vũ'
                            : 'Dân Ca & Dân Vũ'} ({perf.duration})
                        </span>
                      </div>

                      {/* Video Player */}
                      {perf.videoUrl && (perf.videoUrl.startsWith('http://') || perf.videoUrl.startsWith('https://')) ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xs">
                          <iframe
                            className="w-full h-full border-0"
                            src={getVideoEmbedUrl(perf.videoUrl)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="bg-slate-100 rounded-xl p-8 text-center text-xs text-slate-500 font-medium">
                          Chưa tải lên video cho phần thi này
                        </div>
                      )}

                      <p className="text-xs text-dark-slate/90 leading-relaxed italic">
                        &ldquo;{perf.description}&rdquo;
                      </p>

                      {perf.technicalRequirements && (
                        <div className="text-xs text-slate-500">
                          <strong className="text-slate-700">Yêu cầu sân khấu:</strong> {perf.technicalRequirements}
                        </div>
                      )}

                      {(perf.audioLink || perf.audioUrl) && (
                        <div className="pt-2 border-t border-slate-100">
                          <a
                            href={perf.audioLink || perf.audioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline"
                          >
                            <Music className="w-3.5 h-3.5" />
                            <span>Link nhạc Beat phần thi {pIdx + 1}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Voting Card & Security */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl border border-slate-300/60 bg-light-alabaster/90 p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
              <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Cổng Bình Chọn
                </span>
                <p className="text-xs text-dark-slate/60">Mã số hồ sơ: {candidate.id.substring(0, 8).toUpperCase()}</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
                  <span className="font-heading font-extrabold text-3xl text-dark-obsidian">
                    {candidate.votesCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-dark-slate/60 uppercase font-bold tracking-wider">Lượt vote</span>
                </div>
              </div>

              {/* Vote action */}
              <div className="space-y-4">
                {user ? (
                  <div className="text-center space-y-3">
                    <p className="text-xs text-dark-slate/60">
                      Bạn đang đăng nhập bằng Google:<br />
                      <strong className="text-dark-obsidian">{user.email}</strong>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-[10px] text-primary hover:underline uppercase font-bold tracking-wider"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : null}

                {votedSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-accent/10 border border-accent/30 rounded-xl text-center space-y-2"
                  >
                    <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
                    <p className="font-bold text-accent text-sm">Bình chọn thành công!</p>
                    <p className="text-[11px] text-dark-slate/70">
                      Cảm ơn bạn đã bình chọn cho đội <strong>{candidate.teamName}</strong>.
                    </p>
                  </motion.div>
                ) : hasVotedToday ? (
                  <div className="p-4 bg-slate-100 rounded-xl text-center space-y-1">
                    <p className="text-xs font-bold text-dark-slate/80">Bạn đã bình chọn hôm nay</p>
                    <p className="text-[10px] text-dark-slate/60">
                      Mỗi tài khoản được bình chọn 1 lần/ngày. Hãy quay lại vào ngày mai nhé!
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleVoteSubmit}
                    disabled={isVoting}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-opacity-95 transition-all glow-crimson-hover disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVoting ? (
                      <span>Đang ghi nhận bình chọn...</span>
                    ) : user ? (
                      <>
                        <Heart className="w-4 h-4 fill-white" />
                        <span>Bình chọn ngay</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Đăng nhập Google để Bình chọn</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Share links */}
              <div className="pt-6 border-t border-slate-100 text-center space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-dark-slate/60">Chia sẻ đội thi</span>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleShareFacebook}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={handleShareMessenger}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Sao chép link
                  </button>
                  <button
                    onClick={handleShareZalo}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Zalo
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-fraud banner */}
            <div className="glass-panel rounded-2xl border border-slate-300/40 bg-light-alabaster/60 p-6 space-y-3 text-xs text-dark-slate/70 shadow-sm">
              <div className="flex items-center gap-2 text-secondary font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Hệ Thống Bảo Mật</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Platform sử dụng công nghệ định danh vân tay thiết bị (Device Canvas Fingerprinting), giám sát địa chỉ IP
                thời gian thực kết hợp kiểm định Google reCAPTCHA v3 chống spam. Mọi lượt bình chọn gian lận đều được ghi nhận
                tự động và xử lý lọc bỏ định kỳ 12h/lần bởi BTC.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
