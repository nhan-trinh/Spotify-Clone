# Spotify-clone

## Tính năng

### Đăng ký / Đăng nhập

#### Đăng ký / Đăng nhập bằng Google
- Không cần xác thực email
- Không cần mật khẩu

#### Đăng ký / Đăng nhập với Email và Password

**Yêu cầu mật khẩu:**
- Ít nhất 1 chữ cái
- Ít nhất 1 số hoặc ký tự đặc biệt (ví dụ: # ? ! &)
- Tối thiểu 10 ký tự
- Hash bằng bcrypt / argon2

**Xác thực Email:**
- Gửi OTP qua email để xác thực địa chỉ email thật
- Rate limit đăng nhập: khóa tài khoản sau 5 lần nhập sai

**Bảo mật nâng cao:**
- Xác thực 2 lớp (2FA) — TOTP (Google Authenticator) hoặc OTP qua email

**Sau khi tạo mật khẩu thành công, chuyển sang bước thêm thông tin cá nhân:**

- **Tên (Name):** Tên này sẽ xuất hiện trên profile
- **Ngày sinh (Date of Birth):**
  - Ngày / Tháng / Năm
  - Yêu cầu người dùng phải từ 13 tuổi trở lên mới có thể sử dụng
- **Giới tính (Gender):**
  - Nam (Man)
  - Nữ (Woman)
  - Phi nhị nguyên (Non-binary)
  - Không muốn tiết lộ (Prefer not to say)
  - *(Chúng tôi sử dụng giới tính của bạn để cá nhân hóa đề xuất nội dung và quảng cáo)*

**Sau khi hoàn tất đăng ký → Chuyển đến Trang Home**

---

### Quản lý Tài khoản (Account Settings)
- Đổi mật khẩu
- Quên mật khẩu (Forgot Password) — reset qua email
- Đăng xuất khỏi tất cả thiết bị
- Xóa tài khoản (tuân thủ GDPR)
- Xem lịch sử giao dịch / hóa đơn cá nhân (Invoice)
- Quản lý phương thức thanh toán

---

### Music Player
- Nút Play / Pause, Next, Previous
- Thanh seek (tua nhạc)
- Hiển thị tên bài hát, ảnh cover, tên artist
- Điều chỉnh âm lượng
- Shuffle / Repeat (off / repeat-all / repeat-one)
- Hàng đợi phát (Queue)
- Mini Player — hiển thị khi chuyển sang trang khác
- Crossfade — chuyển bài mượt mà, không bị ngắt tiếng
- Sleep Timer — hẹn giờ tắt nhạc
- Equalizer — chỉnh EQ âm thanh (Bass, Treble, v.v.)
- Phát trên nhiều thiết bị — chuyển thiết bị đang phát nhạc
- Cast to Device — phát lên TV / loa thông minh (Chromecast / AirPlay)

---

### Search & Discovery
- Tìm kiếm bài hát, artist, album, playlist
- Duyệt theo thể loại (Genre)
- Discover Weekly — playlist cá nhân hóa hàng tuần (chọn tối đa 5 thể loại yêu thích)
- Gợi ý theo thể loại
- Trending / Top Charts — bảng xếp hạng nhạc hot

---

### Lyrics (Lời bài hát)
- Hiển thị lời bài hát tĩnh (Free)
- Synced Lyrics — lời bài hát cuộn theo thời gian thực (Premium)

---

### Thư viện cá nhân (Your Library)
- Lưu bài hát yêu thích (Like)
- Tạo / sửa / xóa Playlist
- Collaborative Playlist — nhiều người cùng chỉnh sửa một playlist
- Follow Artist, Album
- Lịch sử nghe gần đây
- Hide Song — ẩn bài hát khỏi một playlist cụ thể trên mọi thiết bị

---

### Social & Chia sẻ
- Chia sẻ bài hát / album / playlist qua link
- Hiển thị trạng thái "Đang nghe" (Now Playing Status) lên profile
- Báo cáo nội dung vi phạm bản quyền hoặc nội dung không phù hợp (Report)

---

### Thông báo (Notifications)
- Thông báo khi artist được follow ra bài hát / album mới
- Thông báo khi có người thêm bài vào Collaborative Playlist
- Thông báo về gói Premium sắp hết hạn

---

### Podcast & Audiobook
- Nghe Podcast, subscribe, download tập
- Comment, Q&A với host
- Nghe Audiobook

---

## Vai Trò

### 1. Người nghe — Free (User)
- Nghe nhạc kèm quảng cáo
- Giới hạn số lần skip mỗi giờ
- Tìm kiếm và khám phá nội dung
- Like bài hát, follow artist / album
- Tạo playlist cá nhân (giới hạn số lượng)
- Xem lyrics tĩnh
- Nghe Podcast
- Chia sẻ bài hát qua link
- Nghe offline: ❌ không hỗ trợ
- Chất lượng âm thanh: Tiêu chuẩn (128kbps)

---

### 2. Người nghe — Premium (User)
- Nghe nhạc **không quảng cáo**
- Unlimited skip
- **Nghe offline** — tải bài hát về thiết bị
- Chất lượng âm thanh cao (320kbps / lossless)
- Synced Lyrics — lời cuộn theo thời gian thực
- Tạo playlist không giới hạn
- Collaborative Playlist
- Equalizer nâng cao
- Crossfade & Sleep Timer
- Chuyển thiết bị đang phát
- Ưu tiên hỗ trợ khách hàng

---

### 3. Artist (Nghệ sĩ)
- Tự upload bài hát, album của mình (không cần qua Admin)
  - Bài hát sau khi upload sẽ ở trạng thái **Pending** — chờ Moderator duyệt trước khi public
- Chỉnh sửa thông tin profile (avatar, mô tả, liên kết mạng xã hội)
- Quản lý bài hát / album của mình
  - Thêm / sửa / xóa bài hát
  - Upload ảnh cover, file audio
  - Cập nhật lyrics, thể loại, ngày phát hành
  - Đặt trạng thái album: Draft / Scheduled / Published / Archived
  - Gắn Co-artist / Featured artist cho từng bài hát
- Xem Analytics cá nhân
  - Lượt nghe theo ngày / tuần / tháng
  - Số lượt follow
  - Top bài hát của mình
  - Doanh thu (nếu có chương trình chia sẻ doanh thu)
- Đăng thông báo / pinned post cho fan
- Tương tác với fan qua Podcast Q&A
- Yêu cầu xác minh tài khoản (Verified Badge) — Admin duyệt

---

### 4. Podcast Host
- Tạo và quản lý Show / Series Podcast
- Upload tập mới (episode)
  - Tiêu đề, mô tả, ảnh cover, file audio
  - Đặt ngày phát hành (Scheduled / Published)
- Chỉnh sửa / xóa tập đã đăng
- Trả lời Q&A và comment từ listener
- Xem thống kê
  - Lượt nghe theo tập / theo thời gian
  - Số lượt subscribe
  - Tương tác (comment, Q&A)
- Có thể là sub-role của Artist hoặc role độc lập

---

### 5. Moderator
- Duyệt bài hát do Artist upload (Pending → Approved / Rejected)
- Xử lý báo cáo vi phạm (Report) từ người dùng
- Cảnh cáo Artist / User vi phạm
- Khóa nội dung vi phạm
- Strike system: 3 lần vi phạm → khóa tài khoản
- Không có quyền chỉnh sửa dữ liệu hệ thống hoặc quản lý Admin

---

### 6. Admin
#### Quản lý nội dung
**Bài hát:**
- Thêm / sửa / xóa bài hát
- Upload ảnh cover, file audio
- Cập nhật bitrate / format
- Thông tin bài hát bao gồm: tên, artist, album, thể loại, thời lượng, lyrics, ngôn ngữ, ngày phát hành, play_count, like_count

**Artist:**
- Tạo / chỉnh sửa hồ sơ nghệ sĩ
- Upload avatar, thêm mô tả
- Liên kết với bài hát / album
- Duyệt và cấp Verified Badge

**Album:**
- Tạo album, gán bài hát vào album
- Đặt ngày phát hành
- Đặt trạng thái: Draft / Scheduled / Published / Archived

**Playlist:**
- Tạo playlist hệ thống (Top 100, Trending, v.v.)
- Feature playlist lên trang chủ
- Ghim playlist

#### Quản lý người dùng
- Xem danh sách User
- Ban / Tạm khóa User
- Reset mật khẩu
- Gán role: User / Artist / Podcast Host / Moderator / Admin
- Xem và xử lý báo cáo nội dung vi phạm (Report)

#### Quản lý Moderator
- Xem danh sách Moderator
- Theo dõi hoạt động kiểm duyệt (số bài duyệt, số report xử lý)
- Thu hồi quyền Moderator

#### Subscription Management
- Tạo và quản lý gói:
  - Free
  - Premium (cá nhân)
  - Premium Duo (2 người)
  - Premium Family (tối đa 6 người)
  - Premium Student (giảm giá)
- Đặt giá từng gói
- Cấu hình Auto-renew (gia hạn tự động)
- Tích hợp thanh toán VNPAY
- Xem lịch sử giao dịch, hoàn tiền nếu cần
- Subscription status:
  - active
  - expired
  - cancelled
  - refunded

#### Cấu hình hệ thống
- Bật / tắt tính năng (Feature Flags)
- Đặt banner thông báo toàn hệ thống
- Chế độ bảo trì (Maintenance Mode)

#### Audit Log
- Ghi lại toàn bộ hành động của Admin và Moderator
- Lọc log theo người dùng, thời gian, loại hành động

#### Analytics & Reporting — Admin Dashboard
- Top bài hát
- Top artist
- Lượt nghe theo ngày / tuần / tháng
- Tăng trưởng người dùng
- Retention rate
- Doanh thu
- Tỷ lệ chuyển đổi Free → Premium
- Báo cáo nội dung vi phạm đang chờ xử lý

### Tech
Frontend:   React + Vite + TypeScript + TailwindCSS
            Zustand + TanStack Query + React Hook Form + Zod
            Howler.js + Socket.IO client + shadcn/ui

Backend:    Node.js + Express + TypeScript
            Prisma ORM

Database:   PostgreSQL (main)
            MongoDB (history, logs)
            Redis (cache, queue, session)

Search:     Meilisearch

Queue:      BullMQ (trên Redis)

Storage:    AWS S3 (audio + image)
            FFmpeg (audio processing worker)

Auth:       JWT + Refresh Token + Redis blacklist

Email:      Resend (production) / Nodemailer (dev)

Realtime:   Socket.IO

Payment:    VNPAY + Webhook

Monitoring: Winston + Sentry