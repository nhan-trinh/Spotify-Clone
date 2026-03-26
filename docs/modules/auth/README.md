# Module: Auth

## Mô tả
Xử lý toàn bộ luồng xác thực: đăng ký, đăng nhập, JWT, refresh token, logout, OAuth Google, 2FA, OTP email.

---

## Business Rules

- Email phải unique trong hệ thống
- Mật khẩu tối thiểu 10 ký tự, có ít nhất 1 chữ cái + 1 số hoặc ký tự đặc biệt
- Mật khẩu được hash bằng **bcrypt** (saltRounds = 12)
- Sau khi đăng ký email/password → gửi OTP xác thực email (TTL 10 phút, lưu Redis)
- Tài khoản chưa xác thực email **không thể đăng nhập**
- Rate limit đăng nhập: tối đa **5 lần sai / 15 phút** (lưu Redis key: `login_attempts:{email}`)
- Sau 5 lần sai → set `lockedUntil = now + 15 phút` trên User record
- Access Token hết hạn sau **15 phút**
- Refresh Token hết hạn sau **7 ngày**, lưu Redis: `refresh_token:{userId}` → tokenString
- Khi logout → thêm Refresh Token vào blacklist Redis: `blacklist:{jti}` (TTL = thời gian còn lại)
- Rotate Refresh Token mỗi lần refresh: xóa token cũ, tạo token mới
- User phải **từ 13 tuổi trở lên** (validate dateOfBirth khi đăng ký)
- Đăng ký Google → bỏ qua bước xác thực email, nhưng vẫn cần điền thông tin cá nhân (name, dob, gender)

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Đăng ký email + password |
| POST | `/auth/verify-email` | ❌ | Xác thực OTP email |
| POST | `/auth/resend-otp` | ❌ | Gửi lại OTP |
| POST | `/auth/login` | ❌ | Đăng nhập email + password |
| POST | `/auth/google` | ❌ | Đăng nhập / đăng ký qua Google |
| POST | `/auth/refresh` | ❌ | Lấy Access Token mới |
| POST | `/auth/logout` | ✅ | Logout, blacklist Refresh Token |
| POST | `/auth/logout-all` | ✅ | Logout khỏi tất cả thiết bị |
| POST | `/auth/forgot-password` | ❌ | Gửi OTP reset mật khẩu |
| POST | `/auth/reset-password` | ❌ | Đặt lại mật khẩu bằng OTP |
| POST | `/auth/change-password` | ✅ | Đổi mật khẩu khi đã đăng nhập |
| POST | `/auth/2fa/enable` | ✅ | Bật 2FA (trả về QR code TOTP) |
| POST | `/auth/2fa/verify` | ✅ | Xác nhận mã TOTP để kích hoạt 2FA |
| POST | `/auth/2fa/disable` | ✅ | Tắt 2FA |
| POST | `/auth/2fa/validate` | ❌ | Nhập mã 2FA sau khi login |

---

## Luồng Đăng ký (Email)

```
1. POST /auth/register
   Body: { email, password, name, dateOfBirth, gender }

2. Validate Zod schema
3. Kiểm tra email đã tồn tại chưa
4. Validate tuổi >= 13
5. Hash password (bcrypt)
6. Tạo User record (isEmailVerified: false)
7. Tạo OTP (6 số, TTL 10 phút) → lưu Redis: otp:{email}
8. BullMQ: gửi email chứa OTP
9. Trả về { message: "Vui lòng kiểm tra email để xác thực" }

10. POST /auth/verify-email
    Body: { email, otp }
11. So sánh OTP với Redis
12. Set isEmailVerified: true
13. Xóa OTP khỏi Redis
14. Trả về { accessToken, refreshToken }
```

---

## Luồng Đăng nhập (Email)

```
1. POST /auth/login
   Body: { email, password }

2. Validate Zod
3. Kiểm tra lockedUntil — nếu còn bị khóa → trả lỗi
4. Tìm User theo email
5. Nếu user không tồn tại → tăng loginAttempts (Redis) → trả lỗi chung
6. Kiểm tra isEmailVerified
7. So sánh password (bcrypt.compare)
8. Nếu sai → tăng loginAttempts
   - Nếu >= 5 → set lockedUntil = now + 15 phút
9. Reset loginAttempts khi đăng nhập đúng
10. Nếu user bật 2FA → trả về { requiresTwoFactor: true, tempToken }
11. Nếu không có 2FA → tạo Access Token + Refresh Token → trả về
```

---

## JWT Payload

```ts
// Access Token
{
  sub: string,      // userId
  role: Role,
  jti: string,      // unique token ID
  iat: number,
  exp: number,      // +15 phút
}

// Refresh Token
{
  sub: string,      // userId
  jti: string,
  iat: number,
  exp: number,      // +7 ngày
}
```

---

## File Structure (BE)

```
src/modules/auth/
├── auth.router.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.schema.ts      # Zod schemas
└── auth.types.ts
```

---

## Dependencies
- `bcrypt` — hash password
- `jsonwebtoken` — tạo và verify JWT
- `speakeasy` — TOTP cho 2FA
- `qrcode` — generate QR code 2FA
- Redis — lưu OTP, refresh token, blacklist, login attempts
- BullMQ `email` queue — gửi OTP qua email
