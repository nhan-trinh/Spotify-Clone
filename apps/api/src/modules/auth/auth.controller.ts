import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

// Controller chỉ nhận request, gọi service, trả response
// Không chứa business logic

export const authController = {
  // POST /api/v1/auth/register
  register: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Đăng ký thành công', 201);
  },

  // POST /api/v1/auth/login
  login: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Đăng nhập thành công');
  },

  // POST /api/v1/auth/logout
  logout: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Đăng xuất thành công');
  },

  // POST /api/v1/auth/refresh
  refresh: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Token đã được làm mới');
  },

  // POST /api/v1/auth/verify-email
  verifyEmail: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Email đã được xác thực');
  },

  // POST /api/v1/auth/resend-otp
  resendOtp: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'OTP đã được gửi lại');
  },

  // POST /api/v1/auth/forgot-password
  forgotPassword: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Email đặt lại mật khẩu đã được gửi');
  },

  // POST /api/v1/auth/reset-password
  resetPassword: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Mật khẩu đã được đặt lại');
  },

  // POST /api/v1/auth/2fa/setup
  setup2FA: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Thiết lập 2FA thành công');
  },

  // POST /api/v1/auth/2fa/verify
  verify2FA: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Xác thực 2FA thành công');
  },

  // GET /api/v1/auth/google
  googleAuth: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement Google OAuth redirect
    res.json({ message: 'Google OAuth — TODO' });
  },

  // GET /api/v1/auth/google/callback
  googleCallback: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // TODO: implement
    sendSuccess(res, null, 'Google OAuth thành công');
  },
};
