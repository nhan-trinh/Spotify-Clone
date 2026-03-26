import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Tất cả admin routes yêu cầu ADMIN role
router.use(authenticate, authorize(Role.ADMIN));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id/role', adminController.changeUserRole);

// Content management
router.patch('/songs/:id', adminController.updateSong);
router.delete('/songs/:id', adminController.deleteSong);
router.post('/genres', adminController.createGenre);
router.patch('/genres/:id', adminController.updateGenre);
router.delete('/genres/:id', adminController.deleteGenre);
router.patch('/artists/:id/verify', adminController.verifyArtist);
router.patch('/playlists/:id/feature', adminController.featurePlaylist);

// Audit & Config
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/config', adminController.getSystemConfig);
router.patch('/config', adminController.updateSystemConfig);

export { router as adminRouter };
