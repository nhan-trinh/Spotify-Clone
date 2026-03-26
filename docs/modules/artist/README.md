# Module: Artist

## Mô tả
Hồ sơ nghệ sĩ, analytics cá nhân, verified badge, quản lý nội dung của mình.

---

## Business Rules

- Một User chỉ có **1 Artist profile**
- Artist profile được tạo khi Admin gán role `ARTIST` cho user
- **Verified Badge** chỉ Admin mới cấp — Artist phải gửi yêu cầu
- Artist chỉ thấy analytics của **bài hát / album của mình**
- Doanh thu chia sẻ: tính theo play_count (tính năng mở rộng sau)

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/artists/:id` | all | Profile công khai của Artist |
| PATCH | `/artists/me` | artist | Cập nhật bio, avatar, social links |
| GET | `/artists/me/analytics` | artist | Thống kê cá nhân |
| GET | `/artists/me/songs` | artist | Danh sách bài hát của mình |
| GET | `/artists/me/albums` | artist | Danh sách album của mình |
| POST | `/artists/me/verify-request` | artist | Gửi yêu cầu xác minh |
| GET | `/artists` | all | Tìm / duyệt danh sách Artist |

---

## Analytics Response

```json
{
  "totalPlays": 152000,
  "totalFollowers": 3400,
  "playsByDay": [{ "date": "2025-01-01", "plays": 500 }],
  "topSongs": [{ "songId": "...", "title": "...", "plays": 45000 }]
}
```

## File Structure (BE)
```
src/modules/artist/
├── artist.router.ts
├── artist.controller.ts
├── artist.service.ts
├── artist.schema.ts
└── artist.types.ts
```
