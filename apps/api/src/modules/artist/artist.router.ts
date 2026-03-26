import { Router } from 'express';
import { artistController } from './artist.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.get('/:id/songs', artistController.getArtistSongs);
router.get('/:id/albums', artistController.getArtistAlbums);
router.get('/:id/analytics', authenticate, authorize(Role.ARTIST, Role.ADMIN), artistController.getArtistAnalytics);
router.patch('/me', authenticate, authorize(Role.ARTIST), artistController.updateArtistProfile);
router.post('/:id/follow', authenticate, artistController.followArtist);
router.delete('/:id/follow', authenticate, artistController.unfollowArtist);
router.post('/me/request-verification', authenticate, authorize(Role.ARTIST), artistController.requestVerification);

export { router as artistRouter };
