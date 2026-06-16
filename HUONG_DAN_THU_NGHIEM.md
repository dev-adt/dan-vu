# 🏆 Hướng Dẫn Thử Nghiệm Tính Năng
## Festival Dân Ca Dân Vũ Quốc Tế – Nhịp Bước Việt Nam 2026

> **Dành cho:** Khách thử nghiệm / Stakeholder review  
> **Môi trường:** Demo nội bộ – Dữ liệu giả lập (Mock Data)  
> **Server:** http://localhost:3008

---

## 📋 Tổng quan các trang có thể thử nghiệm

| Trang | Đường dẫn | Trạng thái |
|---|---|---|
| Trang chủ | `/` | ✅ Công khai |
| Đăng ký đội thi | `/register` | ✅ Công khai |
| Cổng bình chọn | `/vote` | ✅ Công khai (cần email để vote) |
| **Cổng giám khảo** | `/judge` | 🔐 Yêu cầu đăng nhập |
| **Bảng Admin** | `/admin` | 🔐 Yêu cầu đăng nhập |

---

---

## 🏛️ PHẦN 1: Cổng Giám Khảo (`/judge`)

**Mục đích:** Nơi các thành viên Hội đồng Ban giám khảo đăng nhập để xem danh sách tiết mục cần chấm điểm và thực hiện chấm điểm trực tuyến.

---

### Bước 1 – Truy cập trang đăng nhập

Mở trình duyệt và truy cập:
```
http://localhost:3008/judge
```

Bạn sẽ thấy màn hình đăng nhập bảo mật **"Cổng Giám Khảo Bảo Mật"**.

---

### Bước 2 – Nhập tài khoản giám khảo

Trong form đăng nhập, nhập **bất kỳ email và mật khẩu nào** (hệ thống demo không kiểm tra thật):

| Trường | Giá trị gợi ý |
|---|---|
| **Email tài khoản** | `giamkhao@nhipbuocvietnam.gov.vn` (hoặc bất kỳ email nào) |
| **Mật khẩu** | Bất kỳ ký tự nào (ví dụ: `admin123`) |

Nhấn nút **"Đăng Nhập"**.

> 💡 Hệ thống sẽ mô phỏng xử lý trong ~1 giây, sau đó chuyển sang bước xác thực 2FA.

---

### Bước 3 – Nhập mã bảo mật 2FA OTP

Sau bước đăng nhập, màn hình sẽ chuyển sang ô nhập **Mã bảo mật 2FA OTP**.

Nhập **bất kỳ 6 chữ số nào**, ví dụ:
```
123456
```

Nhấn nút **"Xác thực & Vào Portal"**.

> 💡 Hệ thống demo sẽ xác thực thành công với bất kỳ mã 6 số nào.

---

### Bước 4 – Khám phá Bảng điều khiển Giám khảo

Sau khi đăng nhập thành công, bạn sẽ thấy **Bảng điều khiển Giám khảo** với thông tin:

#### 📊 Thẻ thống kê tổng quan (3 thẻ)

| Thẻ | Ý nghĩa |
|---|---|
| **Đã hoàn thành: 2/4** | Số tiết mục đã chấm điểm và gửi chính thức |
| **Bản nháp lưu: 1/4** | Tiết mục đã chấm nhưng chưa gửi chính thức |
| **Chưa đánh giá: 1/4** | Tiết mục chưa bắt đầu chấm |

#### 📋 Bảng danh sách tiết mục

Bảng hiển thị 4 tiết mục với các trạng thái khác nhau để thử nghiệm:

| Mã số | Tiết mục | Trạng thái | Thao tác có thể làm |
|---|---|---|---|
| DC-001 | Liên khúc Dân ca Ba miền | ✅ Đã gửi điểm | — (Đã khóa) |
| DV-002 | Vũ điệu Gặt Lúa Tây Bắc | 🟡 Đang chấm nháp | **Sửa nháp** |
| DC-003 | Điệu Lý Giao Duyên Xứ Quảng | 🔒 Chưa chấm | **Vào Chấm** |
| DV-004 | Vũ điệu Tháp Cổ Chămpa | ✅ Đã gửi điểm | — (Đã khóa) |

---

### Bước 5 – Thử nghiệm chấm điểm (Phiếu Chấm Điểm)

Click nút **"Vào Chấm"** (tiết mục DC-003) hoặc **"Sửa nháp"** (tiết mục DV-002).

