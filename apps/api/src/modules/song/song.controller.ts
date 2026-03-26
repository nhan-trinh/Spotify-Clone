import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const songController = {
  // GET /api/v1/songs
  getSongs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, [], 'OK');
  },
  // GET /api/v1/songs/:id
  getSongById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'OK');
  },
  // POST /api/v1/songs (Artist)
  createSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Bài hát đã được tạo', 201);
  },
  // PATCH /api/v1/songs/:id (Artist)
  updateSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Bài hát đã được cập nhật');
  },
  // DELETE /api/v1/songs/:id (Artist/Admin)
  deleteSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Bài hát đã được xóa');
  },
  // POST /api/v1/songs/upload-url (Artist) — tạo signed URL Supabase
  getUploadUrl: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, { uploadUrl: '' }, 'OK');
  },
  // POST /api/v1/songs/:id/upload-complete (Artist) — báo upload xong
  uploadComplete: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Đã nhận thông báo upload, đang xử lý audio');
  },
  // POST /api/v1/songs/:id/like
  likeSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Đã thêm vào bài hát yêu thích');
  },
  // DELETE /api/v1/songs/:id/like
  unlikeSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Đã bỏ thích bài hát');
  },
  // POST /api/v1/songs/:id/hide
  hideSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Đã ẩn bài hát');
  },
};
