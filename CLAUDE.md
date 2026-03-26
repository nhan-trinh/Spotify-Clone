# CLAUDE.md — Spotify Clone Agent Context

> Đây là file context chính cho AI agent. Đọc file này trước khi làm bất kỳ task nào.
> Không cần đọc toàn bộ codebase — mỗi module có file .md riêng, đọc đúng module liên quan.

---

## Project Overview

**Tên:** Spotify Clone  
**Mục tiêu:** Web app nghe nhạc, podcast, audiobook — tương tự Spotify  
**Ngôn ngữ:** Vietnamese (UI + comments + docs đều viết tiếng Việt)

---

## Tech Stack

### Frontend
- React 18 + Vite + TypeScript
- TailwindCSS + shadcn/ui
- Zustand (global state)
- TanStack Query / React Query (server state + cache)
- React Hook Form + Zod (form validation)
- Howler.js (audio engine)
- Socket.IO client (realtime)
- Day.js (date/time)
- react-dropzone (file upload)

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL (DB chính)
- MongoDB (listening history, notifications, logs)
- Redis (cache, session, queue, blacklist token)
- BullMQ (job queue — chạy trên Redis)
- Socket.IO server (realtime)
- FFmpeg (audio processing)
- Nodemailer / Resend (email)

### Storage
- Supabase — audio files, cover images
- Cloudinary — avatar, thumbnail (optional)

### Auth
- JWT Access Token (15 phút)
- Refresh Token (7 ngày, lưu Redis)
- Blacklist token khi logout (Redis)
- 2FA — TOTP hoặc OTP email

### Payment
- VNPAY (subscription)

### Search
- Meilisearch (full-text search bài hát, artist, album, playlist)

### Monitoring
- Winston + Morgan (logging)
- Sentry (error tracking)

---

## Vai Trò (Roles)

| Role | Mô tả |
|---|---|
| `user_free` | Người nghe nhạc miễn phí |
| `user_premium` | Người nghe nhạc có trả phí |
| `artist` | Nghệ sĩ — upload và quản lý nhạc của mình |
| `podcast_host` | Host podcast — upload và quản lý show |
| `moderator` | Kiểm duyệt nội dung, xử lý report |
| `admin` | Quản trị toàn hệ thống |

---

## Module Map

Mỗi module có file tài liệu tại `docs/modules/<tên-module>/README.md`

| Module | File | Mô tả ngắn |
|---|---|---|
| auth | `modules/auth/README.md` | Đăng ký, đăng nhập, JWT, 2FA, OAuth Google |
| user | `modules/user/README.md` | Profile, settings, account, subscription status |
| song | `modules/song/README.md` | CRUD bài hát, upload audio, lyrics, trạng thái |
| album | `modules/album/README.md` | CRUD album, gán bài hát, trạng thái phát hành |
| artist | `modules/artist/README.md` | Hồ sơ nghệ sĩ, analytics, verified badge |
| playlist | `modules/playlist/README.md` | Playlist cá nhân, hệ thống, collaborative |
| player | `modules/player/README.md` | Queue, history, realtime playback, Socket.IO |
| search | `modules/search/README.md` | Full-text search, Meilisearch, genre filter |
| subscription | `modules/subscription/README.md` | Gói Free/Premium, VNPAY, billing |
| podcast | `modules/podcast/README.md` | Show, episode, subscribe, Q&A |
| notification | `modules/notification/README.md` | Push notification, email, BullMQ |
| moderation | `modules/moderation/README.md` | Duyệt nội dung, report, strike system |
| admin | `modules/admin/README.md` | Dashboard, quản lý user, audit log, config |

---

## Folder Structure

