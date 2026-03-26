import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const albumController = {
  getAlbums: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getAlbumById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  createAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Album đã được tạo', 201); },
  updateAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Album đã được cập nhật'); },
  deleteAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Album đã được xóa'); },
  addSongToAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã thêm bài hát vào album'); },
  removeSongFromAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã xóa bài hát khỏi album'); },
  followAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã follow album'); },
  unfollowAlbum: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã unfollow album'); },
};
