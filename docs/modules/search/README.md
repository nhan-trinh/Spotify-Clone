# Module: Search

## Mô tả
Full-text search bài hát, artist, album, playlist qua Meilisearch. Duyệt theo genre, top charts, discover weekly.

---

## Business Rules

- Chỉ index bài hát có status = **APPROVED**
- Khi bài hát được approve → tự động index vào Meilisearch
- Khi bài hát bị archive / xóa → xóa khỏi index
- **Discover Weekly**: tạo lại mỗi thứ Hai 00:00 bằng BullMQ cron
  - Dựa trên listening history 4 tuần gần nhất (MongoDB)
  - Lấy tối đa 30 bài phù hợp với genre user hay nghe
  - Cache kết quả vào Redis: `cache:discover_weekly:{userId}` (TTL 7 ngày)

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/search?q=&type=song,artist,album,playlist` | ✅ | Tìm kiếm tổng hợp |
| GET | `/search/songs?q=` | ✅ | Tìm bài hát |
| GET | `/search/artists?q=` | ✅ | Tìm artist |
| GET | `/browse/genres` | ✅ | Danh sách genre |
| GET | `/browse/genres/:slug` | ✅ | Bài hát theo genre |
| GET | `/browse/top-charts` | ✅ | Top bài hát (cache 1 giờ) |
| GET | `/browse/discover-weekly` | ✅ | Playlist cá nhân hóa |
| GET | `/browse/trending` | ✅ | Trending (cache 30 phút) |

## Meilisearch Indexes

```
Index: songs
  Fields: id, title, artistName, albumTitle, genre, language, releaseDate
  Searchable: title, artistName, albumTitle
  Filterable: genre, language, status
  Sortable: playCount, releaseDate

Index: artists
  Fields: id, stageName, bio, isVerified
  Searchable: stageName

Index: albums
  Fields: id, title, artistName, releaseDate
  Searchable: title, artistName
```

## File Structure (BE)
```
src/modules/search/
├── search.router.ts
├── search.controller.ts
├── search.service.ts
└── meilisearch.client.ts

src/shared/jobs/
└── discover-weekly.worker.ts
```