Bạn sẽ được chuyển đến trang **Phiếu Chấm Điểm Điện Tử** tại:
```
http://localhost:3008/judge/score/dc-003
```

#### 🎬 Giao diện 2 cột

**Cột trái – Trình phát video (60% màn hình):**
- Click nút ▶️ tròn màu vàng để xem demo trình phát video
- Dùng nút Play/Replay phía dưới để điều khiển

**Cột phải – Bảng tiêu chí chấm điểm (40% màn hình):**

| # | Tiêu chí | Thang điểm | Có thể thao tác |
|---|---|---|---|
| 1 | Nội dung & Ý tưởng | 0 – 30 điểm | ✅ Kéo thanh trượt |
| 2 | Kỹ thuật biểu diễn | 0 – 40 điểm | ✅ Kéo thanh trượt |
| 3 | Trang phục & Đạo cụ | 0 – 20 điểm | ✅ Kéo thanh trượt |
| 4 | Hiệu ứng sân khấu | 0 – 10 điểm | ✅ Kéo thanh trượt |

- **Tổng điểm tích lũy** tự động cập nhật khi kéo các thanh trượt (tối đa 100 điểm).
- **Ô nhận xét** phía dưới để nhập góp ý chuyên môn (tùy ý).

---

### Bước 6 – Lưu nháp hoặc Gửi điểm chính thức

**Option A – Lưu bản nháp:**
Click **"Lưu Bản Nháp"** ở góc trên phải → hệ thống lưu và tự động quay về danh sách.

**Option B – Gửi điểm chính thức:**
1. Click **"Gửi Điểm Chính Thức"** → hiện hộp thoại xác nhận
2. Kiểm tra lại tổng điểm hiển thị trong modal
3. Click **"Tôi xác nhận"** → hệ thống khóa điểm và quay về danh sách

> ⚠️ Trong demo, sau khi gửi điểm, nút thao tác sẽ đổi thành **"Đã Khóa"** (không thể sửa thêm).

---

---

## 🖥️ PHẦN 2: Bảng Điều Hành Admin (`/admin`)

**Mục đích:** Cổng quản trị nội bộ dành cho Ban Tổ Chức – theo dõi thống kê tổng thể và giám sát bình chọn gian lận theo thời gian thực.

---

### Bước 1 – Truy cập trang đăng nhập Admin

Mở trình duyệt và truy cập:
```
http://localhost:3008/admin
```

Bạn sẽ thấy màn hình đăng nhập **"Bảng điều hành Quản trị viên"**.

---

### Bước 2 – Đăng nhập với tài khoản Admin

> ⚠️ **Lưu ý quan trọng:** Trang Admin có kiểm tra tài khoản thật. Phải dùng **đúng thông tin** sau:

| Trường | Giá trị |
|---|---|
| **Tên đăng nhập** | `admin` |
| **Mật khẩu** | `admin` |

Nhấn nút **"Đăng nhập Admin"**.

> 💡 Nếu nhập sai, hệ thống sẽ hiển thị thông báo lỗi "Sai tài khoản hoặc mật khẩu quản trị."

---

### Bước 3 – Khám phá Real-time Analytics Dashboard

Sau khi đăng nhập thành công, bạn sẽ thấy bảng phân tích số liệu tổng quan:

#### 📊 4 thẻ chỉ số chính

| Thẻ | Giá trị Demo | Ý nghĩa |
|---|---|---|
| **Tổng Đội Dự Thi** | 52 | Tổng số đoàn/nhóm đã đăng ký dự thi |
| **Tổng Lượt Bình Chọn** | 12,074 | Tổng lượt bình chọn của khán giả đến hiện tại |
| **Lượt Nghi Vấn Fraud** | 14 | Số lượt bình chọn hệ thống tự động đánh dấu bất thường |
| **Giám Khảo Chấm** | 5 | Số giám khảo đang tham gia chấm điểm |

#### 🛡️ Nhật ký Giám sát Bình chọn bất thường

Bảng hiển thị lịch sử các lượt bình chọn đáng ngờ với đầy đủ thông tin kiểm tra:

