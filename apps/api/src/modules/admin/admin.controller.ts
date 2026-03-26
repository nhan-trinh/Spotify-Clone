import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const adminController = {
  // Dashboard stats
  getDashboardStats: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },

  // User management
  getUsers: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getUserById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  banUser: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Tài khoản đã bị khóa'); },
  unbanUser: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Tài khoản đã được mở khóa'); },
  changeUserRole: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Role đã được thay đổi'); },

  // Content management
  updateSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Bài hát đã được cập nhật'); },
  deleteSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Bài hát đã được xóa'); },
  createGenre: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Thể loại đã được tạo', 201); },
  updateGenre: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Thể loại đã được cập nhật'); },
  deleteGenre: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Thể loại đã được xóa'); },
  verifyArtist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Nghệ sĩ đã được xác minh'); },
  featurePlaylist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Playlist đã được ghim'); },

  // Audit logs
  getAuditLogs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },

  // System config
  getSystemConfig: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, {}, 'OK'); },
  updateSystemConfig: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Cấu hình đã được cập nhật'); },
};
