# Module: Podcast

## Mô tả
Quản lý Podcast Show, Episode, subscribe, Q&A, thống kê cho Podcast Host.

---

## Business Rules

- Chỉ `podcast_host` mới có thể tạo Show và upload Episode
- Episode sau khi upload có thể đặt lịch phát (`SCHEDULED`) hoặc publish ngay
- **Subscribe**: user follow một Show — nhận notification khi có episode mới
- **Comment / Q&A**: user comment trên episode, Host có thể reply
- Lượt nghe episode tăng khi nghe đủ **30 giây**
- Audio episode cũng được process qua FFmpeg (128kbps)

## API Endpoints

### Shows
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/podcasts/shows` | podcast_host | Tạo Show mới |
| GET | `/podcasts/shows/:id` | all | Chi tiết Show |
| PATCH | `/podcasts/shows/:id` | podcast_host | Cập nhật Show |
| GET | `/podcasts/shows` | all | Duyệt Show |
| POST | `/podcasts/shows/:id/subscribe` | ✅ | Subscribe |
| DELETE | `/podcasts/shows/:id/subscribe` | ✅ | Unsubscribe |

### Episodes
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/podcasts/shows/:id/episodes` | podcast_host | Upload episode |
| GET | `/podcasts/episodes/:id` | all | Chi tiết episode |
| PATCH | `/podcasts/episodes/:id` | podcast_host | Cập nhật |
| DELETE | `/podcasts/episodes/:id` | podcast_host | Xóa episode |
| GET | `/podcasts/episodes/:id/stream` | ✅ | Presigned URL stream |
| POST | `/podcasts/episodes/:id/comments` | ✅ | Đăng comment / Q&A |
| GET | `/podcasts/episodes/:id/comments` | all | Danh sách comment |

### Host Analytics
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/podcasts/me/analytics` | podcast_host | Thống kê Show, Episode |

## File Structure (BE)
```
src/modules/podcast/
├── podcast.router.ts
├── podcast.controller.ts
├── podcast.service.ts
├── podcast.schema.ts
└── podcast.types.ts
```
