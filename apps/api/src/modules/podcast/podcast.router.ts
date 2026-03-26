import { Router } from 'express';
import { podcastController } from './podcast.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/shows', podcastController.getShows);
router.get('/shows/:id', podcastController.getShowById);
router.post('/shows', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.createShow);
router.patch('/shows/:id', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.updateShow);
router.delete('/shows/:id', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.deleteShow);
router.get('/shows/:id/episodes', podcastController.getEpisodes);
router.post('/shows/:id/episodes', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.createEpisode);
router.patch('/shows/:showId/episodes/:id', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.updateEpisode);
router.delete('/shows/:showId/episodes/:id', authenticate, authorize(Role.PODCAST_HOST, Role.ADMIN), podcastController.deleteEpisode);
router.post('/shows/:id/subscribe', authenticate, podcastController.subscribeShow);
router.delete('/shows/:id/subscribe', authenticate, podcastController.unsubscribeShow);

export { router as podcastRouter };
