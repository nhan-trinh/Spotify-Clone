import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Tất cả user routes cần auth

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.delete('/me', userController.deleteMe);
router.post('/me/avatar', userController.uploadAvatar);
router.post('/me/change-password', userController.changePassword);
router.get('/me/liked-songs', userController.getLikedSongs);
router.get('/me/followed-artists', userController.getFollowedArtists);
router.get('/:id', userController.getUserById);

export { router as userRouter };
