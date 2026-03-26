import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const moderationController = {
  // GET /api/v1/moderation/pending-songs
  getPendingSongs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // PATCH /api/v1/moderation/songs/:id/approve
  approveSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Bài hát đã được duyệt'); },
  // PATCH /api/v1/moderation/songs/:id/reject
  rejectSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Bài hát đã bị từ chối'); },
  // GET /api/v1/moderation/reports
  getReports: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // POST /api/v1/moderation/reports
  createReport: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Report đã được gửi', 201); },
  // PATCH /api/v1/moderation/reports/:id/resolve
  resolveReport: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Report đã được xử lý'); },
  // PATCH /api/v1/moderation/reports/:id/dismiss
  dismissReport: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Report đã được bỏ qua'); },
  // POST /api/v1/moderation/users/:id/strike
  issueStrike: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã cảnh cáo tài khoản'); },
};
