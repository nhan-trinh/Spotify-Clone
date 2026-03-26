import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const podcastController = {
  getShows: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getShowById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  createShow: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Show đã được tạo', 201); },
  updateShow: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Show đã được cập nhật'); },
  deleteShow: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Show đã được xóa'); },
  getEpisodes: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  createEpisode: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Episode đã được tạo', 201); },
  updateEpisode: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Episode đã được cập nhật'); },
  deleteEpisode: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Episode đã được xóa'); },
  subscribeShow: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã subscribe show'); },
  unsubscribeShow: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã unsubscribe show'); },
};
