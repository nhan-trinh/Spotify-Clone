import { Router } from 'express';
import { playerController } from './player.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/queue', playerController.getQueue);
router.put('/queue', playerController.setQueue);
router.delete('/queue', playerController.clearQueue);
router.get('/history', playerController.getHistory);
router.post('/history', playerController.addToHistory);
router.get('/recently-played', playerController.getRecentlyPlayed);

export { router as playerRouter };
