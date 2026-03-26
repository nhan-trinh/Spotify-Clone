# Module: Notification

## Mô tả
Gửi và quản lý thông báo trong app + email qua BullMQ workers.

---

## Business Rules

- Notification lưu trong **MongoDB** collection `notifications`
- Notification mới đẩy realtime qua **Socket.IO**: `notification:new`
- User chỉ thấy notification của **mình**
- Đánh dấu đã đọc: đơn lẻ hoặc tất cả
- Xóa notification: chỉ xóa phía client (soft delete — set `isRead: true`)
- Tối đa **100 notification** lưu, FIFO (xóa cũ khi vượt giới hạn)

## Notification Types

| Type | Trigger | Người nhận |
|---|---|---|
| `song_approved` | Moderator approve bài | Artist |
| `song_rejected` | Moderator reject bài | Artist |
| `new_song` | Artist release bài mới | Followers của Artist |
| `collab_update` | Bài thêm vào Collaborative Playlist | Các collaborator |
| `subscription_expiry` | Sub còn 3 ngày hết hạn | User |
| `subscription_expired` | Sub hết hạn | User |
| `strike_issued` | Nhận strike | User / Artist |
| `account_banned` | Tài khoản bị khóa | User |

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/notifications` | ✅ | Danh sách notification (paginate) |
| PATCH | `/notifications/:id/read` | ✅ | Đánh dấu đã đọc |
| PATCH | `/notifications/read-all` | ✅ | Đánh dấu tất cả đã đọc |
| GET | `/notifications/unread-count` | ✅ | Số thông báo chưa đọc |

## File Structure (BE)
```
src/modules/notification/
├── notification.router.ts
├── notification.controller.ts
├── notification.service.ts
└── notification.types.ts

src/shared/jobs/
├── notification.worker.ts   # Gửi notification hàng loạt
└── email.worker.ts          # Gửi email
```
