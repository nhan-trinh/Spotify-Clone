import { Router } from 'express';
import { songController } from './song.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', songController.getSongs);
router.get('/:id', songController.getSongById);

// Artist only
router.post('/upload-url', authenticate, authorize(Role.ARTIST), songController.getUploadUrl);
router.post('/', authenticate, authorize(Role.ARTIST), songController.createSong);
router.post('/:id/upload-complete', authenticate, authorize(Role.ARTIST), songController.uploadComplete);
router.patch('/:id', authenticate, authorize(Role.ARTIST, Role.ADMIN), songController.updateSong);
router.delete('/:id', authenticate, authorize(Role.ARTIST, Role.ADMIN), songController.deleteSong);

// Authenticated users
router.post('/:id/like', authenticate, songController.likeSong);
router.delete('/:id/like', authenticate, songController.unlikeSong);
router.post('/:id/hide', authenticate, songController.hideSong);

export { router as songRouter };
