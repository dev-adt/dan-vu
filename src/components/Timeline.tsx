'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserPlus, Film, Award, CheckCircle, Flame } from 'lucide-react';

interface Stage {
  title: string;
  dateDisplay: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stages: Stage[] = [
  {
    title: 'Phát động Cuộc thi Thiết kế Logo & Bộ nhận diện',
    dateDisplay: '21/07/2026 - 30/07/2026',
    startDate: '2026-07-21',
    endDate: '2026-07-30',
    description: 'Tiếp nhận hồ sơ dự thi thiết kế logo chính thức tại Văn phòng Ban Tổ chức, 53 Nguyễn Du, Hà Nội.',
    icon: Award,
  },
  {
    title: 'Mở tiếp nhận Đăng ký dự thi Festival',
    dateDisplay: '21/07/2026 - 15/08/2026',
    startDate: '2026-07-21',
    endDate: '2026-08-15',
    description: 'Các đoàn nghệ thuật, câu lạc bộ dân ca dân vũ nộp hồ sơ đăng ký & video tiết mục online.',
    icon: UserPlus,
  },
  {
    title: 'Chấm Sơ khảo & Thẩm định kỹ thuật',
    dateDisplay: '20/08/2026 - 25/08/2026',
    startDate: '2026-08-20',
    endDate: '2026-08-25',
    description: 'Ban Giám Khảo làm việc trên hệ thống scoring online để đánh giá và tuyển chọn các tiết mục chính thức.',
    icon: Film,
  },
  {
    title: 'Lễ Khai mạc & Khởi động Festival',
    dateDisplay: '28/08/2026',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    description: 'Bắt đầu chuỗi sự kiện tại Quảng trường 7/5, phường Điện Biên Phủ, tỉnh Điện Biên.',
    icon: Flame,
  },
  {
    title: 'Liên hoan, Quảng diễn & Trình diễn Khinh khí cầu',
    dateDisplay: '28/08/2026 - 01/09/2026',
    startDate: '2026-08-28',
    endDate: '2026-09-01',
    description: 'Hội chợ 300 gian hàng, biểu diễn đường phố, giao lưu văn hóa quốc tế (Lào, Thái Lan, Trung Quốc,...).',
    icon: Calendar,
  },
  {
    title: 'Gala Tổng kết & Lễ Trao giải Quốc tế',
    dateDisplay: '02/09/2026',
    startDate: '2026-09-02',
    endDate: '2026-09-02',
    description: 'Công bố kết quả, trao giải toàn đoàn & chuyên đề nhân dịp 81 năm Quốc khánh Nước CHXHCN Việt Nam.',
    icon: CheckCircle,
  },
];

function getStageStatus(startDateStr: string, endDateStr: string, currentDate: Date): 'past' | 'current' | 'future' {
  const start = new Date(`${startDateStr}T00:00:00`);
  const end = new Date(`${endDateStr}T23:59:59`);

  if (currentDate > end) return 'past';
  if (currentDate >= start && currentDate <= end) return 'current';
  return 'future';
}

export default function Timeline() {
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Cập Nhật Thời Gian Thực
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Lịch trình Sự kiện tương tác
        </h2>
        <div className="w-12 h-1 bg-secondary mx-auto mt-2 rounded-full" />
        <p className="text-slate-600 text-sm mt-3">
          Theo dõi các mốc thời gian quan trọng của Festival Dân ca Dân vũ 2026
        </p>
      </div>

      <div className="relative border-l border-slate-200 ml-4 md:ml-36 space-y-10">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const today = currentDate || new Date();
          const status = getStageStatus(stage.startDate, stage.endDate, today);
          const isCurrent = status === 'current';
          const isPast = status === 'past';
          const isFuture = status === 'future';

          return (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Dot Icon Indicator */}
              <span
                className={`absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 z-10 ${
                  isCurrent
                    ? 'bg-amber-500 border-amber-500 text-slate-950 scale-125 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : isPast
                    ? 'bg-slate-700 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isPast ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
              </span>

              {/* Sidebar date marker */}
              <div className="hidden md:block absolute -left-40 top-2.5 w-32 text-right">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isCurrent ? 'text-amber-600 font-bold' : isPast ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.dateDisplay}
                </span>
              </div>

              {/* Main card */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-50/80 border-amber-400/80 shadow-md ring-2 ring-amber-400/20'
                    : isPast
                    ? 'bg-slate-50/90 border-slate-200/80 shadow-sm opacity-90'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <span
                  className={`md:hidden block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isCurrent ? 'text-amber-600 font-bold' : isPast ? 'text-slate-400 line-through' : 'text-slate-500'
                  }`}
                >
                  {stage.dateDisplay}
                </span>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    className={`font-heading font-bold text-base sm:text-lg ${
                      isCurrent ? 'text-amber-950' : isPast ? 'text-slate-700' : 'text-slate-900'
                    }`}
                  >
                    {stage.title}
                  </h3>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-slate-950 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                      Đang Diễn Ra
                    </span>
                  )}

                  {isPast && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Đã Kết Thúc
                    </span>
                  )}

                  {isFuture && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Sắp Diễn Ra
                    </span>
                  )}
                </div>

                <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isPast ? 'text-slate-500' : 'text-slate-600'}`}>
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
