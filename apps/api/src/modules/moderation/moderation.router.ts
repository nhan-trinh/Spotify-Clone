import { Router } from 'express';
import { moderationController } from './moderation.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Bất kỳ user đã đăng nhập đều có thể report
router.post('/reports', authenticate, moderationController.createReport);

// Chỉ Moderator và Admin
const modGuard = [authenticate, authorize(Role.MODERATOR, Role.ADMIN)];

router.get('/pending-songs', ...modGuard, moderationController.getPendingSongs);
router.patch('/songs/:id/approve', ...modGuard, moderationController.approveSong);
router.patch('/songs/:id/reject', ...modGuard, moderationController.rejectSong);
router.get('/reports', ...modGuard, moderationController.getReports);
router.patch('/reports/:id/resolve', ...modGuard, moderationController.resolveReport);
router.patch('/reports/:id/dismiss', ...modGuard, moderationController.dismissReport);
router.post('/users/:id/strike', ...modGuard, moderationController.issueStrike);

export { router as moderationRouter };
