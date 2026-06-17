import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-obsidian border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-primary rounded-full" />
            <span className="font-heading font-bold text-lg tracking-wide text-light-cream">
              NHỊP BƯỚC VIỆT NAM 2026
            </span>
          </div>
          <p className="text-sm text-light-alabaster/60 leading-relaxed max-w-sm">
            Festival Dân Ca Dân Vũ Quốc Tế lần thứ nhất tôn vinh tinh hoa di sản văn hóa phi vật thể và kết nối nhịp đập vũ đạo hiện đại trên thế giới.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-secondary text-sm uppercase tracking-wider">
            Liên Kết Nhanh
          </h3>
          <ul className="space-y-2 text-sm text-light-alabaster/70">
            <li>
              <Link href="/register" className="hover:text-secondary transition-colors">Đăng ký đội dự thi</Link>
            </li>
            <li>
              <Link href="/vote" className="hover:text-secondary transition-colors">Cổng bình chọn khán giả</Link>
            </li>
            <li>
              <Link href="/judge" className="hover:text-secondary transition-colors">Cổng chấm điểm Giám khảo</Link>
            </li>
            <li>
              <a
                href="/files/the-le-chi-tiet.pdf"
                download="The_le_chi_tiet_Nhip_buoc_Viet_Nam_2026.pdf"
                className="hover:text-secondary transition-colors"
              >
                Tải Thể Lệ Chi Tiết (PDF)
              </a>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-secondary text-sm uppercase tracking-wider">
            Hỗ Trợ & Ban Tổ Chức
          </h3>
          <ul className="space-y-2 text-sm text-light-alabaster/70">
            <li>
              <span className="text-light-alabaster/40">Hotline:</span> +84 (0) 987 654 321 (Mr. Thanh)
            </li>
            <li>
              <span className="text-light-alabaster/40">Fanpage:</span> <a href="https://facebook.com/nhipbuocvietnam2026" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-secondary transition-colors">facebook.com/nhipbuocvietnam2026</a>
            </li>
            <li>
              <span className="text-light-alabaster/40">Email:</span> btc@nhipbuocvietnam.gov.vn
            </li>
            <li>
              <span className="text-light-alabaster/40">Địa chỉ:</span> Nhà hát Lớn Hà Nội, Số 01 Tràng Tiền, Hoàn Kiếm, Hà Nội
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-light-alabaster/40">
        <p>&copy; {new Date().getFullYear()} Ban Tổ Chức Festival Dân Ca Dân Vũ Quốc Tế. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Điều khoản bảo mật</a>
          <a href="#" className="hover:underline">Bản quyền truyền thông</a>
        </div>
      </div>
    </footer>
  );
}
