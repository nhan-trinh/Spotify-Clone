# Ngữ cảnh Agent (Agent Context)

Đây là tài liệu chỉ dẫn hướng đi Business cốt lõi để các đặc vụ AI Agent hiểu rõ dự án "Spotify-clone" trước khi tham gia viết code hoặc chỉnh sửa architecture.

## 1. Bản chất hệ thống
- Hệ thống là một nền tảng âm nhạc đa người dùng (Multi-tenant), cho phép cả người dùng thường (nghe nhạc) và nghệ sĩ (đăng tải nhạc) cùng hoạt động qua một Client chung (Hoặc Admin portal).
- Tốc độ là yếu tố tiên quyết. Trải nghiệm phát nhạc (Player) không bao giờ được phép giật lag kể cả khi User điều hướng sang Menu/Trang khác.
- Phải phân định rạch ròi luồng Free (có quảng cáo, mờ tính năng, 128kbps) và luồng Premium (Trải nghiệm hoàn hảo, 320kbps).

## 2. Điểm nóng Kỹ thuật (Technical Hotspots)
- **Player Component**: Cần nằm ngoài thẻ `<Routes />` của React Router (hoặc bọc ở Layout cao nhất) để không bị unmount khi đổi trang. Global State (Zustand) chứa âm lượng, tiến trình chạy (progress), playlist hiện tại.
- **Audio Processing**: Không upload trực tiếp MP3 lên là nghe ngay. File sẽ vào AWS S3 -> đẩy Job sang BullMQ -> Worker dùng FFmpeg cắt file, tạo HLS Playlist (.m3u8), resize ảnh Cover -> Hoàn thành Job bắn Socket báo cho Client.
- **Bảo vệ Audio**: Hạn chế User dùng IDM hoặc tool bắt link MP3 tải trộm bài hát. Mọi audio serve ở dạng Stream/Chunks có Token Signed (Time-based link) qua CDN hoặc API.

## 3. Data Integrity & Security (Tính toàn vẹn Dữ liệu)
- **Delete Policy**: Không áp dụng Hard Delete bài hát/Tài khoản để đảm bảo Lịch sử (History Logs) luôn map đúng ID. Thay vào đó dùng Soft Delete (Trường `deletedAt` hoặc `status: archived/banned`).
- Xác thực 2 bước 2FA là quan trọng với Artist/Admin profile.
- API lấy danh sách bài hát Playlist CỦA TÔI phải luôn verify qua Access Token (`user_id`), tuyệt đối không được truyền `?user_id=123` trên URL.
