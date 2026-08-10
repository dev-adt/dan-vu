'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserPlus, Film, Award, CheckCircle, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Stage {
  titleKey: string;
  title: string;
  titleEn: string;
  dateDisplay: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stages: Stage[] = [
  {
    titleKey: 'timeline.stage1',
    title: 'Phát động Cuộc thi Thiết kế Logo & Bộ nhận diện',
    titleEn: 'Official Logo & Brand Identity Contest Launch',
    dateDisplay: '21/07/2026 - 30/07/2026',
    startDate: '2026-07-21',
    endDate: '2026-07-30',
    description: 'Tiếp nhận hồ sơ dự thi thiết kế logo chính thức tại Văn phòng Ban Tổ chức, 53 Nguyễn Du, Hà Nội.',
    descriptionEn: 'Receiving logo design contest entries at the Organizing Committee Office, 53 Nguyen Du, Hanoi.',
    icon: Award,
  },
  {
    titleKey: 'timeline.stage2',
    title: 'Mở tiếp nhận Đăng ký dự thi Festival',
    titleEn: 'Festival Registration Portal Opens',
    dateDisplay: '21/07/2026 - 15/08/2026',
    startDate: '2026-07-21',
    endDate: '2026-08-15',
    description: 'Các đoàn nghệ thuật, câu lạc bộ dân ca dân vũ nộp hồ sơ đăng ký & video tiết mục online.',
    descriptionEn: 'Arts troupes and folk dance clubs submit online registration profiles and video performances.',
    icon: UserPlus,
  },
  {
    titleKey: 'timeline.stage3',
    title: 'Chấm Sơ khảo & Thẩm định kỹ thuật',
    titleEn: 'Preliminary Round Judging & Evaluation',
    dateDisplay: '20/08/2026 - 25/08/2026',
    startDate: '2026-08-20',
    endDate: '2026-08-25',
    description: 'Ban Giám Khảo làm việc trên hệ thống scoring online để đánh giá và tuyển chọn các tiết mục chính thức.',
    descriptionEn: 'The Jury Panel operates on the online scoring portal to evaluate and select finalists.',
    icon: Film,
  },
  {
    titleKey: 'timeline.stage4',
    title: 'Lễ Khai mạc & Khởi động Festival',
    titleEn: 'Opening Ceremony & Festival Launch',
    dateDisplay: '28/08/2026',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    description: 'Bắt đầu chuỗi sự kiện tại Quảng trường 7/5, phường Điện Biên Phủ, tỉnh Điện Biên.',
    descriptionEn: 'Kicking off event series at May 7th Square, Dien Bien Phu Ward, Dien Bien Province.',
    icon: Flame,
  },
  {
    titleKey: 'timeline.stage5',
    title: 'Liên hoan, Carnaval đường phố & Trình diễn Khinh khí cầu',
    titleEn: 'Street Carnaval, Festival Fair & Hot Air Balloon Show',
    dateDisplay: '28/08/2026 - 02/09/2026',
    startDate: '2026-08-28',
    endDate: '2026-09-02',
    description: 'Hội chợ 300 gian hàng, biểu diễn đường phố, giao lưu văn hóa quốc tế (Lào, Thái Lan, Trung Quốc,...).',
    descriptionEn: '300 trade booths, street performances, international cultural exchanges (Laos, Thailand, China,...).',
    icon: Calendar,
  },
  {
    titleKey: 'timeline.stage6',
    title: 'Gala Tổng kết & Lễ Trao giải truyền hình trực tiếp trên VTV',
    titleEn: 'Grand Awards Gala Live Broadcast on VTV',
    dateDisplay: '01/09/2026',
    startDate: '2026-09-01',
    endDate: '2026-09-01',
    description: 'Công bố kết quả, trao giải toàn đoàn & chuyên đề nhân dịp 81 năm Quốc khánh Nước CHXHCN Việt Nam.',
    descriptionEn: 'Announcing results, awarding champions on the 81st National Day of Vietnam.',
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
  const { language, t } = useLanguage();
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          {t('timeline.tag', 'Lịch Trình Festival')}
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          {t('timeline.title', 'Hành Trình Sự Kiện 2026')}
        </h2>
        <div className="w-12 h-1 bg-secondary mx-auto mt-2 rounded-full" />
      </div>

      <div className="relative border-l border-slate-200 ml-4 md:ml-36 space-y-10">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const today = currentDate || new Date();
          const status = getStageStatus(stage.startDate, stage.endDate, today);
          const isCurrent = status === 'current';
          const isPast = status === 'past';
          const isFuture = status === 'future';

          const stageTitle = language === 'en' ? stage.titleEn : stage.title;
          const stageDesc = language === 'en' ? stage.descriptionEn : stage.description;

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
                    {stageTitle}
                  </h3>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-slate-950 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                      {language === 'en' ? 'Ongoing' : 'Đang Diễn Ra'}
                    </span>
                  )}

                  {isPast && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ {language === 'en' ? 'Completed' : 'Đã Kết Thúc'}
                    </span>
                  )}

                  {isFuture && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'en' ? 'Upcoming' : 'Sắp Diễn Ra'}
                    </span>
                  )}
                </div>

                <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isPast ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stageDesc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

