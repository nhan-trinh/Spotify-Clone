// Auth Service — Chứa toàn bộ business logic

export const authService = {
  // TODO: Đăng ký user mới
  // 1. Kiểm tra email đã tồn tại chưa
  // 2. Validate tuổi >= 13
  // 3. Hash password (bcrypt)
  // 4. Tạo user record (Prisma)
  // 5. Gửi OTP qua email (BullMQ)
  register: async () => {
    throw new Error('TODO: implement authService.register');
  },

  // TODO: Đăng nhập
  // 1. Tìm user theo email
  // 2. Kiểm tra rate limit (Redis: max 5 lần / 15 phút)
  // 3. bcrypt.compare password
  // 4. Tạo accessToken + refreshToken (JWT)
  // 5. Lưu refreshToken vào Redis
  login: async () => {
    throw new Error('TODO: implement authService.login');
  },

  // TODO: Đăng xuất
  // 1. Blacklist refreshToken trong Redis (TTL = thời gian còn lại)
  logout: async () => {
    throw new Error('TODO: implement authService.logout');
  },

  // TODO: Refresh access token
  // 1. Verify refreshToken
  // 2. Kiểm tra blacklist Redis
  // 3. Tạo accessToken mới
  // 4. Rotate refreshToken (xóa cũ, tạo mới)
  refreshToken: async () => {
    throw new Error('TODO: implement authService.refreshToken');
  },

  // TODO: Xác thực email bằng OTP
  verifyEmail: async () => {
    throw new Error('TODO: implement authService.verifyEmail');
  },

  // TODO: Gửi lại OTP email
  resendOtp: async () => {
    throw new Error('TODO: implement authService.resendOtp');
  },

  // TODO: Quên mật khẩu — gửi email reset link
  forgotPassword: async () => {
    throw new Error('TODO: implement authService.forgotPassword');
  },

  // TODO: Đặt lại mật khẩu bằng reset token
  resetPassword: async () => {
    throw new Error('TODO: implement authService.resetPassword');
  },

  // TODO: Thiết lập 2FA TOTP
  setup2FA: async () => {
    throw new Error('TODO: implement authService.setup2FA');
  },

  // TODO: Xác thực mã 2FA
  verify2FA: async () => {
    throw new Error('TODO: implement authService.verify2FA');
  },
};
