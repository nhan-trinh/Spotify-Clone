# Module: Player

## Mô tả
Quản lý hàng đợi phát nhạc, lịch sử nghe, đồng bộ trạng thái realtime qua Socket.IO giữa các thiết bị.

---

## Business Rules

- Queue của user lưu trong **Redis** (TTL 24 giờ): `queue:{userId}`
- Lịch sử nghe lưu trong **MongoDB** collection `listening_history`
- `playCount` của bài hát tăng khi user nghe đủ **30 giây liên tục**
- Recently played lưu tối đa **50 bài**, FIFO — MongoDB collection `recently_played`
- Free user: bị **giới hạn skip** — tối đa 6 lần skip / giờ (lưu Redis: `skip_count:{userId}`)
- Premium user: unlimited skip
- Khi user mở app trên thiết bị mới → sync queue + trạng thái từ Redis về client
- Một user có thể phát nhạc trên **nhiều thiết bị**, thiết bị mới active sẽ pause thiết bị cũ

---

## Socket.IO Events

### Client → Server

| Event | Payload | Mô tả |
|---|---|---|
| `player:play` | `{ songId, position }` | Bắt đầu phát bài |
| `player:pause` | `{ position }` | Tạm dừng |
| `player:seek` | `{ position }` | Tua đến thời điểm |
| `player:next` | — | Chuyển bài tiếp |
| `player:prev` | — | Quay lại bài trước |
| `player:queue_add` | `{ songId, insertAt? }` | Thêm bài vào queue |
| `player:queue_remove` | `{ index }` | Xóa bài khỏi queue |
| `player:queue_reorder` | `{ from, to }` | Sắp xếp lại queue |
| `player:progress` | `{ songId, position }` | Báo tiến độ nghe (mỗi 5 giây) |
| `player:device_switch` | `{ deviceId }` | Chuyển sang thiết bị khác |

### Server → Client

| Event | Payload | Mô tả |
|---|---|---|
| `player:state_sync` | `{ queue, currentSong, position, isPlaying }` | Đồng bộ toàn bộ trạng thái |
| `player:song_changed` | `{ song, position }` | Bài hát đổi |
| `player:paused` | `{ position }` | Bị pause (do thiết bị khác active) |
| `player:queue_updated` | `{ queue }` | Queue thay đổi (collaborative) |
| `player:skip_limit` | `{ remaining, resetAt }` | Cảnh báo sắp hết lượt skip (Free) |

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/player/queue` | ✅ | Lấy queue hiện tại |
| POST | `/player/queue` | ✅ | Thêm bài vào queue |
| DELETE | `/player/queue/:index` | ✅ | Xóa bài khỏi queue |
| GET | `/player/history` | ✅ | Lịch sử nghe (MongoDB) |
| GET | `/player/recently-played` | ✅ | Bài nghe gần đây |
| POST | `/player/play-count` | ✅ | Ghi nhận lượt nghe (gọi sau 30s) |

---

## Redis Keys

```
queue:{userId}              → JSON array of songIds (TTL 24h)
skip_count:{userId}         → number (TTL reset mỗi giờ)
player_state:{userId}       → { currentSongId, position, isPlaying, deviceId }
active_device:{userId}      → deviceId đang active
```

---

## File Structure (BE)

```
src/modules/player/
├── player.router.ts
├── player.controller.ts
├── player.service.ts
├── player.schema.ts
└── player.types.ts

src/shared/socket/
├── socket.server.ts        # Khởi tạo Socket.IO
├── handlers/
│   └── player.handler.ts   # Xử lý tất cả player events
└── middleware/
    └── socket.auth.ts      # Xác thực socket connection bằng JWT
```

---

## File Structure (FE)

```
src/modules/player/
├── components/
│   ├── PlayerBar.tsx        # Full player bar bottom
│   ├── MiniPlayer.tsx       # Mini player khi chuyển trang
│   ├── QueuePanel.tsx       # Panel hàng đợi
│   ├── LyricsPanel.tsx      # Panel lời bài hát
│   └── VolumeControl.tsx
├── hooks/
│   ├── usePlayer.ts         # Hook chính — gọi Zustand store
│   ├── useQueue.ts
│   └── useSocket.ts         # Socket.IO connection
├── stores/
│   └── player.store.ts      # Zustand store
└── audio/
    └── howler.ts            # Howler.js setup
```
