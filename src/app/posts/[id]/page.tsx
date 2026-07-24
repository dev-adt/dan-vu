'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Newspaper, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  photo_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  author: string;
  format?: 'html' | 'text' | 'markdown';
  summary?: string;
  source?: string;
}

const parseMarkdownToHtml = (text: string): string => {
  if (!text) return '';
  let html = text;

  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-6 mx-auto max-w-2xl"><img src="$2" alt="$1" class="w-full h-auto rounded-2xl shadow-md border border-slate-200" /></figure>');
  html = html.replace(/<\/figure>\n_([^_\n]+)_/g, '<figcaption class="text-xs text-slate-500 italic text-center mt-2 mb-4">$1</figcaption></figure>');
  html = html.replace(/^_([^_\n]+)_$/gim, '<p class="text-xs text-slate-500 italic text-center -mt-3 mb-4">$1</p>');

  const rawImageRegex = /(?<!src=")(https?:\/\/[^\s'"]+(?:\.(?:jpeg|jpg|gif|png|webp|svg)|supabase\.co\/storage\/v1\/object\/public\/photos\/)[^\s'"]*)/gi;
  html = html.replace(rawImageRegex, '<figure class="my-6 mx-auto max-w-2xl"><img src="$1" alt="Hình ảnh" class="w-full h-auto rounded-2xl shadow-md border border-slate-200" /></figure>');

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800 font-semibold transition-colors" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="font-heading font-semibold text-xl text-slate-800 mt-8 mb-3 leading-snug">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="font-heading font-bold text-2xl text-slate-900 mt-10 mb-4 leading-snug border-b border-slate-200 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="font-heading font-extrabold text-3xl text-slate-900 leading-tight my-6">$1</h1>');
  html = html.replace(/^->(.*?)<-$/gim, '<p class="text-center leading-relaxed my-2">$1</p>');
  html = html.replace(/^>>(.*$)/gim, '<p class="text-right leading-relaxed my-2">$1</p>');
  html = html.replace(/^<<(.*$)/gim, '<p class="text-left leading-relaxed my-2">$1</p>');
  html = html.replace(/^\|(.*?)\|$/gim, '<p class="text-justify leading-relaxed my-2">$1</p>');
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="text-base text-slate-700 list-disc ml-6 my-1.5 leading-relaxed">$1</li>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
  html = html.replace(/\n/g, '<br/>');

  return html;
};

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setPost(data.post);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-light-alabaster to-light-cream text-dark-obsidian">
      <Navbar />
      <main className="flex-1 w-full">
        {isLoading ? (
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-dark-slate/60 animate-pulse">Đang tải bài viết...</p>
            </div>
          </div>
        ) : notFound || !post ? (
          <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto" />
            <h1 className="font-heading font-bold text-2xl text-dark-obsidian">Không tìm thấy bài viết</h1>
            <p className="text-sm text-dark-slate/60">Bài viết này không tồn tại hoặc đã bị gỡ xuống.</p>
            <Link href="/posts" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all text-sm">
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách tin tức
            </Link>
          </div>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full"
          >
            {/* Hero Banner */}
            <div className="relative w-full h-72 sm:h-96 bg-slate-200 overflow-hidden">
              {post.photo_url ? (
                <img src={post.photo_url} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary/20">
                  <Newspaper className="w-24 h-24" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-obsidian/60 via-dark-obsidian/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <Link href="/posts" className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-dark-obsidian px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-all shadow-sm">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Tin tức
                </Link>
              </div>
              {post.is_featured && (
                <div className="absolute top-6 right-6">
                  <span className="bg-secondary text-[#111827] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                    NỔI BẬT ★
                  </span>
                </div>
              )}
            </div>

            {/* Article Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-[11px] text-dark-slate/50 font-medium flex-wrap">
                <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/posts" className="hover:text-primary transition-colors">Tin Tức</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-dark-slate/80 line-clamp-1">{post.title}</span>
              </nav>

              {/* Title + Meta */}
              <div className="space-y-4">
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-dark-obsidian leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-dark-slate/60 border-y border-slate-200 py-3">
                  <span className="flex items-center gap-1.5 bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <User className="w-3 h-3" />
                    {post.author || 'Ban Tổ Chức'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Summary */}
              {post.summary && (
                <div className="border-l-4 border-primary/40 pl-5 py-2 bg-primary/5 rounded-r-xl">
                  <p className="text-sm text-dark-slate/80 italic leading-relaxed">{post.summary}</p>
                </div>
              )}

              {/* Content */}
              <div
                className="leading-loose text-dark-slate/90 space-y-3 text-base prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{
                  __html: post.format === 'html' ? post.content : parseMarkdownToHtml(post.content),
                }}
              />

              {/* Source */}
              {post.source && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-dark-slate/40 font-semibold text-right italic">Nguồn: {post.source}</p>
                </div>
              )}

              {/* Back Button */}
              <div className="pt-6 flex gap-3 flex-wrap">
                <Link href="/posts" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-dark-obsidian font-semibold rounded-xl text-sm transition-all">
                  <ArrowLeft className="w-4 h-4" />
                  Xem tất cả tin tức
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-opacity-90 transition-all">
                  Trang Chủ
                </Link>
              </div>
            </div>
          </motion.article>
        )}
      </main>
      <Footer />
    </div>
  );
}
