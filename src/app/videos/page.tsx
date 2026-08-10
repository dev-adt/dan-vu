'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Video as VideoIcon, Play, ChevronLeft, ChevronRight, Star, Calendar, ArrowLeft, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoModal, { VideoItem } from '@/components/VideoModal';
import { parseVideoUrl } from '@/lib/videoUtils';
import { useLanguage } from '@/context/LanguageContext';

const LIMIT = 9;

export default function VideosPage() {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const totalPages = Math.ceil(total / LIMIT);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (search) params.set('search', search);
      if (featuredOnly) params.set('featured', 'true');

      const res = await fetch(`/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, featuredOnly]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    setPage(1);
  }, [search, featuredOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-light-alabaster to-light-cream text-dark-obsidian">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="w-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border-b border-slate-200/60 py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-[11px] text-dark-slate/50 font-medium mb-4">
              <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-dark-slate/80">{t('videos.tag')}</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-dark-obsidian leading-tight">
              {t('videos.title')}
            </h1>
            <p className="text-sm text-dark-slate/60 mt-3 max-w-xl">
              {t('videos.subtitle')}
            </p>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('videos.search_placeholder')}
                  className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
                {searchInput && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-all"
              >
                {t('news.search_btn')}
              </button>
            </form>

            {/* Filter: Featured */}
            <button
              onClick={() => setFeaturedOnly((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                featuredOnly
                  ? 'bg-secondary text-[#111827] border-secondary shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-secondary/60'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {t('videos.filter_featured')}
            </button>

            {/* Result count */}
            {!isLoading && (
              <span className="text-xs text-dark-slate/50 ml-auto">
                {search || featuredOnly ? (
                  <>
                    Tìm thấy <strong className="text-dark-slate/80">{total}</strong> video
                  </>
                ) : (
                  <>
                    Tổng <strong className="text-dark-slate/80">{total}</strong> video
                  </>
                )}
              </span>
            )}
          </div>
        </section>

        {/* Videos Grid */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <VideoIcon className="w-16 h-16 text-slate-300 mx-auto" />
              <h2 className="font-heading font-bold text-xl text-dark-obsidian">
                {search || featuredOnly ? 'Không tìm thấy kết quả' : 'Chưa có video nào'}
              </h2>
              <p className="text-sm text-dark-slate/50">
                {search || featuredOnly ? 'Thử từ khóa khác hoặc bỏ bộ lọc.' : 'Vui lòng quay lại sau.'}
              </p>
              {(search || featuredOnly) && (
                <button
                  onClick={() => { clearSearch(); setFeaturedOnly(false); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${page}-${search}-${featuredOnly}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {videos.map((vid) => {
                  const parsed = parseVideoUrl(vid.video_url, vid.thumbnail_url);
                  return (
                    <motion.div
                      key={vid.id}
                      layout
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group cursor-pointer"
                      onClick={() => setSelectedVideo(vid)}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900 select-none">
                        {parsed.thumbnailUrl ? (
                          <img
                            src={parsed.thumbnailUrl}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white/40">
                            <VideoIcon className="w-16 h-16" />
                          </div>
                        )}

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Featured Badge */}
                        {vid.is_featured && (
                          <span className="absolute top-3 right-3 bg-secondary text-[#111827] font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md z-10">
                            NỔI BẬT ★
                          </span>
                        )}
                      </div>

                      {/* Info Body */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                        <div className="space-y-2">
                          <h2 className="font-heading font-extrabold text-sm text-dark-obsidian leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                            {vid.title}
                          </h2>
                          {vid.summary && (
                            <p className="text-[11px] text-dark-slate/60 line-clamp-2 italic">{vid.summary}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="flex items-center gap-1 text-[10px] text-dark-slate/50">
                            <Calendar className="w-3 h-3" />
                            {new Date(vid.created_at).toLocaleDateString('vi-VN')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideo(vid);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 hover:bg-accent hover:text-white text-accent font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Xem Video
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;
                const show = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1;
                const showEllipsis = !show && (pageNum === 2 || pageNum === totalPages - 1);

                if (showEllipsis) {
                  return <span key={i} className="text-slate-400 text-sm px-1">…</span>;
                }
                if (!show) return null;

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Back to home */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-dark-obsidian font-semibold rounded-xl text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Về Trang Chủ
            </Link>
          </div>
        </section>
      </main>

      {/* Video Modal Popup */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      <Footer />
    </div>
  );
}
