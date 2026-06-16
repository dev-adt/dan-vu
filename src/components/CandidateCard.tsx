'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Heart, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface CandidateCardProps {
  id: string;
  teamName: string;
  performanceTitle: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  votesCount: number;
  thumbnailUrl?: string;
  onVote?: (id: string) => void;
}

export default function CandidateCard({
  id,
  teamName,
  performanceTitle,
  category,
  votesCount,
  thumbnailUrl,
  onVote,
}: CandidateCardProps) {
  const categoryLabel = 
    category === 'dan_ca' ? 'Dân Ca' : 
    category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,105,92,0.08)] flex flex-col h-full"
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={performanceTitle}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50">
            <span className="w-12 h-12 rounded-full bg-slate-200/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <Play className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm">
          <Tag className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
          Mã số: {id.substring(0, 5).toUpperCase()}
        </span>
        <h3 className="font-heading font-semibold text-lg text-slate-900 mt-2 line-clamp-1 group-hover:text-primary transition-colors">
          {performanceTitle}
        </h3>
        <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
          {teamName}
        </p>

        {/* Voting & Action Panel */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Heart className="w-4 h-4 text-primary fill-primary/10 animate-pulse" />
            <span className="font-bold text-slate-800">{votesCount.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400 font-normal">lượt</span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/vote/${id}`}
              className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
            >
              Chi Tiết
            </Link>
            <button
              onClick={() => onVote?.(id)}
              className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-accent text-white hover:bg-opacity-90 transition-all glow-gold-hover"
            >
              Bình Chọn
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
