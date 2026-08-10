'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export default function ImageLightbox({ src, alt, caption, className }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Clickable Image Thumbnail Box */}
      <div className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 my-4 cursor-pointer">
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300 ${className || ''}`}
          onClick={() => setIsOpen(true)}
        />
        {/* Hover Overlay */}
        <div
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 bg-dark-obsidian/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-[2px]"
        >
          <div className="bg-white/20 p-2 rounded-full border border-white/40">
            <ZoomIn className="w-5 h-5" />
          </div>
          <span>Bấm để phóng to hình ảnh</span>
        </div>
        {caption && (
          <div className="bg-slate-50 px-4 py-2 text-center text-xs text-slate-500 border-t border-slate-100 italic">
            {caption}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-obsidian/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full transition-colors cursor-pointer border border-white/20"
                title="Đóng ảnh"
              >
                <X className="w-6 h-6" />
              </button>

              {/* High-res Image */}
              <div className="w-full h-full overflow-auto rounded-2xl border border-white/10 shadow-2xl bg-black flex items-center justify-center">
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl"
                />
              </div>

              {caption && (
                <p className="mt-3 text-center text-xs text-white/80 font-medium">
                  {caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
