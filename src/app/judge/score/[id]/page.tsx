'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, ChevronLeft, Save, FileCheck, Layers, Video, Music } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PerformanceGrading {
  concept: number;
  technique: number;
  costume: number;
  stage: number;
}

interface TeamPerformanceItem {
  id?: string;
  title: string;
  category: string;
  duration?: string;
  description?: string;
  technicalRequirements?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface TeamDetails {
  id: string;
  teamName: string;
  performanceTitle: string;
  videoUrl: string;
  category: string;
  performances?: TeamPerformanceItem[];
}

const rubricMax = {
  concept: 30,
  technique: 40,
  costume: 20,
  stage: 10,
};

const defaultPerformanceScore: PerformanceGrading = {
  concept: 20,
  technique: 25,
  costume: 15,
  stage: 8,
};

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

export default function ElectronicScorecard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [activePerfIndex, setActivePerfIndex] = useState(0);

  // Scores for each of the 3 performances
  const [perfScores, setPerfScores] = useState<Record<string, PerformanceGrading>>({
    p1: { ...defaultPerformanceScore },
    p2: { ...defaultPerformanceScore },
    p3: { ...defaultPerformanceScore },
  });

  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      loadScorecardDetails();
    }
  }, [unwrappedParams]);

  const loadScorecardDetails = async () => {
    if (!unwrappedParams) return;
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/judge');
        return;
      }

      const res = await fetch(`/api/judge/scorecards/detail?teamId=${unwrappedParams.id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTeam(data.team);
        if (data.scorecard) {
          if (data.scorecard.scores && typeof data.scorecard.scores === 'object') {
            setPerfScores({
              p1: data.scorecard.scores.p1 || { ...defaultPerformanceScore },
              p2: data.scorecard.scores.p2 || { ...defaultPerformanceScore },
              p3: data.scorecard.scores.p3 || { ...defaultPerformanceScore },
            });
          } else {
            // Backward fallback if single score
            const legacyScore = {
              concept: data.scorecard.score_concept || 20,
              technique: data.scorecard.score_technique || 25,
              costume: data.scorecard.score_costume || 15,
              stage: data.scorecard.score_stage || 8,
            };
            setPerfScores({
              p1: { ...legacyScore },
              p2: { ...legacyScore },
              p3: { ...legacyScore },
            });
          }
          setComments(data.scorecard.feedback || '');
          setIsLocked(data.scorecard.is_locked);
        }
      } else {
        router.push('/judge');
      }
    } catch (err) {
      console.error('Error loading scorecard details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerfKey = (idx: number) => `p${idx + 1}`;

  const currentPerfScores = perfScores[getPerfKey(activePerfIndex)] || defaultPerformanceScore;

  const getSinglePerfTotal = (idx: number) => {
    const s = perfScores[getPerfKey(idx)] || defaultPerformanceScore;
    return s.concept + s.technique + s.costume + s.stage;
  };

  const totalP1 = getSinglePerfTotal(0);
  const totalP2 = getSinglePerfTotal(1);
  const totalP3 = getSinglePerfTotal(2);

  // Group average score
  const groupAverageScore = Number(((totalP1 + totalP2 + totalP3) / 3).toFixed(1));

  const handleSliderChange = (criteria: keyof PerformanceGrading, val: number) => {
    if (isLocked) return;
    const key = getPerfKey(activePerfIndex);
    setPerfScores((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [criteria]: val,
      },
    }));
  };

  const handleResetScores = () => {
    if (isLocked) return;
    const key = getPerfKey(activePerfIndex);
    setPerfScores((prev) => ({
      ...prev,
      [key]: { ...defaultPerformanceScore },
    }));
  };

  const saveScorecard = async (lock: boolean) => {
    if (!unwrappedParams) return;
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/judge');
        return;
      }

      const res = await fetch('/api/judge/scorecards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          teamId: unwrappedParams.id,
          performanceScores: perfScores,
          feedback: comments,
          isLocked: lock,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        router.push('/judge');
      } else {
        alert(result.error || 'Lưu phiếu điểm thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    await saveScorecard(false);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await saveScorecard(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-sm animate-pulse">Đang tải phiếu chấm điểm 3 tiết mục...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <p className="text-sm">Không tìm thấy thông tin tiết mục.</p>
        <button
          onClick={() => router.push('/judge')}
          className="px-4 py-2 bg-accent text-white font-bold text-xs uppercase rounded-xl"
        >
          Quay lại portal
        </button>
      </div>
    );
  }

  const perfs: TeamPerformanceItem[] =
    team.performances && team.performances.length > 0
      ? team.performances
      : [
          {
            id: 'p1',
            title: team.performanceTitle || 'Tiết mục 1',
            category: team.category,
            videoUrl: team.videoUrl,
          },
          {
            id: 'p2',
            title: 'Tiết mục 2',
            category: team.category,
            videoUrl: team.videoUrl,
          },
          {
            id: 'p3',
            title: 'Tiết mục 3',
            category: team.category,
            videoUrl: team.videoUrl,
          },
        ];

  const currentPerf = perfs[activePerfIndex] || perfs[0];
  const activeVideoUrl = currentPerf?.videoUrl || team.videoUrl;

  return (
    <div className="flex flex-col h-screen bg-transparent text-dark-obsidian overflow-hidden">
      {/* Top Header bar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/judge"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Portal
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded uppercase tracking-wider">
              Phiếu Chấm Điểm 3 Tiết Mục
            </span>
            <span className="text-xs text-slate-800 font-heading font-semibold">
              {team.teamName} (Mã: {team.id.substring(0, 8).toUpperCase()})
            </span>
          </div>
        </div>

        {/* Live Group Average score in header */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-500">T1: <strong className="text-slate-800">{totalP1}</strong></span>
            <span className="text-slate-500">T2: <strong className="text-slate-800">{totalP2}</strong></span>
            <span className="text-slate-500">T3: <strong className="text-slate-800">{totalP3}</strong></span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
              ĐIỂM NHÓM TB: <strong>{groupAverageScore} / 100</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLocked ? (
              <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 uppercase tracking-wider">
                ✓ Đã gửi chính thức
              </span>
            ) : (
              <>
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Lưu Nháp
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all glow-gold-hover disabled:opacity-50 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" /> Nộp Điểm Chính Thức
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace: 2-column Grid */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video & Performance Details */}
        <div className="lg:col-span-6 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
          {/* Performance switcher tabs */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
            {[0, 1, 2].map((idx) => {
              const pNum = idx + 1;
              const pTotal = getSinglePerfTotal(idx);
              return (
                <button
                  key={idx}
                  onClick={() => setActivePerfIndex(idx)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activePerfIndex === idx
                      ? 'bg-secondary text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>Tiết mục {pNum}</span>
                  <span className="text-[11px] font-mono font-bold opacity-90">{pTotal}đ</span>
                </button>
              );
            })}
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black flex items-center justify-center border-b border-slate-800">
            {activeVideoUrl && (activeVideoUrl.startsWith('http://') || activeVideoUrl.startsWith('https://')) ? (
              <iframe
                className="w-full h-full border-0 absolute inset-0"
                src={getVideoEmbedUrl(activeVideoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Play className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">
                  Chưa có video dự thi cho Tiết mục {activePerfIndex + 1}
                </p>
              </div>
            )}
          </div>

          {/* Performance Overview */}
          <div className="p-6 space-y-4 text-slate-300 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                Đang chấm: Tiết mục số {activePerfIndex + 1} / 3
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                {currentPerf.category === 'dan_ca'
                  ? 'Dân Ca'
                  : currentPerf.category === 'dan_vu'
                  ? 'Dân Vũ'
                  : 'Dân Ca & Dân Vũ'} {currentPerf.duration ? `(${currentPerf.duration})` : ''}
              </span>
            </div>

            <h2 className="font-heading font-bold text-xl text-white">
              {currentPerf.title || `Tiết mục ${activePerfIndex + 1}`}
            </h2>

            {currentPerf.description && (
              <p className="text-xs text-slate-400 leading-relaxed italic">
                &ldquo;{currentPerf.description}&rdquo;
              </p>
            )}

            {currentPerf.technicalRequirements && (
              <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-300">Yêu cầu sân khấu:</strong> {currentPerf.technicalRequirements}
              </div>
            )}

            {currentPerf.audioUrl && (
              <div className="pt-2">
                <a
                  href={currentPerf.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Mở file nhạc Beat Tiết mục {activePerfIndex + 1}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scoring Rubric & Feedback */}
        <div className="lg:col-span-6 flex flex-col bg-white overflow-y-auto">
          <div className="p-6 sm:p-8 space-y-8 flex-grow">
            {/* Header: Performance Switcher & Performance Total */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Chấm điểm chi tiết
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Tiết mục {activePerfIndex + 1}: {currentPerf.title || 'Chưa đặt tên'}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Điểm tiết mục {activePerfIndex + 1}
                </span>
                <span className="font-heading font-extrabold text-3xl text-secondary">
                  {getSinglePerfTotal(activePerfIndex)}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </span>
              </div>
            </div>

            {/* Rubric Sliders for active performance */}
            <div className="space-y-6">
              {/* Criteria 1: Concept */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>1. Ý Tưởng & Nội Dung (Tối đa 30đ)</span>
                  <span className="text-base text-accent font-mono">{currentPerfScores.concept}đ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={rubricMax.concept}
                  step="1"
                  disabled={isLocked}
                  value={currentPerfScores.concept}
                  onChange={(e) => handleSliderChange('concept', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500">
                  Đánh giá tính độc đáo, chủ đề tư tưởng, ý nghĩa văn hóa và câu chuyện di sản truyền tải.
                </p>
              </div>

              {/* Criteria 2: Technique */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>2. Kỹ Thuật Biểu Diễn (Tối đa 40đ)</span>
                  <span className="text-base text-accent font-mono">{currentPerfScores.technique}đ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={rubricMax.technique}
                  step="1"
                  disabled={isLocked}
                  value={currentPerfScores.technique}
                  onChange={(e) => handleSliderChange('technique', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500">
                  Độ đồng đều đội hình, kỹ thuật vũ đạo/thanh nhạc, nhịp điệu và khả năng làm chủ sân khấu.
                </p>
              </div>

              {/* Criteria 3: Costume */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>3. Trang Phục & Đạo Cụ (Tối đa 20đ)</span>
                  <span className="text-base text-accent font-mono">{currentPerfScores.costume}đ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={rubricMax.costume}
                  step="1"
                  disabled={isLocked}
                  value={currentPerfScores.costume}
                  onChange={(e) => handleSliderChange('costume', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500">
                  Sự chuẩn mực và thẩm mỹ của trang phục dân tộc, đạo cụ biểu diễn và tính sáng tạo.
                </p>
              </div>

              {/* Criteria 4: Stage & Visual Effects */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>4. Hiệu Ứng Sân Khấu (Tối đa 10đ)</span>
                  <span className="text-base text-accent font-mono">{currentPerfScores.stage}đ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={rubricMax.stage}
                  step="1"
                  disabled={isLocked}
                  value={currentPerfScores.stage}
                  onChange={(e) => handleSliderChange('stage', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500">
                  Cảm xúc mang lại cho khán giả, phối hợp ánh sáng, âm thanh và hiệu ứng sân khấu.
                </p>
              </div>
            </div>

            {/* Quick Reset Button */}
            {!isLocked && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResetScores}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại mặc định tiết mục này
                </button>
              </div>
            )}

            {/* Overall Team Score Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Tổng kết điểm 3 Tiết mục của đội thi
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  Công thức: Trung bình cộng 3 bài
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Tiết mục 1</span>
                  <strong className="text-lg text-slate-800 font-mono">{totalP1}đ</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Tiết mục 2</span>
                  <strong className="text-lg text-slate-800 font-mono">{totalP2}đ</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Tiết mục 3</span>
                  <strong className="text-lg text-slate-800 font-mono">{totalP3}đ</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">ĐIỂM TRUNG BÌNH CẢ NHÓM:</span>
                <span className="font-heading font-extrabold text-2xl text-primary font-mono">
                  {groupAverageScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </span>
              </div>
            </div>

            {/* General Feedback Comments */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Nhận Xét & Đánh Giá Của Giám Khảo (Tùy chọn)
              </label>
              <textarea
                disabled={isLocked}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Ghi chú đóng góp ý kiến chuyên môn cho đội thi..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs focus:border-accent focus:outline-none transition-colors resize-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Xác Nhận Nộp Điểm Chính Thức?
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-200">
              <p><strong>Đội thi:</strong> {team.teamName}</p>
              <p><strong>Tiết mục 1:</strong> {totalP1} điểm</p>
              <p><strong>Tiết mục 2:</strong> {totalP2} điểm</p>
              <p><strong>Tiết mục 3:</strong> {totalP3} điểm</p>
              <p className="pt-1 border-t border-slate-200 text-primary font-bold text-sm">
                Điểm trung bình toàn đội: {groupAverageScore} điểm
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sau khi xác nhận nộp chính thức, phiếu chấm điểm này sẽ được <strong>khóa lại</strong> và không thể chỉnh sửa.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Kiểm tra lại
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSaving}
                className="px-5 py-2 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all cursor-pointer"
              >
                {isSaving ? 'Đang lưu...' : 'Xác nhận nộp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
