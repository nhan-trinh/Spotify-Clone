import { Router } from 'express';
import { albumController } from './album.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', albumController.getAlbums);
router.get('/:id', albumController.getAlbumById);
router.post('/', authenticate, authorize(Role.ARTIST, Role.ADMIN), albumController.createAlbum);
router.patch('/:id', authenticate, authorize(Role.ARTIST, Role.ADMIN), albumController.updateAlbum);
router.delete('/:id', authenticate, authorize(Role.ARTIST, Role.ADMIN), albumController.deleteAlbum);
router.post('/:id/songs', authenticate, authorize(Role.ARTIST, Role.ADMIN), albumController.addSongToAlbum);
router.delete('/:id/songs/:songId', authenticate, authorize(Role.ARTIST, Role.ADMIN), albumController.removeSongFromAlbum);
router.post('/:id/follow', authenticate, albumController.followAlbum);
router.delete('/:id/follow', authenticate, albumController.unfollowAlbum);

export { router as albumRouter };
