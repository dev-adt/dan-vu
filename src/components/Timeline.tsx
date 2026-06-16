'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserPlus, Film, Award, CheckCircle, Flame } from 'lucide-react';

interface Stage {
  title: string;
  date: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'past' | 'current' | 'future';
}

const stages: Stage[] = [
  {
    title: 'Mở đăng ký dự thi',
    date: '16/06/2026',
    description: 'Các câu lạc bộ bắt đầu nộp hồ sơ, thông tin tiết mục và nhạc nền online.',
    icon: UserPlus,
    status: 'current',
  },
  {
    title: 'Hạn chót đóng đăng ký',
    date: '15/08/2026',
    description: 'Đóng cổng tiếp nhận hồ sơ. Bắt đầu khóa dữ liệu phục vụ thẩm định.',
    icon: CheckCircle,
    status: 'future',
  },
  {
    title: 'Chấm Sơ khảo kỹ thuật',
    date: '20/08/2026 - 30/08/2026',
    description: 'Ban Giám Khảo làm việc trên hệ thống scoring online để chọn ra các đội đi tiếp.',
    icon: Film,
    status: 'future',
  },
  {
    title: 'Vòng Chung khảo khu vực',
    date: '15/09/2026',
    description: 'Biểu diễn trực tiếp tại 3 cụm khu vực miền Bắc, Trung, Nam.',
    icon: Flame,
    status: 'future',
  },
  {
    title: 'Đêm Chung kết Quốc tế',
    date: '10/10/2026',
    description: 'Các đoàn quốc tế tụ hội và biểu diễn chung kết tại Thủ đô Hà Nội.',
    icon: Calendar,
    status: 'future',
  },
  {
    title: 'Lễ Trao giải & Gala trình diễn',
    date: '11/10/2026',
    description: 'Công bố kết quả bình chọn, tổng hợp điểm BGK và trao giải quán quân.',
    icon: Award,
    status: 'future',
  },
];

export default function Timeline() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Lịch trình Sự kiện tương tác
        </h2>
        <div className="w-12 h-1 bg-secondary mx-auto mt-4 rounded-full" />
        <p className="text-slate-600 text-sm mt-3">
          Theo dõi các mốc thời gian quan trọng của Festival Dân ca Dân vũ 2026
        </p>
      </div>

      <div className="relative border-l border-slate-200 ml-4 md:ml-32 space-y-12">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = stage.status === 'current';
          const isPast = stage.status === 'past';

          return (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Dot Icon Indicator */}
              <span className={`absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-300 ${
                isCurrent 
                  ? 'bg-secondary border-secondary text-dark-obsidian scale-125 shadow-[0_0_15px_rgba(244,180,0,0.3)]' 
                  : isPast 
                    ? 'bg-accent border-accent text-white' 
                    : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </span>

              {/* Sidebar date marker */}
              <div className="hidden md:block absolute -left-36 top-2.5 w-28 text-right">
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isCurrent ? 'text-primary' : 'text-slate-500'
                }`}>
                  {stage.date}
                </span>
              </div>

              {/* Main card */}
              <div className={`p-6 rounded-xl border transition-all duration-300 ${
                isCurrent 
                  ? 'bg-amber-50/60 border-secondary/40 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}>
                <span className="md:hidden block text-xs font-semibold text-secondary/80 uppercase tracking-wider mb-2">
                  {stage.date}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className={`font-heading font-semibold text-lg ${
                    isCurrent ? 'text-primary' : 'text-slate-900'
                  }`}>
                    {stage.title}
                  </h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-dark-obsidian bg-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      Đang Diễn Ra
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
