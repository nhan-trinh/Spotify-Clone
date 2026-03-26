# Module: Album

## Mô tả
Quản lý album — tạo, gán bài hát, đặt trạng thái phát hành.

---

## Business Rules

- Chỉ `artist` mới có thể tạo album của mình
- Album chỉ hiện cho public khi status = **PUBLISHED**
- Bài hát trong album phải thuộc cùng Artist (hoặc Co-artist)
- Trạng thái: `DRAFT → SCHEDULED → PUBLISHED → ARCHIVED`
- **SCHEDULED**: album tự động publish vào `releaseDate` (cron job)

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/albums` | artist | Tạo album mới |
| GET | `/albums/:id` | all | Chi tiết album |
| PATCH | `/albums/:id` | artist, admin | Cập nhật album |
| DELETE | `/albums/:id` | artist, admin | Xóa album |
| POST | `/albums/:id/songs` | artist | Thêm bài hát vào album |
| DELETE | `/albums/:id/songs/:songId` | artist | Xóa bài khỏi album |

## File Structure (BE)
```
src/modules/album/
├── album.router.ts
├── album.controller.ts
├── album.service.ts
├── album.schema.ts
└── album.types.ts
```
