import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const notificationController = {
  // GET /api/v1/notifications
  getNotifications: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // PATCH /api/v1/notifications/:id/read
  markAsRead: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã đánh dấu đã đọc'); },
  // PATCH /api/v1/notifications/read-all
  markAllAsRead: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã đánh dấu tất cả đã đọc'); },
  // DELETE /api/v1/notifications/:id
  deleteNotification: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã xóa thông báo'); },
};
