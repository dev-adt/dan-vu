'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Compass,
  Star,
  X,
  Sparkles,
  PhoneCall,
  Utensils,
  Award,
  ShieldCheck,
  Check,
  Flame
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

export interface TourPackage {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  duration: string;
  transport: string;
  image: string;
  highlights: string[];
  itinerary: { day: string; title: string; details: string[] }[];
  inclusions: string[];
  exclusions: string[];
  menuHighlights: string[];
}

const TOUR_DATA: TourPackage[] = [
  {
    id: 'tour-1-day',
    badge: 'Trọn Gói 1 Ngày',
    badgeColor: 'bg-amber-500 text-white',
    title: 'TOUR ĐIỆN BIÊN 1 NGÀY',
    subtitle: 'Dấu Ấn Điện Biên Phủ - Hành Trình Về Miền Lịch Sử',
    duration: '08:00 – 16:30 (1 Ngày)',
    transport: 'Ô tô riêng (16 – 29 chỗ)',
    image: '/images/tour-1day.png',
    highlights: [
      'Bảo tàng Chiến thắng Điện Biên Phủ & Bức tranh Panorama 360°',
      'Đồi A1 & Hố bộc phá 1.000kg huyền thoại',
      'Hầm Chỉ huy Tướng De Castries (Hầm Đờ Cát)',
      'Tượng đài Chiến thắng Điện Biên Phủ (Đồi D1)',
      'Trải nghiệm Làng Văn hóa Dân tộc Thái hoặc Khinh khí cầu',
      'Thưởng thức ẩm thực đặc sản Tây Bắc trọn vị'
    ],
    menuHighlights: [
      'Gà nướng mắc khén',
      'Cá suối nướng (Pa pỉnh tộp)',
      'Xôi nếp nương Điện Biên',
      'Thị trâu gác bếp thơm nức',
      'Rau rừng Tây Bắc theo mùa'
    ],
    itinerary: [
      {
        day: '08:00 | ĐÓN KHÁCH & KHỞI HÀNH',
        title: 'Đón khách tại trung tâm TP. Điện Biên Phủ',
        details: [
          'Xe & HDV đón quý khách tại khách sạn trung tâm TP. Điện Biên Phủ.',
          'Trên xe, HDV thuyết minh tổng quan về Chiến dịch Điện Biên Phủ năm 1954 – trận đánh lừng lẫy chấn động địa cầu.'
        ]
      },
      {
        day: '08:30 | BẢO TÀNG CHIẾN THẮNG ĐIỆN BIÊN PHỦ',
        title: 'Chiêm ngưỡng Bức tranh Panorama 360° siêu thực',
        details: [
          'Tham quan bảo tàng hiện đại bậc nhất với hàng nghìn hiện vật quý.',
          'Trải nghiệm sa bàn điện tử tái hiện toàn bộ chiến dịch lịch sử.',
          'Chiêm ngưỡng Bức tranh Panorama 360° tái hiện Chiến dịch Điện Biên Phủ – kiệt tác nghệ thuật độc nhất vô nhị.'
        ]
      },
      {
        day: '09:45 | DI TÍCH ĐỒI A1',
        title: 'Cứ điểm quan trọng nhất hệ thống phòng thủ Pháp',
        details: [
          'Khám phá Hố bộc phá nổi tiếng – nơi 1.000kg thuốc nổ làm nên lịch sử.',
          'Mục kích xác xe tăng Pháp, hầm chiến đấu và đài tưởng niệm trên đỉnh đồi A1.'
        ]
      },
      {
        day: '10:45 | NGHĨA TRANG LIỆT SĨ A1',
        title: 'Tưởng niệm các anh hùng liệt sĩ',
        details: [
          'Dâng hương tri ân các anh hùng liệt sĩ đã hy sinh vì độc lập dân tộc.',
          'Không gian trang nghiêm và xúc động giữa thung lũng Mường Thanh.'
        ]
      },
      {
        day: '11:15 | HẦM CHỈ HUY DE CASTRIES',
        title: 'Căn hầm De Castries huyền thoại',
        details: [
          'Tham quan nơi chỉ huy của Tướng De Castries và toàn bộ bộ chỉ huy Pháp.',
          'Nghe kể về thời khắc lịch sử chiều ngày 07/5/1954 khi cờ đỏ sao vàng tung bay trên mái hầm Đờ Cát.'
        ]
      },
      {
        day: '12:15 | THƯỞNG THỨC ẨM THỰC ĐIỆN BIÊN',
        title: 'Bữa trưa đặc sản Tây Bắc phong phú',
        details: [
          'Dùng bữa trưa tại nhà hàng địa phương với các món đặc sản: Gà nướng mắc khén, cá suối nướng, xôi nếp nương, thịt trâu gác bếp, rau rừng.'
        ]
      },
      {
        day: '14:00 | TƯỢNG ĐÀI CHIẾN THẮNG (ĐỒI D1)',
        title: 'Góc nhìn toàn cảnh thành phố Điện Biên Phủ',
        details: [
          'Leo đồi D1 chiêm bái Tượng đài Chiến thắng Điện Biên Phủ lớn nhất Việt Nam.',
          'Ngắm trọn vẹn toàn cảnh cánh đồng Mường Thanh bạt ngàn từ trên cao.'
        ]
      },
      {
        day: '15:00 | TRẢI NGHIỆM TỰ CHỌN ĐẶC SẮC',
        title: 'Lựa chọn Làng Văn Hóa Thái hoặc Khinh khí cầu',
        details: [
          'Lựa chọn 1: Tham quan Làng Văn hóa Dân tộc Thái, dạo chơi nhà sàn, tìm hiểu nghề dệt thổ cẩm & mua quà lưu niệm.',
          'Lựa chọn 2: Trải nghiệm bay Khinh khí cầu ngắm thung lũng Mường Thanh từ trên cao (chi phí tự túc).'
        ]
      },
      {
        day: '17:30 | KẾT THÚC HÀNH TRÌNH',
        title: 'Trả khách về điểm đón ban đầu',
        details: ['Xe tiễn đoàn trở về khách sạn trung tâm. Kết thúc chuyến tham quan ấn tượng.']
      }
    ],
    inclusions: [
      'Xe du lịch đời mới 16 – 29 chỗ phục vụ trọn tour',
      'Bữa ăn chính tiêu chuẩn 200.000 VNĐ/người/bữa',
      'Vé tham quan tất cả các điểm di tích trong chương trình',
      'Hướng dẫn viên chuyên nghiệp, am hiểu lịch sử Điện Biên',
      'Nước uống: 02 chai 500ml/khách/ngày',
      'Bảo hiểm du lịch mức tối đa & Banner chào đoàn'
    ],
    exclusions: [
      'Phòng đơn khách sạn',
      'Thuế VAT 8% - 10%',
      'Đồ uống gọi thêm trong các bữa ăn',
      'Chi phí cá nhân ngoài chương trình',
      'Vé bay Khinh khí cầu Điện Biên (nếu đăng ký)'
    ]
  },
  {
    id: 'tour-5-days',
    badge: 'Hot Combo Festival',
    badgeColor: 'bg-primary text-white',
    title: 'TOUR ĐIỆN BIÊN 5 NGÀY 4 ĐÊM',
    subtitle: 'Điện Biên Hào Hùng – Trọn Vẹn Festival Dân Vũ Quốc Tế 2026',
    duration: '5 Ngày 4 Đêm (28/8 – 02/9/2026)',
    transport: 'Ô tô riêng (16 – 29 chỗ)',
    image: '/images/tour-5days.png',
    highlights: [
      'Hòa mình vào không khí Đêm Khai mạc & các đêm trình diễn Festival Dân Vũ Quốc Tế 2026',
      'Tham quan Bảo tàng Panorama 360°, Đồi A1, Nghĩa trang Liệt sĩ A1',
      'Tượng đài Chiến thắng Điện Biên Phủ trên đồi D1 huyền thoại',
      'Trải nghiệm bay Khinh khí cầu ngắm thung lũng Mường Thanh',
      'Khám phá văn hóa & làng dệt thổ cẩm Dân tộc Thái',
      'Nghỉ dưỡng khách sạn 3 sao trung tâm + Thực đơn ẩm thực cao cấp'
    ],
    menuHighlights: [
      'Gà nướng mắc khén Tây Bắc',
      'Cá suối nướng Pa pỉnh tộp',
      'Xôi nếp nương Điện Biên thơm dẻo',
      'Thịt trâu gác bếp đậm đà',
      'Lẩu rau rừng khoáng chất'
    ],
    itinerary: [
      {
        day: 'NGÀY 1 (28/8): ĐÓN SÂN BAY – ĐÊM KHAI MẠC FESTIVAL',
        title: 'Đón đoàn & Khai mạc Festival Dân Vũ Quốc Tế',
        details: [
          'Sáng: Đón khách tại sân bay Điện Biên, đưa về khách sạn 3 sao nhận phòng và dùng bữa trưa.',
          'Chiều: Tự do nghỉ ngơi, chuẩn bị tinh thần cho đêm hội hoành tráng.',
          '17:30: Dùng bữa tối tại nhà hàng. Xe đưa đoàn ra Quảng trường 7/5 dự Đêm Khai mạc Festival Dân Vũ Quốc Tế 2026.'
        ]
      },
      {
        day: 'NGÀY 2 (29/8): THAM GIA LỄ HỘI FESTIVAL DÂN VŨ',
        title: 'Hòa mình cùng âm vang vũ điệu dân gian',
        details: [
          'Trọn gói bữa ăn sáng, trưa, tối tại nhà hàng đặc sản.',
          'Xe đưa đón đoàn ra Quảng trường theo dõi các chương trình biểu diễn và dự thi của các đoàn nghệ thuật Việt Nam & Quốc tế.'
        ]
      },
      {
        day: 'NGÀY 3 (30/8): SÔI ĐỘNG CÙNG FESTIVAL DÂN VŨ',
        title: 'Thưởng thức tinh hoa vũ đạo quốc tế',
        details: [
          'Trọn gói bữa ăn sáng, trưa, tối.',
          'Xe đưa đón quý khách tham dự các chuỗi sự kiện, hội chợ văn hóa OCOP và các chương trình nghệ thuật Festival.'
        ]
      },
      {
        day: 'NGÀY 4 (01/9): HÀNH TRÌNH DI TÍCH & ĐÊM CHUNG KẾT',
        title: 'Bảo tàng Panorama – Đồi A1 – Đêm Chung kết',
        details: [
          '08:30: Tham quan Bảo tàng Chiến thắng (Panorama 360°), Đồi A1 (Hố bộc phá 1000kg), Nghĩa trang Liệt sĩ A1.',
          '12:30: Dùng bữa trưa đặc sản Điện Biên.',
          '14:30: Trải nghiệm Làng Văn hóa Dân tộc Thái hoặc bay Khinh khí cầu Điện Biên.',
          '18:00: Dùng bữa tối. Xe đưa đoàn ra Quảng trường tham dự Đêm Chung kết & Lễ Trao giải Festival Dân Vũ Quốc Tế.'
        ]
      },
      {
        day: 'NGÀY 5 (02/9): TƯỢNG ĐÀI CHIẾN THẮNG D1 – TIỄN ĐOÀN',
        title: 'Ngắm thung lũng Mường Thanh & Tiễn sân bay',
        details: [
          'Sáng: Ăn sáng, tham quan Tượng đài Chiến thắng Điện Biên Phủ trên đồi D1 – điểm ngắm thung lũng Mường Thanh đẹp nhất.',
          'Trưa: Dùng bữa trưa tại nhà hàng, trả phòng khách sạn.',
          'Xe đưa đoàn ra sân bay Điện Biên, kết thúc hành trình 5N4Đ tuyệt vời.'
        ]
      }
    ],
    inclusions: [
      'Xe du lịch đời mới 16 – 29 chỗ theo suốt chương trình',
      'Khách sạn tiêu chuẩn 3 sao trung tâm (02 khách/phòng)',
      'Ăn sáng: 50.000 VNĐ/người/bữa | Ăn chính: 200.000 VNĐ/người/bữa',
      'Vé tham quan tất cả các điểm di tích lịch sử',
      'Hướng dẫn viên năng động, am hiểu sâu sắc lịch sử & văn hóa',
      'Nước uống: 02 chai 500ml/khách/ngày',
      'Bảo hiểm du lịch cao cấp & Banner chào đoàn'
    ],
    exclusions: [
      'Phụ thu phòng đơn',
      'Thuế VAT 8% - 10%',
      'Đồ uống trong các bữa ăn',
      'Chi phí cá nhân ngoài chương trình',
      'Vé trải nghiệm Khinh khí cầu'
    ]
  },
  {
    id: 'tour-6-days',
    badge: 'Hành Trình Trọn Vẹn',
    badgeColor: 'bg-emerald-700 text-white',
    title: 'TOUR ĐIỆN BIÊN 6 NGÀY 5 ĐÊM',
    subtitle: 'Điện Biên Hào Hùng – Sở Chỉ Huy Mường Phăng & Suối Khoáng U Va',
    duration: '6 Ngày 5 Đêm (27/8 – 02/9/2026)',
    transport: 'Ô tô riêng (16 – 29 chỗ)',
    image: '/images/tour-6days.png',
    highlights: [
      'Tham quan Khu di tích Sở Chỉ huy Chiến dịch Mường Phăng (Hầm Đại tướng Võ Nguyên Giáp)',
      'Thư giãn & Phục hồi sức khỏe tại Suối khoáng nóng thiên nhiên U Va',
      'Trọn vẹn chuỗi sự kiện Festival Dân Vũ Quốc Tế 2026 tại Quảng trường 7/5',
      'Bảo tàng Panorama 360°, Đồi A1, Hầm De Castries, Tượng đài D1',
      'Trải nghiệm Khinh khí cầu Mường Thanh & Làng Văn hóa Dân tộc Thái',
      'Khách sạn 3 sao trung tâm + Trọn bộ thực đơn ẩm thực Tây Bắc xuất sắc'
    ],
    menuHighlights: [
      'Gà nướng mắc khén thơm ngon',
      'Cá suối nướng Pa pỉnh tộp nức tiếng',
      'Xôi nếp nương Điện Biên dẻo ngọt',
      'Thịt trâu gác bếp Mường Phăng',
      'Canh rau rừng khoáng nóng'
    ],
    itinerary: [
      {
        day: 'NGÀY 1 (27/8): ĐÓN SÂN BAY – BẢO TÀNG PANORAMA',
        title: 'Chào đón đoàn & Bảo tàng Chiến thắng Điện Biên Phủ',
        details: [
          'Sáng: Xe & HDV đón đoàn tại sân bay Điện Biên, về khách sạn 3 sao nhận phòng và dùng bữa trưa.',
          '15:30: Tham quan Bảo tàng Chiến thắng Điện Biên Phủ, chiêm ngưỡng Bức tranh Panorama 360° hoành tráng.',
          '18:00: Dùng bữa tối tại nhà hàng. Tự do dạo chơi khám phá thành phố về đêm.'
        ]
      },
      {
        day: 'NGÀY 2 (28/8): ĐỒI A1 – LÀNG THÁI / KHINH KHÍ CẦU – KHAI MẠC FESTIVAL',
        title: 'Di tích Đồi A1 & Đêm Khai mạc Festival',
        details: [
          '09:30: Tham quan Đồi A1 (Hố bộc phá 1000kg, xác xe tăng), Nghĩa trang Liệt sĩ A1.',
          '12:30: Ăn trưa tại nhà hàng.',
          '14:30: Trải nghiệm Làng Văn hóa Dân tộc Thái hoặc bay Khinh khí cầu ngắm cảnh.',
          '17:30: Dùng bữa tối. Di chuyển ra Quảng trường 7/5 tham dự Đêm Khai mạc Festival Dân Vũ Quốc Tế 2026.'
        ]
      },
      {
        day: 'NGÀY 3 (29/8): FESTIVAL DÂN VŨ QUỐC TẾ',
        title: 'Bùng nổ cùng các tiết mục nghệ thuật sắc màu',
        details: [
          'Phục vụ ăn sáng, trưa, tối trọn gói.',
          'Xe đưa đón đoàn tham dự chuỗi sự kiện trình diễn và các gian hàng hội chợ OCOP tại Quảng trường.'
        ]
      },
      {
        day: 'NGÀY 4 (30/8): LỄ HỘI DÂN VŨ & GIAO LƯU VĂN HÓA',
        title: 'Cổ vũ hết mình cho các đoàn dự thi',
        details: [
          'Phục vụ ăn sáng, trưa, tối trọn gói.',
          'Xe đưa đón đoàn tham gia không khí lễ hội sôi động và giao lưu văn hóa quốc tế.'
        ]
      },
      {
        day: 'NGÀY 5 (01/9): SỞ CHỈ HUY MƯỜNG PHĂNG – SUỐI KHOÁNG U VA',
        title: 'Rừng Mường Phăng & Thư giãn tắm khoáng nóng U Va',
        details: [
          '08:00: Khởi hành đi Khu di tích Sở Chỉ huy Chiến dịch Điện Biên Phủ tại Mường Phăng (cách trung tâm 35km).',
          '09:30: Tham quan Hầm Đại tướng Võ Nguyên Giáp, Hầm Hoàng Văn Thái, hệ thống giao thông hào trong rừng nguyên sinh.',
          '12:00: Ăn trưa đặc sản Mường Phăng.',
          '14:00 – 16:30: Thư giãn tại Suối khoáng nóng U Va (Tắm khoáng thiên nhiên, ngâm chân thư giãn, phục hồi sức khỏe).',
          '18:00: Dùng bữa tối. Xe đưa đoàn tham dự Đêm Chung kết & Lễ Trao giải Festival tại Quảng trường.'
        ]
      },
      {
        day: 'NGÀY 6 (02/9): TƯỢNG ĐÀI CHIẾN THẮNG D1 – TIỄN ĐOÀN',
        title: 'Chinh phục đồi D1 & Tiễn đoàn ra sân bay',
        details: [
          'Sáng: Ăn sáng, di chuyển tới Tượng đài Chiến thắng Điện Biên Phủ trên đồi D1, ngắm nhìn toàn cảnh thành phố.',
          'Trưa: Dùng bữa trưa tại nhà hàng, trả phòng khách sạn.',
          'Xe tiễn đoàn ra sân bay Điện Biên Phủ. Kết thúc chuyến du lịch 6N5Đ ấn tượng sâu sắc.'
        ]
      }
    ],
    inclusions: [
      'Xe du lịch đời mới 16 – 29 chỗ đưa đón xuyên suốt chương trình',
      'Khách sạn tiêu chuẩn 3 sao trung tâm (02 khách/phòng)',
      'Ăn sáng: 50.000 VNĐ/người/bữa | Ăn chính: 200.000 VNĐ/người/bữa',
      'Vé tham quan tất cả các di tích & vé vào Khu suối khoáng U Va',
      'Hướng dẫn viên năng động, nhiệt tình, am hiểu lịch sử',
      'Nước uống: 02 chai 500ml/khách/ngày',
      'Bảo hiểm du lịch tối đa & Banner chào đoàn'
    ],
    exclusions: [
      'Phụ thu phòng đơn',
      'Thuế VAT 8% - 10%',
      'Đồ uống gọi thêm trong các bữa ăn',
      'Chi phí cá nhân ngoài chương trình',
      'Vé trải nghiệm Khinh khí cầu'
    ]
  }
];

