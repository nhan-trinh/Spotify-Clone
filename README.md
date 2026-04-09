# 🎵 RingBeat Music - Ultimate Spotify Clone

**RingBeat** là một nền tảng Music Streaming (Spotify Clone) quy mô toàn diện, mã nguồn mở, được xây dựng với kiến trúc Monorepo hiện đại, tập trung vào trải nghiệm mượt mà, khả năng mở rộng cao và giao diện người dùng cao cấp.

---

## 🚀 Tính năng chính (Key Features)

### 🎼 Trải nghiệm âm nhạc (The Core)
- **High-Quality Streaming**: Nghe nhạc chất lượng cao với thanh Player thông minh (Seek, Shuffle, Repeat, Volume).
- **Home Feed Discovery**: Khám phá nhạc qua các bộ sưu tập: Made For You, Top Hits, Newly Added.
- **Library Management**: Yêu thích bài hát (Like), tạo Playlist cá nhân, theo dõi Nghệ sĩ.

### 🎨 Dành cho Nghệ sĩ (Artist Dashboard)
- **Content Creation**: Tải bài hát trực tiếp lên hệ thống (Audio processing + Image cover).
- **Portfolio Management**: Quản lý Album, bài hát và thông tin tiểu sử.
- **Analytics**: Thống kê số lượt nghe, số người theo dõi và độ phổ biến của bài hát.

### 🛡️ Quản trị & Bảo mật (Admin & Moderation)
- **Moderator Workflow**: Kiểm duyệt nội dung bài hát trước khi được phát hành chính thức.
- **User Management**: Quản lý người dùng, thay đổi vai trò (Artist, Admin, User).
- **Strike System**: Hệ thống xử lý vi phạm bằng cách đánh gậy hoặc khóa tài khoản.
- **System Settings**: Trung tâm điều khiển chế độ bảo trì (Maintenance Mode), thông báo toàn cục (Global Banner) và quản lý bộ nhớ đệm.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### 💻 Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Engine**: [Howler.js](https://howlerjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### ⚙️ Backend
- **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Language**: TypeScript
- **Database**: 
  - [PostgreSQL](https://www.postgresql.org/) (Core data & Relationships) - Prisma ORM
  - [MongoDB](https://www.mongodb.com/) (Play History & Scalable data)
  - [Redis](https://redis.io/) (Caching, Sessions & Background Jobs)
- **Infrastructure**: [Docker](https://www.docker.com/)

---

## 📁 Cấu trúc thư mục (Project Structure)

```bash
RingBeatMusic/
├── apps/
│   ├── web/          # Giao diện người dùng (React/Vite)
│   └── api/          # Hệ thống API chính (Node.js/Express)
├── docker/           # Các tệp cấu hình Docker (DB, Redis, v.v.)
├── docs/             # Tài liệu kiến trúc và hướng dẫn
└── package.json      # npm workspaces configuration
```

---

## 🛠️ Hướng dẫn cài đặt (Installation)

1. **Clone project**:
   ```bash
   git clone https://github.com/yourusername/ringbeat-music.git
   cd ringbeat-music
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình môi trường**:
   - Copy `.env.example` thành `.env` ở cả root và các thư mục `apps/api`, `apps/web`.
   - Cung cấp các thông số Database, Redis, Supabase/S3 secrets.

4. **Khởi chạy hạ tầng (Docker)**:
   ```bash
   docker-compose up -d
   ```

5. **Di cư Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # Để tạo dữ liệu mẫu
   ```

6. **Chạy ứng dụng**:
   - Backend: `npm run dev:api`
   - Frontend: `npm run dev:web`

---

## 📈 Trạng thái dự án (Current Status)

Dự án hiện đang ở **Phase 7 (Admin & Moderation)**. Vui lòng xem tài liệu [task.md](task.md) để biết chi tiết lộ trình 18 Phase tiếp theo.

---

## 📄 Giấy phép (License)

Dự án được thực hiện với mục đích học tập và xây dựng cộng đồng. Vui lòng tôn trọng bản quyền âm nhạc.

---
*Created with ❤️ by Antigravity AI*