'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CandidateCard from '@/components/CandidateCard';
import { Search, SlidersHorizontal, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MockCandidate {
  id: string;
  teamName: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  votesCount: number;
}

const mockCandidates: MockCandidate[] = [
  {
    id: 'dc-001',
    teamName: 'Đoàn Nghệ Thuật CLB Sen Vàng',
    performanceTitle: 'Liên khúc Dân ca Ba miền',
    category: 'dan_ca',
    votesCount: 3410,
  },
  {
    id: 'dv-002',
    teamName: 'CLB Dân Vũ Hòa Bình',
    performanceTitle: 'Vũ điệu Gặt Lúa Tây Bắc',
    category: 'dan_vu',
    votesCount: 2894,
  },
  {
    id: 'dc-003',
    teamName: 'CLB Dân Ca Sông Trà',
    performanceTitle: 'Điệu Lý Giao Duyên Xứ Quảng',
    category: 'dan_ca',
    votesCount: 1540,
  },
  {
    id: 'dv-004',
    teamName: 'Nhóm Múa Chăm Hữu Nghị',
    performanceTitle: 'Vũ điệu Tháp Cổ Chămpa',
    category: 'dan_vu',
    votesCount: 4230,
  },
];

export default function VoteDiscovery() {
  const [candidates, setCandidates] = useState<MockCandidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dan_ca' | 'dan_vu'>('all');
  const [activeSort, setActiveSort] = useState<'votes' | 'newest'>('votes');
  const [votedId, setVotedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    // Increment local vote counter
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votesCount: c.votesCount + 1 } : c))
    );
    setVotedId(id);
    setTimeout(() => {
      setVotedId(null);
    }, 3000);
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
      return 0; // maintain default
    });

  return (
    <div className="flex flex-col min-h-screen bg-dark-obsidian text-light-alabaster relative">
      <Navbar />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Banner header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary">
            Khán Giả Bình Chọn
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-light-cream mt-2">
            Đại Sứ Yêu Thích Nhất
          </h1>
          <p className="text-xs text-light-alabaster/50 mt-2 max-w-xl mx-auto">
            Mỗi tài khoản được bình chọn 01 lần/ngày cho mỗi tiết mục. Hành vi gian lận (hack vote) sẽ bị hủy kết quả.
          </p>
        </div>

        {/* Voting notification toast */}
        <AnimatePresence>
          {votedId && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel border border-accent/40 bg-dark-slate/90 text-light-cream px-6 py-3.5 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-accent animate-bounce" />
              <div className="text-xs text-left">
                <p className="font-semibold text-accent">Ghi nhận bình chọn thành công!</p>
                <p className="text-[10px] text-light-alabaster/60">Cảm ơn bạn đã đóng góp tiếng nói tôn vinh di sản.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter controls panel */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-light-alabaster/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nhập tên đội hoặc mã số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-obsidian border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:border-secondary focus:outline-none transition-colors"
            />
          </div>

          {/* Filters category & sort options */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <div className="flex bg-dark-obsidian border border-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  activeCategory === 'all' ? 'bg-accent text-white' : 'text-light-alabaster/60 hover:text-light-cream'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveCategory('dan_ca')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  activeCategory === 'dan_ca' ? 'bg-accent text-white' : 'text-light-alabaster/60 hover:text-light-cream'
                }`}
              >
                Dân ca
              </button>
              <button
                onClick={() => setActiveCategory('dan_vu')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  activeCategory === 'dan_vu' ? 'bg-accent text-white' : 'text-light-alabaster/60 hover:text-light-cream'
                }`}
              >
                Dân vũ
              </button>
            </div>

            <div className="flex bg-dark-obsidian border border-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveSort('votes')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  activeSort === 'votes' ? 'bg-secondary text-dark-obsidian' : 'text-light-alabaster/60 hover:text-light-cream'
                }`}
              >
                Nhiều vote nhất
              </button>
            </div>
          </div>
        </div>

        {/* Discovery Candidate Grid */}
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                teamName={candidate.teamName}
                performanceTitle={candidate.performanceTitle}
                category={candidate.category}
                votesCount={candidate.votesCount}
                onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-dark-slate/20 rounded-2xl border border-white/5 space-y-2">
            <SlidersHorizontal className="w-8 h-8 text-light-alabaster/30 mx-auto" />
            <p className="text-sm font-semibold text-light-cream">Không tìm thấy kết quả phù hợp</p>
            <p className="text-xs text-light-alabaster/40">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đổi bộ lọc.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
