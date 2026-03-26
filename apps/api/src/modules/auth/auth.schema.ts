import { z } from 'zod';

// Schema validation cho module Auth

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(10, 'Mật khẩu phải có ít nhất 10 ký tự')
      .regex(/[a-zA-Z]/, 'Mật khẩu phải có ít nhất 1 chữ cái')
      .regex(/[0-9!@#$%^&*?]/, 'Mật khẩu phải có ít nhất 1 số hoặc ký tự đặc biệt'),
    name: z.string().min(1, 'Tên không được để trống'),
    dateOfBirth: z.string().datetime({ message: 'Ngày sinh không hợp lệ' }),
    gender: z.enum(['man', 'woman', 'non-binary', 'prefer_not_to_say']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token không được để trống'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, 'OTP phải có 6 ký tự'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z
      .string()
      .min(10, 'Mật khẩu phải có ít nhất 10 ký tự')
      .regex(/[a-zA-Z]/, 'Phải có ít nhất 1 chữ cái')
      .regex(/[0-9!@#$%^&*?]/, 'Phải có ít nhất 1 số hoặc ký tự đặc biệt'),
  }),
});

export const verify2FASchema = z.object({
  body: z.object({
    token: z.string().min(1),
    code: z.string().length(6),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type Verify2FAInput = z.infer<typeof verify2FASchema>['body'];
