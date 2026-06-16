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
      className="group relative bg-dark-slate/40 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(0,105,92,0.15)] flex flex-col h-full"
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={performanceTitle}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-slate to-dark-obsidian">
            <span className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Play className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-dark-obsidian/80 backdrop-blur px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-light-cream">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest leading-none">
          Mã số: {id.substring(0, 5).toUpperCase()}
        </span>
        <h3 className="font-heading font-semibold text-lg text-light-cream mt-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {performanceTitle}
        </h3>
        <p className="text-xs text-light-alabaster/60 mt-1 line-clamp-1">
          {teamName}
        </p>

        {/* Voting & Action Panel */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Heart className="w-4 h-4 text-primary fill-primary/20 animate-pulse" />
            <span className="font-semibold text-light-cream">{votesCount.toLocaleString()}</span>
            <span className="text-[11px] text-light-alabaster/40 font-normal">lượt</span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/vote/${id}`}
              className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-light-cream"
            >
              Xem Chi Tiết
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
