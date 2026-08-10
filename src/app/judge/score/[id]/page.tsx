'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, ChevronLeft, Save, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ScoreDetails {
  concept: number;
  technique: number;
  costume: number;
  stage: number;
  comments: string;
}

interface TeamDetails {
  id: string;
  teamName: string;
  performanceTitle: string;
  videoUrl: string;
  category: string;
}

const rubricMax = {
  concept: 30,
  technique: 40,
  costume: 20,
  stage: 10,
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
  const [scores, setScores] = useState<ScoreDetails>({
    concept: 20,
    technique: 25,
    costume: 15,
    stage: 8,
    comments: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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
          setScores({
            concept: data.scorecard.score_concept,
            technique: data.scorecard.score_technique,
            costume: data.scorecard.score_costume,
            stage: data.scorecard.score_stage,
            comments: data.scorecard.feedback || '',
          });
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

  const totalScore = scores.concept + scores.technique + scores.costume + scores.stage;

  const handleSliderChange = (criteria: keyof Omit<ScoreDetails, 'comments'>, val: number) => {
    if (isLocked) return;
    setScores((prev) => ({
      ...prev,
      [criteria]: val,
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
          scoreConcept: scores.concept,
          scoreTechnique: scores.technique,
          scoreCostume: scores.costume,
          scoreStage: scores.stage,
          feedback: scores.comments,
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
        <p className="text-sm animate-pulse">Đang tải phiếu chấm điểm...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <p className="text-sm">Không tìm thấy thông tin tiết mục.</p>
        <button onClick={() => router.push('/judge')} className="px-4 py-2 bg-accent text-white font-bold text-xs uppercase rounded-xl">
          Quay lại portal
        </button>
      </div>
    );
  }

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
              Phiếu Chấm Điểm
            </span>
            <span className="text-xs text-slate-800 font-heading font-semibold">
              Mã số tiết mục: {team.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
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
                <Save className="w-4 h-4" /> Lưu Bản Nháp
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-dark-obsidian rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
              >
                <FileCheck className="w-4 h-4" /> Gửi Điểm Chính Thức
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Dual-pane layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Pane: Video Player (60% width on large screens) */}
        <div className="w-full lg:w-[60%] flex flex-col bg-black relative min-h-0 border-r border-slate-200">
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {team.videoUrl && (team.videoUrl.startsWith('http://') || team.videoUrl.startsWith('https://')) ? (
              <iframe
                className="w-full h-full border-0 absolute inset-0 z-0"
                src={getVideoEmbedUrl(team.videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="z-10 text-center space-y-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-secondary text-dark-obsidian flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,180,0,0.4)]"
                >
                  <Play className={`w-6 h-6 fill-dark-obsidian ml-1 ${isPlaying ? 'animate-ping' : ''}`} />
                </button>
                <p className="text-xs font-semibold uppercase tracking-wider text-light-cream">
                  BTC chưa đính kèm video chạy thử cho đội này
                </p>
              </div>
            )}
          </div>

          {/* Left panel video control controls */}
          <div className="h-14 bg-slate-900 border-t border-white/10 flex items-center px-4 justify-between text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-4">
              <span className="font-heading font-semibold text-white">{team.teamName} - "{team.performanceTitle}"</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Thể loại: <strong>{team.category === 'dan_ca' ? 'Dân Ca' : team.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Pane: Evaluation Rubric Form (40% width) */}
        <div className="hidden lg:block w-[40%] flex flex-col bg-white overflow-y-auto min-h-0 p-6 space-y-8 border-l border-slate-200">
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-900">Hệ thống Tiêu chí đánh giá</h3>
            <p className="text-xs text-slate-500 mt-1">Sử dụng thanh trượt để cho điểm. Điểm tổng tự động tính toán.</p>
          </div>

          <div className="space-y-6">
            {/* Criteria 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-800">1. Nội dung & Ý tưởng (Tối đa 30)</span>
                <span className="font-bold text-accent text-sm">{scores.concept} / 30 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.concept}
                value={scores.concept}
                disabled={isLocked}
                onChange={(e) => handleSliderChange('concept', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-slate-500 italic">Đúng chủ đề văn hóa, giữ gìn bản sắc vùng miền, có tính sáng tạo phù hợp.</p>
            </div>

            {/* Criteria 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-800">2. Kỹ thuật biểu diễn (Tối đa 40)</span>
                <span className="font-bold text-accent text-sm">{scores.technique} / 40 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.technique}
                value={scores.technique}
                disabled={isLocked}
                onChange={(e) => handleSliderChange('technique', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-slate-500 italic">Động tác múa đều, đẹp, đúng nhịp phách, kỹ thuật thanh nhạc dân ca chuẩn.</p>
            </div>

            {/* Criteria 3 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-800">3. Trang phục & Đạo cụ (Tối đa 20)</span>
                <span className="font-bold text-accent text-sm">{scores.costume} / 20 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.costume}
                value={scores.costume}
                disabled={isLocked}
                onChange={(e) => handleSliderChange('costume', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-slate-500 italic">Đẹp mắt, hài hòa sắc màu truyền thống và phù hợp tuyệt đối với văn hóa bản địa.</p>
            </div>

            {/* Criteria 4 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-800">4. Hiệu ứng sân khấu (Tối đa 10)</span>
                <span className="font-bold text-accent text-sm">{scores.stage} / 10 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.stage}
                value={scores.stage}
                disabled={isLocked}
                onChange={(e) => handleSliderChange('stage', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-slate-500 italic">Biểu cảm gương mặt, cuốn hút, sự tự tin và khả năng làm chủ không gian.</p>
            </div>
          </div>

          {/* Sum details */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tổng điểm tích lũy</span>
              <span className="block text-xs text-slate-400 mt-0.5">Tự động tính</span>
            </div>
            <div className="text-3xl font-extrabold text-accent">
              {totalScore} <span className="text-sm font-semibold text-slate-500">/ 100 đ</span>
            </div>
          </div>

          {/* Comment inputs */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nhận xét & Góp ý của Giám khảo</label>
            <textarea
              rows={4}
              value={scores.comments}
              disabled={isLocked}
              onChange={(e) => setScores((prev) => ({ ...prev, comments: e.target.value }))}
              placeholder="Nhập ý kiến chuyên môn gửi về cho BTC và phản hồi đội thi..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Confirmation Lock Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-6 max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-slate-900">Khóa & Gửi điểm?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sau khi gửi điểm, toàn bộ số điểm <strong className="text-accent">{totalScore} điểm</strong> của tiết mục sẽ được khóa lại vĩnh viễn và đồng bộ về máy chủ của BTC. Bạn không thể tự ý sửa đổi nếu không có sự phê duyệt của trưởng BTC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSaving}
                className="w-1/2 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSaving ? 'Đang gửi...' : 'Tôi xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
