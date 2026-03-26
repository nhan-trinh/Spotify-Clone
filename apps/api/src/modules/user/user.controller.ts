import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const userController = {
  // GET /api/v1/users/me
  getMe: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'OK');
  },
  // PATCH /api/v1/users/me
  updateMe: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Cập nhật thành công');
  },
  // DELETE /api/v1/users/me
  deleteMe: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Tài khoản đã được xóa');
  },
  // POST /api/v1/users/me/avatar
  uploadAvatar: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Avatar đã được cập nhật');
  },
  // POST /api/v1/users/me/change-password
  changePassword: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Mật khẩu đã được đổi');
  },
  // GET /api/v1/users/me/liked-songs
  getLikedSongs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, [], 'OK');
  },
  // GET /api/v1/users/me/followed-artists
  getFollowedArtists: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, [], 'OK');
  },
  // GET /api/v1/users/:id
  getUserById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'OK');
  },
};
