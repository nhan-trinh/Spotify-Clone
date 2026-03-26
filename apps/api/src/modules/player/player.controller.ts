import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

// Player — quản lý queue, history, realtime playback (Socket.IO)
export const playerController = {
  // GET /api/v1/player/queue
  getQueue: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // PUT /api/v1/player/queue
  setQueue: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Queue đã được cập nhật'); },
  // DELETE /api/v1/player/queue
  clearQueue: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Queue đã được xóa'); },
  // GET /api/v1/player/history
  getHistory: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // POST /api/v1/player/history
  addToHistory: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã thêm vào lịch sử'); },
  // GET /api/v1/player/recently-played
  getRecentlyPlayed: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
};
