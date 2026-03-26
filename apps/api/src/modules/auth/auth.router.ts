import { Router } from 'express';
import { authController } from './auth.controller';

// Auth routes — không cần authenticate (công khai hoặc dùng refreshToken)

const router = Router();

// Đăng ký / Đăng nhập
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

// Xác thực email
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendOtp);

// Quên / Đặt lại mật khẩu
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// 2FA
router.post('/2fa/setup', authController.setup2FA);
router.post('/2fa/verify', authController.verify2FA);

// Google OAuth
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export { router as authRouter };
