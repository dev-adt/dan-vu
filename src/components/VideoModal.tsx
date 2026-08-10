'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Video as VideoIcon, ExternalLink } from 'lucide-react';
import { parseVideoUrl } from '@/lib/videoUtils';

export interface VideoItem {
  id: string;
  created_at: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  summary?: string;
  source?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
}

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  if (!video) return null;

  const parsed = parseVideoUrl(video.video_url, video.thumbnail_url);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-obsidian/75 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2 text-xs text-dark-slate/70 font-bold uppercase tracking-wider">
              <VideoIcon className="w-4 h-4 text-primary" />
              <span>Video & Clip</span>
              {video.is_featured && (
                <span className="bg-secondary text-[#111827] text-[9px] font-bold px-2 py-0.5 rounded-md">
                  NỔI BẬT ★
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-200 text-dark-obsidian p-2 rounded-full shadow-sm transition-colors border border-slate-200 cursor-pointer"
              title="Đóng video"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Video Player Box */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            {parsed.type === 'direct' ? (
              <video
                src={parsed.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={parsed.thumbnailUrl}
              >
                Trình duyệt của bạn không hỗ trợ phát video trực tiếp.
              </video>
            ) : parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="text-white/60 text-sm text-center p-8">
                <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Không thể mở link video trực tiếp.</p>
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-secondary underline font-semibold text-xs"
                >
                  Xem tại nguồn gốc <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Video Information */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-dark-obsidian leading-snug">
              {video.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-dark-slate/60 pb-3 border-b border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(video.created_at).toLocaleDateString('vi-VN')}
              </span>
              {video.source && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-primary">Nguồn: {video.source}</span>
                </>
              )}
            </div>

            {video.summary && (
              <p className="text-sm text-dark-slate/80 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                {video.summary}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Đóng Player
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
