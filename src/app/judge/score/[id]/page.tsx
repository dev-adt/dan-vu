'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, ChevronLeft, Save, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ScoreDetails {
  concept: number;
  technique: number;
  costume: number;
  stage: number;
  comments: string;
}

const rubricMax = {
  concept: 30,
  technique: 40,
  costume: 20,
  stage: 10,
};

export default function ElectronicScorecard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [scores, setScores] = useState<ScoreDetails>({
    concept: 20,
    technique: 25,
    costume: 15,
    stage: 8,
    comments: '',
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  const totalScore = scores.concept + scores.technique + scores.costume + scores.stage;

  const handleSliderChange = (criteria: keyof Omit<ScoreDetails, 'comments'>, val: number) => {
    setScores((prev) => ({
      ...prev,
      [criteria]: val,
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate async storage saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push('/judge');
  };

  const handleConfirmSubmit = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowConfirmModal(false);
    router.push('/judge');
  };

  if (!unwrappedParams) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-obsidian text-light-alabaster">
        <p className="text-sm animate-pulse">Đang tải phiếu chấm điểm...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-dark-obsidian text-light-alabaster overflow-hidden">
      {/* Top Header bar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-dark-slate/40 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/judge"
            className="flex items-center gap-1.5 text-xs text-light-alabaster/60 hover:text-secondary uppercase font-bold tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Portal
          </Link>
          <span className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-dark-obsidian bg-accent px-2 py-0.5 rounded uppercase tracking-wider">
              Phiếu Chấm Điểm
            </span>
            <span className="text-xs text-light-cream font-heading font-semibold">
              Mã số tiết mục: {unwrappedParams.id.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors text-light-cream"
          >
            <Save className="w-4 h-4" /> Lưu Bản Nháp
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-dark-obsidian rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md"
          >
            <FileCheck className="w-4 h-4" /> Gửi Điểm Chính Thức
          </button>
        </div>
      </header>

      {/* Main Dual-pane layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Pane: Video Player (60% width on large screens) */}
        <div className="w-full lg:w-[60%] flex flex-col bg-black relative min-h-0 border-r border-white/10">
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {/* Aspect box inside flexbox wrapper */}
            <div className="w-full max-h-full aspect-video relative bg-dark-slate/40 flex items-center justify-center border-y border-white/5">
              <div className="z-10 text-center space-y-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-secondary text-dark-obsidian flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,180,0,0.4)]"
                >
                  <Play className={`w-6 h-6 fill-dark-obsidian ml-1 ${isPlaying ? 'animate-ping' : ''}`} />
                </button>
                <p className="text-xs font-semibold uppercase tracking-wider text-light-cream">
                  {isPlaying ? 'Video Đang Phát' : 'Bấm để phát video bài dự thi'}
                </p>
              </div>
            </div>
          </div>

          {/* Left panel video control controls */}
          <div className="h-14 bg-dark-slate/20 border-t border-white/5 flex items-center px-4 justify-between text-xs text-light-alabaster/60 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-secondary font-semibold"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="flex items-center gap-1 hover:text-secondary">
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span>Tốc độ: <strong>1.0x</strong></span>
              <span>Thời lượng: <strong>07:00</strong></span>
            </div>
          </div>
        </div>

        {/* Right Pane: Evaluation Rubric Form (40% width) */}
        <div className="hidden lg:block w-[40%] flex flex-col bg-dark-slate/40 overflow-y-auto min-h-0 p-6 space-y-8">
          <div>
            <h3 className="font-heading font-bold text-xl text-light-cream">Hệ thống Tiêu chí đánh giá</h3>
            <p className="text-xs text-light-alabaster/40 mt-1">Sử dụng thanh trượt để cho điểm. Điểm tổng tự động tính toán.</p>
          </div>

          <div className="space-y-6">
            {/* Criteria 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-light-cream">1. Nội dung & Ý tưởng (Tối đa 30)</span>
                <span className="font-bold text-secondary text-sm">{scores.concept} / 30 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.concept}
                value={scores.concept}
                onChange={(e) => handleSliderChange('concept', parseInt(e.target.value))}
                className="w-full h-1 bg-dark-obsidian rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-light-alabaster/40 italic">Đúng chủ đề văn hóa, giữ gìn bản sắc vùng miền, có tính sáng tạo phù hợp.</p>
            </div>

            {/* Criteria 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-light-cream">2. Kỹ thuật biểu diễn (Tối đa 40)</span>
                <span className="font-bold text-secondary text-sm">{scores.technique} / 40 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.technique}
                value={scores.technique}
                onChange={(e) => handleSliderChange('technique', parseInt(e.target.value))}
                className="w-full h-1 bg-dark-obsidian rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-light-alabaster/40 italic">Động tác múa đều, đẹp, đúng nhịp phách, kỹ thuật thanh nhạc dân ca chuẩn.</p>
            </div>

            {/* Criteria 3 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-light-cream">3. Trang phục & Đạo cụ (Tối đa 20)</span>
                <span className="font-bold text-secondary text-sm">{scores.costume} / 20 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.costume}
                value={scores.costume}
                onChange={(e) => handleSliderChange('costume', parseInt(e.target.value))}
                className="w-full h-1 bg-dark-obsidian rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-light-alabaster/40 italic">Đẹp mắt, hài hòa sắc màu truyền thống và phù hợp tuyệt đối với văn hóa bản địa.</p>
            </div>

            {/* Criteria 4 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-light-cream">4. Hiệu ứng sân khấu (Tối đa 10)</span>
                <span className="font-bold text-secondary text-sm">{scores.stage} / 10 đ</span>
              </div>
              <input
                type="range"
                min="0"
                max={rubricMax.stage}
                value={scores.stage}
                onChange={(e) => handleSliderChange('stage', parseInt(e.target.value))}
                className="w-full h-1 bg-dark-obsidian rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-light-alabaster/40 italic">Biểu cảm gương mặt, cuốn hút, sự tự tin và khả năng làm chủ không gian.</p>
            </div>
          </div>

          {/* Sum details */}
          <div className="bg-dark-obsidian rounded-xl border border-white/5 p-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-semibold text-light-alabaster/40 uppercase tracking-wider">Tổng điểm tích lũy</span>
              <span className="block text-xs text-light-cream mt-0.5">Tự động tính</span>
            </div>
            <div className="text-3xl font-extrabold text-secondary">
              {totalScore} <span className="text-sm font-semibold text-light-alabaster/40">/ 100 đ</span>
            </div>
          </div>

          {/* Comment inputs */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-light-alabaster/40">Nhận xét & Góp ý của Giám khảo</label>
            <textarea
              rows={4}
              value={scores.comments}
              onChange={(e) => setScores((prev) => ({ ...prev, comments: e.target.value }))}
              placeholder="Nhập ý kiến chuyên môn gửi về cho BTC và phản hồi đội thi..."
              className="w-full bg-dark-obsidian border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-secondary focus:outline-none resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Confirmation Lock Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="glass-panel border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-secondary mx-auto" />
              <h3 className="font-heading font-bold text-xl text-light-cream">Khóa & Gửi điểm?</h3>
              <p className="text-xs text-light-alabaster/60 leading-relaxed">
                Sau khi gửi điểm, toàn bộ số điểm <strong className="text-secondary">{totalScore} điểm</strong> của tiết mục sẽ được khóa lại vĩnh viễn và đồng bộ về máy chủ của BTC. Bạn không thể tự ý sửa đổi nếu không có sự phê duyệt của trưởng BTC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 border border-white/10 rounded-xl text-xs font-semibold text-light-cream hover:bg-white/5 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSaving}
                className="w-1/2 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-1.5"
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
