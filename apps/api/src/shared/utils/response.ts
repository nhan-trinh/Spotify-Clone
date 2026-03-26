import { Response } from 'express';

// Response format chuẩn theo CLAUDE.md

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Gửi response thành công
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

// Gửi response lỗi
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode = 400
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
