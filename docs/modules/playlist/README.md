# Module: Playlist

## Mô tả
Playlist cá nhân, playlist hệ thống (Admin), collaborative playlist.

---

## Business Rules

- Free user: tối đa **10 playlist** cá nhân
- Premium user: không giới hạn
- Playlist hệ thống (`isSystem = true`): chỉ Admin tạo và chỉnh sửa
- Collaborative Playlist: owner invite user khác làm collaborator
- Collaborator có thể thêm/xóa bài — không thể xóa playlist
- `Hide Song`: ẩn bài khỏi playlist cụ thể — lưu vào `HiddenSong` (playlistId + songId + userId)
- Khi render playlist → filter ra các bài đã ẩn của user đó
- Thứ tự bài trong playlist lưu bằng `position` field

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/playlists` | ✅ | Playlist của tôi |
| POST | `/playlists` | ✅ | Tạo playlist |
| GET | `/playlists/:id` | ✅ | Chi tiết playlist |
| PATCH | `/playlists/:id` | ✅ | Cập nhật title, cover, visibility |
| DELETE | `/playlists/:id` | ✅ | Xóa playlist |
| POST | `/playlists/:id/songs` | ✅ | Thêm bài vào playlist |
| DELETE | `/playlists/:id/songs/:songId` | ✅ | Xóa bài khỏi playlist |
| PATCH | `/playlists/:id/songs/reorder` | ✅ | Sắp xếp lại bài |
| POST | `/playlists/:id/collaborators` | ✅ | Mời collaborator |
| DELETE | `/playlists/:id/collaborators/:userId` | ✅ | Xóa collaborator |

## File Structure (BE)
```
src/modules/playlist/
├── playlist.router.ts
├── playlist.controller.ts
├── playlist.service.ts
├── playlist.schema.ts
└── playlist.types.ts
```
