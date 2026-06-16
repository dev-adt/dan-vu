# FESTIVAL DÂN CA DÂN VŨ QUỐC TẾ "NHỊP BƯỚC VIỆT NAM" 2026

## 1. TẦM NHÌN SẢN PHẨM

Xây dựng một nền tảng số hiện đại phục vụ:

* Ban Tổ Chức (BTC)
* Đội thi
* Ban Giám Khảo
* Khán giả

Website không chỉ là nơi đăng ký dự thi mà còn là:

* Cổng truyền thông chính thức
* Hệ thống quản lý cuộc thi
* Hệ thống bình chọn trực tuyến
* Hệ thống chấm điểm chuyên nghiệp
* Kho lưu trữ tư liệu cuộc thi

---

# 2. MỤC TIÊU UX/UI

## Mục tiêu trải nghiệm

Người dùng phải hoàn thành đăng ký trong dưới 5 phút.

Tối ưu Mobile First.

Giảm tối đa số bước thao tác.

Hiển thị chuyên nghiệp như một sự kiện quốc tế.

Tăng tỷ lệ chuyển đổi đăng ký.

Tăng tương tác bình chọn.

---

# 3. KIẾN TRÚC WEBSITE

## Public Website

### Trang chủ

Hero Banner

* Festival Dân ca Dân vũ Quốc tế
* Nhịp Bước Việt Nam 2026
* Video Background toàn màn hình
* CTA:

  * Đăng ký ngay
  * Xem thể lệ
  * Bình chọn

---

### Giới thiệu Festival

* Sứ mệnh
* Ý nghĩa văn hóa
* Hình ảnh Việt Nam
* Video giới thiệu

---

### Thời gian sự kiện

Timeline tương tác:

1. Mở đăng ký
2. Đóng đăng ký
3. Sơ khảo
4. Chung khảo
5. Chung kết
6. Trao giải

---

### Cơ cấu giải thưởng

Cards hiện đại:

* Giải Nhất
* Giải Nhì
* Giải Ba
* Giải phụ

Hiệu ứng nổi bật cho giải cao nhất.

---

### Đăng ký dự thi

Wizard Form nhiều bước:

Bước 1:
Thông tin đội thi

Bước 2:
Thông tin tiết mục

Bước 3:
Upload hồ sơ

Bước 4:
Xác nhận

Tính năng:

* Auto Save Draft
* Validation realtime
* Upload kéo thả
* Progress Bar

---

### FAQ

Các câu hỏi thường gặp.

---

### Liên hệ

* Hotline
* Fanpage
* Email
* Bản đồ

---

# 4. HỆ THỐNG BÌNH CHỌN ONLINE

## Mục tiêu

Tăng viral marketing.

Tăng tương tác cộng đồng.

---

## Trang danh sách thí sinh

Thanh tìm kiếm

Bộ lọc:

* Dân ca
* Dân vũ
* Mới nhất
* Nhiều vote nhất

---

## Card thí sinh

Hiển thị:

* Thumbnail video
* Ảnh đội thi
* Mã số dự thi
* Tên đội
* Tên tiết mục
* Tổng lượt vote

CTA:

BÌNH CHỌN

---

## Trang chi tiết

Video player

Thông tin đội

Mô tả tiết mục

Thống kê vote

Nút chia sẻ:

* Facebook
* Zalo
* Messenger

---

## Chống gian lận

* OTP SMS
* Google Login
* Facebook Login
* reCAPTCHA v3
* Rate Limiting
* Device Fingerprint
* IP Monitoring

---

# 5. HỆ THỐNG GIÁM KHẢO

## Đăng nhập bảo mật

* Email
* Password
* 2FA OTP

---

## Dashboard

Danh sách tiết mục

Trạng thái:

* Chưa chấm
* Đang chấm
* Đã gửi

---

## Phiếu chấm điểm

Layout chia đôi màn hình.

Trái:
Video

Phải:
Form chấm

Tiêu chí:

Nội dung & Ý tưởng: 30

Kỹ thuật biểu diễn: 40

Trang phục & Đạo cụ: 20

Hiệu ứng sân khấu: 10

Tổng điểm tự động.

---

## Chức năng BGK

* Lưu nháp
* Chỉnh sửa trước khi gửi
* Khóa điểm sau khi gửi
* Xem lịch sử chấm

---

# 6. ADMIN SYSTEM

## Dashboard tổng quan

Realtime Analytics

Hiển thị:

* Tổng đội thi
* Tổng video
* Tổng lượt vote
* Tổng giám khảo

---

## Quản lý đội thi

CRUD

Xuất Excel

Tìm kiếm nhanh

---

## Quản lý bình chọn

Theo dõi:

* Vote bất thường
* Spam
* Gian lận

---

## Quản lý điểm

Tổng hợp điểm

Xếp hạng

Xuất PDF

Xuất Excel

---

# 7. UI DESIGN SYSTEM

## Phong cách

Modern Cultural Luxury

Kết hợp:

* Văn hóa Việt Nam
* Công nghệ hiện đại
* Chuẩn quốc tế

---

## Màu sắc

Primary:
#C62828

Secondary:
#F4B400

Accent:
#00695C

Dark:
#0F172A

Background:
#FAFAFA

---

## Typography

Heading:
Playfair Display

Body:
Inter

Vietnamese Optimized

---

## Hiệu ứng

* Glassmorphism nhẹ
* Motion hiện đại
* Scroll Animation
* Hover Effects
* Parallax Hero

---

# 8. RESPONSIVE

Thiết kế Mobile First.

Breakpoint:

* Mobile
* Tablet
* Laptop
* Desktop
* 4K

Điểm Lighthouse:

* Performance > 95
* Accessibility > 95
* SEO > 95

---

# 9. SEO

Meta Title

Meta Description

Open Graph

Schema Event

Schema Organization

Schema FAQ

Sitemap

Robots.txt

---

# 10. CÔNG NGHỆ ĐỀ XUẤT

Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn/UI
* Framer Motion

Backend

* Supabase

Database

* PostgreSQL

Storage

* Supabase Storage

Authentication

* Supabase Auth

Email

* Resend

Security

* reCAPTCHA
* OTP
* RBAC

---

# 11. KẾT QUẢ MONG MUỐN

Một website tầm cỡ quốc tế.

Trang trọng, hiện đại, giàu bản sắc Việt Nam.

Tối ưu trải nghiệm người dùng.

Quản trị đơn giản.

Khả năng mở rộng cho các mùa Festival tiếp theo.
