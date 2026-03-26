import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const subscriptionController = {
  getMySubscription: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  getPlans: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  createPayment: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, { paymentUrl: '' }, 'URL thanh toán đã được tạo'); },
  vnpayReturn: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { res.redirect('/'); },
  vnpayWebhook: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { res.json({ RspCode: '00', Message: 'Confirm Success' }); },
  cancelSubscription: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã hủy gói'); },
  getInvoices: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
};
