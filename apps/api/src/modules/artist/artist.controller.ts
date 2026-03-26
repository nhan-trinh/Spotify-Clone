import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const artistController = {
  getArtists: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getArtistById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  getArtistSongs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getArtistAlbums: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getArtistAnalytics: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  updateArtistProfile: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Hồ sơ nghệ sĩ đã được cập nhật'); },
  followArtist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã follow nghệ sĩ'); },
  unfollowArtist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã unfollow nghệ sĩ'); },
  requestVerification: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Yêu cầu xác minh đã được gửi'); },
};
