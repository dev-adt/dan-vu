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
    title: 'Phát động Cuộc thi Thiết kế Logo & Bộ nhận diện',
    date: '21/07/2026 - 30/07/2026',
    description: 'Tiếp nhận hồ sơ dự thi thiết kế logo chính thức tại Văn phòng Ban Tổ chức, 53 Nguyễn Du, Hà Nội.',
    icon: Award,
    status: 'current',
  },
  {
    title: 'Mở tiếp nhận Đăng ký dự thi Festival',
    date: '21/07/2026 - 15/08/2026',
    description: 'Các đoàn nghệ thuật, câu lạc bộ dân ca dân vũ nộp hồ sơ đăng ký & video tiết mục online.',
    icon: UserPlus,
    status: 'current',
  },
  {
    title: 'Chấm Sơ khảo & Thẩm định kỹ thuật',
    date: '20/08/2026 - 25/08/2026',
    description: 'Ban Giám Khảo làm việc trên hệ thống scoring online để đánh giá và tuyển chọn các tiết mục chính thức.',
    icon: Film,
    status: 'future',
  },
  {
    title: 'Lễ Khai mạc & Khởi động Festival',
    date: '28/08/2026',
    description: 'Bắt đầu chuỗi sự kiện tại Quảng trường 7/5, phường Điện Biên Phủ, tỉnh Điện Biên.',
    icon: Flame,
    status: 'future',
  },
  {
    title: 'Liên hoan, Quảng diễn & Trình diễn Kinh khí cầu',
    date: '28/08/2026 - 01/09/2026',
    description: 'Hội chợ 300 gian hàng, biểu diễn đường phố, giao lưu văn hóa quốc tế (Lào, Thái Lan, Trung Quốc,...).',
    icon: Calendar,
    status: 'future',
  },
  {
    title: 'Gala Tổng kết & Lễ Trao giải Quốc tế',
    date: '02/09/2026',
    description: 'Công bố kết quả, trao giải toàn đoàn & chuyên đề nhân dịp 81 năm Quốc khánh Nước CHXHCN Việt Nam.',
    icon: CheckCircle,
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
