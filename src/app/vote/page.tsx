'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CandidateCard from '@/components/CandidateCard';
import { Search, SlidersHorizontal, CheckCircle2, LogIn, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Candidate {
  id: string;
  teamName: string;
  representativeName: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performanceTitle: string;
  duration: string;
  description: string;
  photoUrl: string;
  votesCount: number;
}

export default function VoteDiscovery() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dan_ca' | 'dan_vu'>('all');
  const [activeSort, setActiveSort] = useState<'votes' | 'newest'>('votes');
  const [votedId, setVotedId] = useState<string | null>(null);

  // Authenticated user state
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
    });

    // Listen to auth state change
    const { data: { subscription } }: any = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    // Fetch approved teams list
    loadApprovedTeams();

    return () => subscription.unsubscribe();
  }, []);

  const loadApprovedTeams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/teams/approved');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.teams);
      }
    } catch (err) {
      console.error('Failed to load approved teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
      },
    });
    if (error) {
      console.error('Error logging in with Google OAuth:', error);
      alert('Không thể kết nối đến máy chủ xác thực.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleVote = async (id: string) => {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      if (confirm('Bạn cần đăng nhập tài khoản Google để thực hiện bình chọn. Bấm OK để đăng nhập ngay.')) {
        handleGoogleLogin();
      }
      return;
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          teamId: id,
          fingerprint: 'canvas_hash_mock_fingerprint', // Mock fingerprint for audit
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Bình chọn thất bại.');
        return;
      }

      setVotedId(id);
      setTimeout(() => {
        setVotedId(null);
      }, 3000);

      // Refresh list to update count
      loadApprovedTeams();
    } catch (err) {
      console.error(err);
      alert('Không thể gửi bình chọn lên máy chủ.');
    }
  };

  const filteredCandidates = candidates
    .filter((c) => {
      const matchSearch =
        c.performanceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' ? true : c.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (activeSort === 'votes') return b.votesCount - a.votesCount;
      return 0; // Default
    });

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-dark-obsidian relative overflow-x-clip w-full">
      <Navbar />

      {/* Background watermark wrapper to prevent layout shift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[15%] -left-48 w-96 sm:w-[500px] h-96 sm:h-[500px] opacity-[0.025] select-none">
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
            <path
              d="M200,170 L205,190 L225,185 L210,197 L227,210 L206,204 L200,225 L194,204 L173,210 L190,197 L175,185 L195,190 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </motion.svg>
        </div>
      </div>

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        {/* Banner header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-slate-200/50 pb-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
              Khán Giả Bình Chọn
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-dark-obsidian mt-2">
              Đại Sứ Yêu Thích Nhất
            </h1>
            <p className="text-xs text-dark-slate/75 mt-2 max-w-xl">
              Mỗi tài khoản Google được bình chọn tối đa 01 lần/ngày cho mỗi tiết mục. Hành vi gian lận (hack vote) sẽ bị hủy kết quả.
            </p>
          </div>

          {/* User Auth Status Panel */}
          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-dark-obsidian">{user.user_metadata?.full_name || 'Khán Giả'}</span>
                    <span className="block text-[10px] text-dark-slate/60 font-mono">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-dark-slate/60">Đăng nhập tài khoản Google để thực hiện bình chọn:</p>
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 bg-accent text-white hover:bg-opacity-95 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập Google
                </button>
              </>
            )}
          </div>
        </div>

        {/* Voting notification toast */}
        <AnimatePresence>
          {votedId && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel border border-accent/40 bg-light-alabaster/95 text-dark-obsidian px-6 py-3.5 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-accent animate-bounce" />
              <div className="text-xs text-left">
                <p className="font-semibold text-accent">Ghi nhận bình chọn thành công!</p>
                <p className="text-[10px] text-dark-slate/70">Cảm ơn bạn đã đóng góp tiếng nói tôn vinh di sản.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter controls panel */}
        <div className="bg-light-alabaster/80 border border-slate-300/40 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
          {/* Search bar input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-dark-slate/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nhập tên đội hoặc mã số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-light-cream border border-slate-300/50 rounded-xl pl-10 pr-4 py-2 text-xs focus:border-secondary focus:outline-none transition-colors text-dark-obsidian placeholder-dark-slate/40"
            />
          </div>

          {/* Filters category & sort options */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <div className="flex bg-light-cream border border-slate-300/50 p-1 rounded-lg">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeCategory === 'all' ? 'bg-accent text-white shadow-sm' : 'text-dark-slate/75 hover:text-dark-obsidian'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveCategory('dan_ca')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeCategory === 'dan_ca' ? 'bg-accent text-white shadow-sm' : 'text-dark-slate/75 hover:text-dark-obsidian'
                }`}
              >
                Dân ca
              </button>
              <button
                onClick={() => setActiveCategory('dan_vu')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeCategory === 'dan_vu' ? 'bg-accent text-white shadow-sm' : 'text-dark-slate/75 hover:text-dark-obsidian'
                }`}
              >
                Dân vũ
              </button>
            </div>

            <div className="flex bg-light-cream border border-slate-300/50 p-1 rounded-lg">
              <button
                onClick={() => setActiveSort('votes')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeSort === 'votes' ? 'bg-secondary text-[#111827] shadow-sm' : 'text-dark-slate/75 hover:text-dark-obsidian'
                }`}
              >
                Nhiều vote nhất
              </button>
            </div>
          </div>
        </div>

        {/* Discovery Candidate Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-xs text-dark-slate/60 animate-pulse">Đang nạp danh sách bình chọn...</p>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                teamName={candidate.teamName}
                performanceTitle={candidate.performanceTitle}
                category={candidate.category}
                votesCount={candidate.votesCount}
                thumbnailUrl={candidate.photoUrl}
                onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-light-cream/40 rounded-2xl border border-slate-300/30 space-y-2">
            <SlidersHorizontal className="w-8 h-8 text-dark-slate/30 mx-auto" />
            <p className="text-sm font-semibold text-dark-obsidian">Không tìm thấy kết quả phù hợp</p>
            <p className="text-xs text-dark-slate/60">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đổi bộ lọc.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
