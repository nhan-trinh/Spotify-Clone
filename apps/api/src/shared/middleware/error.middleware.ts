import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ErrorCodes } from '../utils/app-error';

// Global error handler — mount cuối cùng trong app.ts
// Xử lý tất cả lỗi throw qua next(error) hoặc async route handler
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Lỗi Zod validation
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Dữ liệu đầu vào không hợp lệ',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Lỗi nghiệp vụ (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Lỗi không xác định — không lộ thông tin nhạy cảm
  console.error('❌ Lỗi không xác định:', err);
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'Lỗi hệ thống nội bộ',
    },
  });
};