| Cột | Ý nghĩa |
|---|---|
| **Thời gian** | Timestamp của lượt vote |
| **Tiết mục** | Tên đội thi được vote cho |
| **Địa chỉ IP** | IP của người bình chọn |
| **Device Fingerprint** | Mã nhận diện thiết bị (canvas hash) |
| **Hệ số reCAPTCHA** | Điểm số từ 0.0–1.0 (thấp = nghi vấn bot) |
| **Trạng thái** | Hợp lệ / Nghi vấn / Đã hủy |

---

### Bước 4 – Thử nghiệm Hủy vote gian lận

Trong bảng nhật ký, tìm các dòng có trạng thái **"Nghi vấn"** (màu vàng, nhấp nháy):

1. Xem thông tin IP (`113.161.42.10`) – trùng nhau trong 2 dòng → dấu hiệu vote nhiều lần từ cùng một máy
2. Kiểm tra hệ số reCAPTCHA thấp (`0.12` và `0.08`) → dấu hiệu bot tự động
3. Click nút **"Hủy Vote"** (màu đỏ) trên dòng nghi vấn

**Kết quả sau khi hủy:**
- Trạng thái dòng đó đổi thành **"Đã hủy"** (màu xám)
- Số liệu **Tổng Lượt Bình Chọn** giảm đi 1
- Số liệu **Lượt Nghi Vấn Fraud** giảm đi 1

> 💡 Thử hủy lần lượt cả 2 dòng nghi vấn để xem số liệu thống kê cập nhật theo thời gian thực.

---

### Bước 5 – Thử nghiệm Xuất báo cáo

Ở góc trên phải của dashboard, có 2 nút xuất báo cáo:

| Nút | Hành động |
|---|---|
| **Xuất Excel** | Nhấn để xem thông báo khởi tạo xuất dữ liệu Excel |
| **Xuất PDF Điểm** | Nhấn để xem thông báo khởi tạo xuất báo cáo PDF |

> 💡 Trong bản demo, các nút này hiển thị thông báo xác nhận thay vì tải file thật.

---

---

## 🗳️ PHẦN 3: Cổng Bình Chọn Khán Giả (`/vote`)

**Mục đích:** Trang bình chọn công khai cho khán giả.

### Đường dẫn nhanh
```
http://localhost:3008/vote
```

### Thử nghiệm nhanh
1. Duyệt danh sách tiết mục (lọc theo Dân ca / Dân vũ)
2. Click vào một tiết mục để xem chi tiết
3. Nhập địa chỉ Gmail để xác thực (yêu cầu Google OAuth)
4. Đánh dấu ô đồng ý điều khoản → Nhấn "Gửi Bình Chọn"

---

---

## 🚀 Hành trình thử nghiệm gợi ý (Tổng hợp)

Để có trải nghiệm thử nghiệm đầy đủ nhất, hãy làm theo thứ tự sau:

```
1. Trang chủ           → http://localhost:3008/
2. Đăng ký đội thi     → http://localhost:3008/register
3. Cổng bình chọn      → http://localhost:3008/vote
4. Chi tiết tiết mục   → http://localhost:3008/vote/[id]
5. Cổng giám khảo      → http://localhost:3008/judge   (email+pass bất kỳ, OTP: 123456)
6. Chấm điểm           → http://localhost:3008/judge/score/dc-003
7. Bảng Admin          → http://localhost:3008/admin   (admin / admin)
```

---

## ❓ Câu hỏi thường gặp

**Q: Dữ liệu tôi nhập có được lưu không?**  
A: Không. Đây là bản demo giả lập hoàn toàn phía frontend. Tất cả dữ liệu sẽ mất khi tải lại trang.

**Q: Tại sao trang Giám khảo không kiểm tra đúng email?**  
A: Đây là thiết kế có chủ đích cho demo. Khi tích hợp Supabase Auth thật, hệ thống sẽ kiểm tra email trong database giám khảo được cấp phép.

**Q: Trang Admin có thật sự bảo vệ bằng mật khẩu không?**  
A: Trang Admin kiểm tra mật khẩu cứng `admin/admin` trong demo. Khi deploy thật, sẽ được thay bằng xác thực Supabase với phân quyền role-based.

**Q: Tôi muốn xem thêm tiết mục để chấm, phải làm sao?**  
A: Hiện demo có 4 tiết mục mẫu. Tiết mục DC-003 và DV-002 là các tiết mục có thể thao tác chấm điểm.

---

*Tài liệu này chỉ dùng cho mục đích thử nghiệm nội bộ.*  
*Liên hệ: btc@nhipbuocvietnam.gov.vn*