```
spotify-clone/
├── apps/
│   ├── web/                        # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── components/         # Shared UI components
│   │   │   ├── pages/              # Route pages
│   │   │   ├── modules/            # Feature modules (mirror BE)
│   │   │   ├── stores/             # Zustand stores
│   │   │   ├── hooks/              # Custom hooks
│   │   │   ├── services/           # API call functions
│   │   │   ├── lib/                # Utils, helpers, config
│   │   │   └── types/              # TypeScript types/interfaces
│   │   └── ...
│   └── api/                        # Backend Express
│       ├── src/
│       │   ├── modules/            # Feature modules
│       │   │   ├── auth/
│       │   │   │   ├── auth.router.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.schema.ts  # Zod validation
│       │   │   │   └── auth.types.ts
│       │   │   ├── user/
│       │   │   ├── song/
│       │   │   └── ... (mỗi module cấu trúc tương tự)
│       │   ├── shared/
│       │   │   ├── middleware/     # auth, role, rate-limit, error
│       │   │   ├── utils/          # helpers, jwt, bcrypt, s3, etc.
│       │   │   ├── jobs/           # BullMQ workers
│       │   │   ├── socket/         # Socket.IO handlers
│       │   │   └── config/         # env, db, redis, s3 config
│       │   ├── prisma/
│       │   │   ├── schema.prisma
│       │   │   └── migrations/
│       │   └── app.ts
│       └── ...
├── docs/                           # Toàn bộ tài liệu AI context
│   ├── CLAUDE.md                   # File này — đọc đầu tiên
│   ├── ARCHITECTURE.md             # Kiến trúc tổng thể
│   ├── SCHEMA.md                   # Database schema ERD text
│   └── modules/                    # Docs từng module
└── ...
```

---

## Coding Conventions

### Chung
- Dùng TypeScript strict mode
- Tất cả function phải có return type rõ ràng
- Không dùng `any` — dùng `unknown` nếu cần
- Tên biến, hàm: camelCase
- Tên file: kebab-case
- Tên type/interface: PascalCase

### Backend (Express)
- Mỗi module gồm: `router → controller → service → repository (Prisma)`
- Controller chỉ nhận request, gọi service, trả response — không chứa business logic
- Service chứa toàn bộ business logic
- Tất cả error phải throw qua `AppError` class, xử lý tập trung ở global error handler
- Validate input bằng Zod schema trước khi vào controller
- Response format chuẩn:
```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```
- Error format chuẩn:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không đúng"
  }
}
```

### Frontend (React)
- Mỗi feature module có folder riêng trong `src/modules/`
- Dùng TanStack Query cho tất cả API call — không fetch trực tiếp trong component
- Zustand chỉ lưu global UI state (player, sidebar, theme) — không lưu server data
- Component không gọi API trực tiếp — gọi qua custom hook
- Tất cả form dùng React Hook Form + Zod

---

## Business Rules Tóm tắt

- User phải **13 tuổi trở lên** mới được đăng ký
- Tài khoản bị **khóa sau 5 lần đăng nhập sai**
- Bài hát Artist upload → trạng thái **Pending** → Moderator duyệt → **Approved/Rejected**
- **3 lần vi phạm** (strike) → tự động khóa tài khoản
- Free user: nghe **có quảng cáo**, giới hạn skip, chất lượng 128kbps
- Premium user: không quảng cáo, offline, 320kbps, synced lyrics
- Access Token hết hạn sau **15 phút**, Refresh Token sau **7 ngày**
- Refresh Token bị **blacklist ngay khi logout**

---

## Hướng dẫn cho AI Agent

1. **Khi nhận task liên quan đến module nào → đọc `docs/modules/<module>/README.md` trước**
2. **Khi cần biết schema DB → đọc `docs/SCHEMA.md`**
3. **Khi cần biết kiến trúc tổng → đọc `docs/ARCHITECTURE.md`**
4. Không tự suy đoán business rule — kiểm tra trong module README
5. Luôn giữ đúng response format chuẩn định nghĩa ở trên
6. Không tạo file ngoài folder structure đã định nghĩa
7. Khi tạo API mới → cập nhật module README tương ứng
