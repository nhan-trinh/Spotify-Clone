import { Request, Response } from 'express';
import { catchAsync } from '../../shared/utils/catch-async';
import { sendSuccess } from '../../shared/utils/response';
import { HomeService } from './home.service';

export const homeController = {
  getFeed: catchAsync(async (_req: Request, res: Response) => {
    const data = await HomeService.getFeed();
    sendSuccess(res, data, 'Lấy dữ liệu trang chủ thành công');
  }),
};