export default function TourSlider() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide interval
  useEffect(() => {
    if (!isAutoPlaying || selectedTour !== null) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOUR_DATA.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedTour]);

  const currentTour = TOUR_DATA[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TOUR_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TOUR_DATA.length);
  };

  return (
    <section
      className="py-20 px-4 max-w-7xl mx-auto relative z-10 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700 animate-spin" style={{ animationDuration: '10s' }} />
            {t('tour.tag')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-dark-obsidian tracking-wide">
            {t('tour.title')}
          </h2>
          <p className="text-xs sm:text-sm text-dark-slate/80 mt-1 max-w-2xl">
            {t('tour.subtitle')}
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2">
            {TOUR_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Tour ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-primary hover:bg-primary hover:text-white text-slate-700 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            title={t('tour.prev_btn')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-primary hover:bg-primary hover:text-white text-slate-700 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            title={t('tour.next_btn')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Container */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200/80 shadow-2xl bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTour.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
          >
            {/* Left Column: Image & Overlay details */}
            <div className="lg:col-span-5 relative overflow-hidden bg-slate-900 min-h-[300px] lg:min-h-full">
              <img
                src={currentTour.image}
                alt={currentTour.title}
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md tracking-wider uppercase inline-flex items-center gap-1.5 ${currentTour.badgeColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentTour.badge}
                </span>
              </div>

              {/* Bottom Quick Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {currentTour.duration}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    {currentTour.transport}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white drop-shadow-md">
                  {currentTour.title}
                </h3>
                <p className="text-xs text-slate-200 font-medium line-clamp-2 drop-shadow">
                  {currentTour.subtitle}
                </p>
              </div>
            </div>

            {/* Right Column: Tour Highlights, Menu, & Call to Action */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white via-slate-50/50 to-amber-50/30">
              <div className="space-y-5">
                {/* Title & Subtitle */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    <Star className="w-4 h-4 fill-primary" /> {t('tour.highlights_label')}
                  </div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                    {currentTour.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    {currentTour.subtitle}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentTour.highlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 leading-tight">
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Culinary Special Highlights */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    {t('tour.cuisine_label')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTour.menuHighlights.map((menu, mIdx) => (
                      <span
                        key={mIdx}
                        className="bg-white/90 border border-amber-300/60 text-amber-950 font-medium text-[11px] px-2.5 py-1 rounded-lg shadow-2xs"
                      >
                        ✓ {menu}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Hotline */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedTour(currentTour)}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(198,40,40,0.25)] transition-all cursor-pointer glow-crimson-hover"
                >
                  <Calendar className="w-4 h-4" />
                  {t('tour.view_itinerary_btn')}
                </button>

                <a
                  href="tel:0966925606"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(0,105,92,0.25)] transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  {t('tour.hotline_btn')}
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detailed Itinerary Modal Popup */}
      <AnimatePresence>
        {selectedTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-8"
            >
              {/* Modal Sticky Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-200 p-6 flex justify-between items-start gap-4">
                <div>
                  <span className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase inline-block mb-1 ${selectedTour.badgeColor}`}>
                    {selectedTour.badge}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
                    {selectedTour.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {selectedTour.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title={t('common.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Tour Key Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('tour.modal_time_label')}</span>
                      <strong className="text-xs font-bold text-slate-900">{selectedTour.duration}</strong>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <Compass className="w-8 h-8 text-accent shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('tour.modal_transport_label')}</span>
                      <strong className="text-xs font-bold text-slate-900">{selectedTour.transport}</strong>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('tour.modal_hotel_label')}</span>
                      <strong className="text-xs font-bold text-slate-900">{t('tour.modal_hotel_value')}</strong>
                    </div>
                  </div>
                </div>

                {/* Day-by-day Itinerary */}
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Calendar className="w-5 h-5 text-primary" /> {t('tour.modal_title')}
                  </h4>

                  <div className="space-y-6 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {selectedTour.itinerary.map((item, idx) => (
                      <div key={idx} className="relative pl-8 space-y-1">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                          {item.day}
                        </span>
                        <h5 className="font-bold text-sm text-slate-900">
                          {item.title}
                        </h5>
                        <ul className="space-y-1 pt-1">
                          {item.details.map((d, dIdx) => (
                            <li key={dIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <span className="text-slate-400">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                  {/* BAO GỒM */}
                  <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
                    <h5 className="font-heading font-bold text-sm text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('tour.modal_inclusions_label')}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-800">
                      {selectedTour.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KHÔNG BAO GỒM */}
                  <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
                    <h5 className="font-heading font-bold text-sm text-rose-950 uppercase tracking-wider flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-600" /> {t('tour.modal_exclusions_label')}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-800">
                      {selectedTour.exclusions.map((exc, eIdx) => (
                        <li key={eIdx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold shrink-0">✕</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact & Booking Banner */}
                <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div>
                    <h5 className="font-heading font-bold text-base">{t('tour.modal_banner_title')}</h5>
                    <p className="text-xs text-white/90 mt-0.5">{t('tour.modal_banner_desc')}</p>
                  </div>
                  <a
                    href="tel:0966925606"
                    className="bg-white text-primary hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Hotline: 0966 925 606
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
