# Module: Moderation

## Mô tả
Kiểm duyệt nội dung do Artist upload, xử lý report từ user, quản lý strike system.

---

## Business Rules

- Bài hát Artist upload → **PENDING** → Moderator duyệt → **APPROVED** hoặc **REJECTED**
- Moderator phải ghi rõ **lý do** khi reject
- Artist nhận notification khi bài được approve / reject
- Report từ user → Moderator xử lý → **RESOLVED** hoặc **DISMISSED**
- **Strike system**: mỗi lần vi phạm = 1 strike
  - **Strike 1**: cảnh cáo, gửi email
  - **Strike 2**: cảnh cáo lần 2, email
  - **Strike 3**: **tự động khóa tài khoản** (isBanned = true)
- Moderator **không có quyền** chỉnh sửa dữ liệu hệ thống, quản lý Admin, hay xem Audit Log
- Mọi hành động của Moderator đều được **ghi vào AuditLog**

---

## API Endpoints

### Moderator

| Method | Path | Role | Mô tả |
|---|---|---|---|
| GET | `/moderation/songs/pending` | moderator | Danh sách bài chờ duyệt |
| POST | `/moderation/songs/:id/approve` | moderator | Duyệt bài hát |
| POST | `/moderation/songs/:id/reject` | moderator | Từ chối bài hát (kèm lý do) |
| GET | `/moderation/reports` | moderator | Danh sách report (filter theo status) |
| POST | `/moderation/reports/:id/resolve` | moderator | Xử lý report xong |
| POST | `/moderation/reports/:id/dismiss` | moderator | Bỏ qua report |
| POST | `/moderation/users/:id/strike` | moderator | Cấp strike cho user / artist |
| POST | `/moderation/users/:id/warn` | moderator | Cảnh cáo không tính strike |
| POST | `/moderation/content/:id/lock` | moderator | Khóa nội dung vi phạm |

---

## Approve / Reject Flow

```
POST /moderation/songs/:id/approve

1. Kiểm tra song status = PENDING
2. Cập nhật Song: status = APPROVED
3. Index bài vào Meilisearch
4. Ghi AuditLog: { action: SONG_APPROVED, actorId, targetId: songId }
5. Notification → Artist: "Bài hát [title] đã được duyệt"
6. Socket emit → artist: moderation:song_approved

─────────────────────────────────

POST /moderation/songs/:id/reject
Body: { reason: string }

1. Kiểm tra song status = PENDING
2. Cập nhật Song: status = REJECTED
3. Ghi AuditLog: { action: SONG_REJECTED, actorId, targetId: songId, metadata: { reason } }
4. Notification → Artist: "Bài hát [title] bị từ chối: [reason]"
5. Socket emit → artist: moderation:song_rejected
```

## Strike Flow

```
POST /moderation/users/:id/strike
Body: { reason: StrikeReason, note?: string }

1. Tạo Strike record
2. Đếm tổng số strike của user
3. Strike 1 hoặc 2:
   - BullMQ: gửi email cảnh cáo
4. Strike 3:
   - Set user.isBanned = true
   - BullMQ: gửi email thông báo khóa
   - Blacklist tất cả Refresh Token của user (Redis)
5. Ghi AuditLog
```

---

## File Structure (BE)

```
src/modules/moderation/
├── moderation.router.ts
├── moderation.controller.ts
├── moderation.service.ts
├── moderation.schema.ts
└── moderation.types.ts
```
