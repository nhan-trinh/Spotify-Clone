# Task: Phase 16 - Community Reporting & Moderation

*Tính năng cho phép người dùng báo cáo nội dung vi phạm và Admin xử lý các báo cáo đó.*

## 1. Backend: Cổng Báo Cáo (Reporting API)
- [ ] Cập nhật Prisma Schema: Mở rộng model `Report` để hỗ trợ `playlistId`, `artistId`, `albumId`.
- [ ] Cập nhật `SongStatus`: Thêm trạng thái `REMOVED` hoặc `BANNED`.
- [ ] Create `ReportModule`:
    - [ ] `POST /reports`: Endpoint cho user báo cáo (có rate limit).
    - [ ] Logic tự động đánh dấu bài hát là PENDING nếu đạt ngưỡng báo cáo (tùy chọn).
- [ ] Create `Admin/ModerationModule`:
    - [ ] `GET /admin/reports`: Lấy danh sách báo cáo (phân trang, filter theo loại).
    - [ ] `PATCH /admin/reports/:id`: Xử lý báo cáo (RESOLVED/DISMISSED).
    - [ ] `POST /admin/strikes`: Hệ thống cảnh cáo (Strikes) tích hợp khi xử lý báo cáo.

## 2. Frontend: Giao Diện Báo Cáo (Reporting UI)
- [ ] Tích hợp nút "Báo cáo" vào `SongContextMenu` và `PlaylistContextMenu`.
- [ ] Xây dựng `ReportModal`:
    - [ ] Danh sách lý do (Spam, Vi phạm bản quyền, Nội dung không phù hợp...).
    - [ ] Ô nhập mô tả chi tiết.
- [ ] Tích hợp thông báo Toast khi báo cáo xong.

## 3. Quản Trị: Admin Reports Dashboard
- [ ] Xây dựng trang `Reports Management` trong Admin Panel.
- [ ] Danh sách báo cáo với thông tin chi tiết:
    - [ ] Ai báo cáo? 
    - [ ] Báo cáo cái gì? (Link tới bài hát/playlist).
    - [ ] Lý do?
- [ ] Các hành động xử lý:
    - [ ] **Bỏ qua**: Đánh dấu đã giải quyết nhưng không làm gì.
    - [ ] **Gỡ bỏ**: Chuyển trạng thái nội dung sang `REJECTED/ARCHIVED`.
    - [ ] **Cảnh cáo**: Gửi Strike cho Artist.
