import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export { router as notificationRouter };
