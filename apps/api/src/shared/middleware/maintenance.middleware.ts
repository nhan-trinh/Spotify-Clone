import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { AppError, ErrorCodes } from '../utils/app-error';

export const maintenanceMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check Redis first
    const cacheKey = 'system_settings';
    let settingsRaw = await redis.get(cacheKey);
    let settings: any = {};

    if (settingsRaw) {
      settings = JSON.parse(settingsRaw);
    } else {
      // 2. Fallback to DB
      const dbSettings = await prisma.systemConfig.findMany();
      settings = dbSettings.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      // Cache for 10 minutes
      await redis.setex(cacheKey, 600, JSON.stringify(settings));
    }

    // 3. Logic check
    const isMaintenance = settings.maintenance_mode === true;
    
    // Admin và Moderator luôn được phép vào
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'MODERATOR';

    if (isMaintenance && !isAdmin) {
      // Cho phép các route liên quan đến Auth nếu là Admin (đã check ở trên)
      // Nhưng đối với user thường, chặn hết các route TRỪ trang thông tin hoặc logout
      throw new AppError(
        settings.maintenance_message || 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
        503,
        ErrorCodes.SERVICE_UNAVAILABLE
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
