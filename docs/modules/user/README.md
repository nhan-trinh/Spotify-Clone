# Module: User

## Mô tả
Quản lý profile, account settings, đổi mật khẩu, xóa tài khoản.

---

## Business Rules

- User chỉ có thể chỉnh sửa **profile của mình**
- Xóa tài khoản → **soft delete** (set `deletedAt`) — dữ liệu giữ nguyên 30 ngày rồi xóa hẳn (GDPR)
- Đổi mật khẩu → phải nhập mật khẩu cũ để xác nhận
- Avatar upload trực tiếp lên S3 qua presigned URL

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/users/me` | ✅ | Lấy thông tin cá nhân |
| PATCH | `/users/me` | ✅ | Cập nhật name, gender, dateOfBirth |
| POST | `/users/me/avatar` | ✅ | Lấy presigned URL upload avatar |
| DELETE | `/users/me` | ✅ | Xóa tài khoản (soft delete) |
| GET | `/users/:id` | ✅ | Xem profile public của user khác |

## File Structure (BE)
```
src/modules/user/
├── user.router.ts
├── user.controller.ts
├── user.service.ts
├── user.schema.ts
└── user.types.ts
```
