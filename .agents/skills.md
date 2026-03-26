# Kỹ năng định hướng cho Agent (Agent Skills)

Trước khi thực hiện các Task, AI Agent phải nạp các Skill/Rules sau để sinh code nhất quán với toàn bộ codebase của Spotify-clone.

## 1. Backend (Node.js & Express & Prisma)
- Luôn tạo Type/Interface ở thư mục `/types` và export dùng chung.
- Bắt buộc phải có `try/catch` (hoặc `express-async-errors`) ở Controller. Format Response chuẩn mẫu:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Lấy danh sách thành công",
    "data": { ...x }
  }
  ```
- **Prisma Best Practices**: 
  - Chỉ `.select` các field cần thiết nhằm tối ưu hoá payload, KHÔNG SELECT toàn bộ Table (Ví dụ: Ẩn field `password` của User).
  - Sử dụng Pagination (limit/offset hoặc cursor-based) ở TẤT CẢ các API GET List.

## 2. Frontend (React Vite + Tailwind + Zustand)
- **Component Design System**: Sử dụng `shadcn/ui` làm core component form, button, input. Nếu tuỳ biến, đổi class qua props `className!` kết hợp `tailwind-merge` (`cn` utility).
- Mọi API call dùng TanStack Query (React Query) với tính năng Caching, Invalidate cache sau khi Mutation.
- **Zustand Store**: Chia nhỏ store, ví dụ `usePlayerStore`, `useAuthStore` thay vì gộp chung một cục khổng lồ.
- **Zod & RHF**: Mọi form từ Đăng nhập tới Upload Song bắt buộc bọc React Hook Form + Resolver Zod để bắt lỗi validate phía Client chuẩn xác trước khi Call API.

## 3. Realtime (Socket.IO) & Background Job
- Event Name Socket phải được khai báo bằng Enum hoặc Constant (`EVENTS.NEW_SONG`, `EVENTS.JOIN_ROOM`).
- Worker (BullMQ) phải cấu hình `concurrency` hợp lý (vd: 3-5 jobs đồng thời tuỳ số Core CPU). 

## 4. Báo lỗi và Monitoring
- Không được `console.log()` rác lên production.
- Hãy bọc Logger wrapper Winston (info, error). 
- Bắn metric / error lớn lên Sentry bằng hàm helper xử lý lỗi chung (Global Error Handler Middleware).
