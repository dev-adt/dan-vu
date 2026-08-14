'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-obsidian border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-primary rounded-full" />
            <span className="font-heading font-bold text-lg tracking-wide text-light-cream">
              {t('brand.title', 'NHỊP BƯỚC VIỆT NAM')} 2026
            </span>
          </div>
          <p className="text-sm text-light-alabaster/60 leading-relaxed max-w-sm">
            {t('narrative.description')}
          </p>
          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <LanguageSwitcher />
            <a
              href="https://www.facebook.com/festivaldanvuquocte"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 text-light-cream hover:bg-[#1877F2]/30 hover:border-[#1877F2]/50 transition-all shadow-sm group"
            >
              <FacebookIcon className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
              <span>Fanpage Facebook</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-secondary text-sm uppercase tracking-wider">
            {t('footer.links_title', 'LIÊN KẾT NHANH')}
          </h3>
          <ul className="space-y-2 text-sm text-light-alabaster/70">
            <li>
              <Link href="/register" className="hover:text-secondary transition-colors">{t('nav.register', 'Đăng ký đội dự thi')}</Link>
            </li>
            <li>
              <Link href="/vote" className="hover:text-secondary transition-colors">{t('nav.vote', 'Cổng bình chọn khán giả')}</Link>
            </li>
            <li>
              <Link href="/guide" className="hover:text-secondary transition-colors font-semibold text-secondary">📖 {t('nav.guides', 'Cẩm nang & Hướng dẫn sử dụng')}</Link>
            </li>
            <li>
              <a
                href="/files/the-le-chi-tiet.pdf"
                download="The_le_chi_tiet_Nhip_buoc_Viet_Nam_2026.pdf"
                className="hover:text-secondary transition-colors"
              >
                {t('hero.download_rules', 'Tải Thể Lệ Chi Tiết (PDF)')}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-secondary text-sm uppercase tracking-wider">
            {t('footer.organizer_title', 'Hỗ Trợ & Ban Tổ Chức')}
          </h3>
          <ul className="space-y-2 text-sm text-light-alabaster/70">
            <li>
              <span className="text-light-alabaster/40">Truyền thông:</span> 0966 925 606 (Ms. Hương - Trưởng Ban kết nối truyền thông)
            </li>
            <li>
              <span className="text-light-alabaster/40">Du lịch:</span> 0375 860 238 (Ms Thúy - Phụ trách về tour: khách sạn, nhà hàng)
            </li>
            <li>
              <span className="text-light-alabaster/40">Fanpage Facebook:</span>{' '}
              <a
                href="https://www.facebook.com/festivaldanvuquocte"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-secondary transition-colors font-medium inline-flex items-center gap-1 text-light-cream"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2] inline-block" />
                facebook.com/festivaldanvuquocte
              </a>
            </li>
            <li>
              <span className="text-light-alabaster/40">Liên hệ BTC:</span> <a href="mailto:festival2026@dancadanvu.com" className="hover:underline hover:text-secondary transition-colors">festival2026@dancadanvu.com</a>
            </li>
            <li>
              <span className="text-light-alabaster/40">Hotline:</span> <a href="tel:0856040205" className="hover:underline hover:text-secondary transition-colors">0856040205</a>
            </li>
            <li>
              <span className="text-light-alabaster/40">Văn phòng BTC tiếp nhận hồ sơ:</span> Số 53 Nguyễn Du, P. Hai Bà Trưng, TP. Hà Nội
            </li>
            <li>
              <span className="text-light-alabaster/40">Địa điểm tổ chức:</span> {t('footer.location', 'Quảng trường 7/5, P. Điện Biên Phủ, Tỉnh Điện Biên')}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-light-alabaster/40">
        <p>{t('footer.copyright')}</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.facebook.com/festivaldanvuquocte"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
            Facebook Fanpage
          </a>
          <a href="#" className="hover:underline">Điều khoản bảo mật</a>
          <a href="#" className="hover:underline">Bản quyền truyền thông</a>
        </div>
      </div>
    </footer>
  );
}

