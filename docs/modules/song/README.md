# Module: Song

## Mô tả
Quản lý bài hát: upload audio, metadata, lyrics, trạng thái kiểm duyệt, stream audio theo gói subscription.

---

## Business Rules

- Chỉ `artist` mới có thể upload bài hát
- Bài hát sau khi upload → trạng thái **PENDING**, chờ Moderator duyệt
- Bài hát chỉ **public** khi status = **APPROVED**
- Audio được xử lý thành 2 bản: **128kbps** (Free) và **320kbps** (Premium)
- Free user chỉ được stream `audioUrl128`
- Premium user được stream `audioUrl320`
- Stream URL là **presigned S3 URL** (TTL 1 giờ) — không expose URL thật
- `playCount` tăng 1 khi user nghe đủ **30 giây**
- `likeCount` cập nhật khi user like/unlike
- Artist có thể **xóa bài** của mình — bài bị xóa không còn xuất hiện trong playlist, queue
- Admin có thể xóa / archive bất kỳ bài hát nào

---

## Trạng thái bài hát

```
[Artist upload]
      │
      ▼
   PENDING  ──(Moderator reject)──► REJECTED
      │
      │ (Moderator approve)
      ▼
   APPROVED ──(Admin/Artist archive)──► ARCHIVED
```

---

## API Endpoints

| Method | Path | Role | Mô tả |
|---|---|---|---|
| POST | `/songs` | artist | Upload bài hát mới |
| GET | `/songs/:id` | all | Lấy thông tin bài hát |
| PATCH | `/songs/:id` | artist, admin | Cập nhật metadata |
| DELETE | `/songs/:id` | artist, admin | Xóa bài hát |
| GET | `/songs/:id/stream` | user | Lấy presigned URL để stream |
| GET | `/songs/:id/lyrics` | user | Lấy lyrics (synced nếu premium) |
| GET | `/songs` | admin | Danh sách tất cả bài hát (filter, paginate) |
| GET | `/songs/artist/:artistId` | all | Bài hát của artist |
| POST | `/songs/:id/like` | user | Like bài hát |
| DELETE | `/songs/:id/like` | user | Unlike bài hát |
| POST | `/songs/:id/hide` | user | Ẩn bài hát khỏi playlist |
| DELETE | `/songs/:id/hide` | user | Bỏ ẩn bài hát |
| POST | `/songs/:id/play` | user | Ghi nhận lượt nghe (sau 30 giây) |

---

## Upload Flow

```
1. FE gọi POST /songs — gửi metadata (title, genreId, albumId, releaseDate...)
2. BE tạo Song record (status: PENDING, audioUrl128: null, audioUrl320: null)
3. BE gọi S3 tạo presigned upload URL
4. Trả về { songId, uploadUrl }

5. FE dùng uploadUrl upload thẳng lên S3 (không qua BE)
6. FE gọi POST /songs/:id/upload-complete (báo BE xong)

7. BE đẩy job vào BullMQ queue: "audio-processing" { songId, s3Key }
8. Worker xử lý:
   - Download từ S3
   - FFmpeg convert → 128kbps + 320kbps
   - Upload lại S3
   - Extract duration, format
   - Cập nhật Song record: audioUrl128, audioUrl320, duration
9. Thông báo Moderator có bài mới cần duyệt (notification)
```

---

## Stream Audio

```
GET /songs/:id/stream?quality=128|320

1. Kiểm tra song status = APPROVED
2. Kiểm tra role user:
   - FREE → chỉ cho phép quality=128
   - PREMIUM → cho phép quality=128 hoặc 320
3. Lấy S3 key tương ứng
4. Tạo presigned URL (TTL 1 giờ)
5. Trả về { streamUrl, expiresAt }
```

---

## File Structure (BE)

```
src/modules/song/
├── song.router.ts
├── song.controller.ts
├── song.service.ts
├── song.schema.ts
└── song.types.ts
```

---

## Dependencies
- AWS S3 SDK — presigned URL
- BullMQ `audio-processing` queue
- Prisma — CRUD Song, LikedSong, HiddenSong
- Meilisearch — index bài hát sau khi APPROVED
