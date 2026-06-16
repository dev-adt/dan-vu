# Nền tảng số Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026

Đây là kho lưu trữ mã nguồn cho nền tảng số chính thức phục vụ **Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026**. Dự án được xây dựng với mục tiêu mang lại trải nghiệm văn hóa cao cấp ("Modern Cultural Luxury"), kết hợp giữa bản sắc truyền thống Việt Nam và công nghệ hiện đại.

---

## 🛠️ Công Nghệ Sử Dụng

* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion (hiệu ứng chuyển động mượt mà), Lucide React (Icons).
* **Database & Auth:** Supabase (PostgreSQL) tích hợp bộ lọc bảo mật RLS và chống gian lận bình chọn.
* **Bộ biên dịch:** Turbopack (Next.js compilation siêu tốc).

---

## 💻 Chạy Dự Án Dưới Local

### 1. Chuẩn bị môi trường
Yêu cầu máy tính cài đặt sẵn **Node.js LTS** (khuyến nghị phiên bản 18 hoặc 20 trở lên).

### 2. Cài đặt các gói phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` ở thư mục gốc và điền thông tin Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Hướng Dẫn Triển Khai Lên VPS (Ubuntu Server)

Để đưa website chạy chính thức trên VPS của bạn và trỏ tên miền riêng có mã hóa bảo mật SSL, hãy thực hiện theo các bước sau:

### Bước 1: Cài đặt môi trường trên VPS
SSH vào VPS của bạn và cài đặt Node.js, Git, Nginx và PM2 (Trình quản lý tiến trình ứng dụng):

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js LTS (sử dụng NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Kiểm tra phiên bản cài đặt
node -v
npm -v

# Cài đặt PM2 toàn cục để chạy Next.js ngầm
sudo npm install -y -g pm2
```

### Bước 2: Clone dự án và Cài đặt
Đẩy code dự án của bạn lên Github/Gitlab, sau đó clone về VPS:

```bash
# Di chuyển đến thư mục chứa web
cd /www/wwwroot

# Clone code về VPS
git clone https://github.com/dev-adt/dan-vu.git danvu.edunow.today
cd danvu.edunow.today

# Cài đặt các gói thư viện
npm install
```

### Bước 3: Tạo file cấu hình môi trường Production
Tạo file `.env.production` tại thư mục `/www/wwwroot/danvu.edunow.today`:
```bash
nano .env.production
```
Nhập các cấu hình Supabase thực tế của bạn, nhấn `Ctrl + O` để lưu và `Ctrl + X` để thoát:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
PORT=3000
```

### Bước 4: Build và chạy ứng dụng bằng PM2
Biên dịch dự án Next.js sang bản tối ưu cho Production, sau đó dùng PM2 để tiến trình ứng dụng chạy ngầm liên tục (ngay cả khi bạn tắt SSH):

```bash
# Biên dịch dự án
npm run build

# Khởi chạy ngầm với PM2
pm2 start npm --name "nhip-buoc-viet-nam" -- run start

# Thiết lập PM2 tự động khởi chạy lại ứng dụng khi VPS khởi động lại
pm2 startup
pm2 save
```

*Các lệnh PM2 hữu dụng:*
* Xem danh sách ứng dụng: `pm2 list`
* Xem log trực tiếp: `pm2 logs nhip-buoc-viet-nam`
* Khởi động lại: `pm2 restart nhip-buoc-viet-nam`

### Bước 5: Cấu hình Nginx làm Reverse Proxy
Nginx sẽ nhận request từ cổng 80/443 (HTTP/HTTPS) và chuyển hướng vào cổng nội bộ 3000 mà Next.js đang chạy:

1. Tạo file cấu hình Nginx mới:
```bash
sudo nano /etc/nginx/sites-available/nhipbuocvietnam
```

2. Dán đoạn cấu hình sau (thay `yourdomain.com` bằng tên miền thật của bạn):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. Kích hoạt cấu hình và khởi động lại Nginx:
```bash
# Tạo liên kết biểu tượng (symlink) sang thư mục sites-enabled
sudo ln -s /etc/nginx/sites-available/nhipbuocvietnam /etc/nginx/sites-enabled/

# Kiểm tra cú pháp Nginx xem có lỗi không
sudo nginx -t

# Khởi động lại dịch vụ Nginx
sudo systemctl restart nginx
```

### Bước 6: Cài đặt SSL miễn phí (Let's Encrypt)
Bảo mật trang web với giao thức HTTPS để mã hóa dữ liệu bình chọn và chấm điểm:

```bash
# Cài đặt Certbot và plugin Nginx
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Tiến hành cài đặt chứng chỉ SSL tự động cấu hình cho Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot sẽ hỏi bạn địa chỉ email để gửi thông báo gia hạn và hỏi xem có muốn tự động redirect từ HTTP sang HTTPS không. Hãy chọn **Redirect (2)**. Certbot cũng sẽ tự động tạo cron job gia hạn SSL mỗi 90 ngày.

Đến đây, bạn đã hoàn tất việc chạy nền tảng trên VPS thành công dưới tên miền bảo mật HTTPS!

