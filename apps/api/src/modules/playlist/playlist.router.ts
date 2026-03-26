import { Router } from 'express';
import { playlistController } from './playlist.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.post('/', authenticate, playlistController.createPlaylist);
router.patch('/:id', authenticate, playlistController.updatePlaylist);
router.delete('/:id', authenticate, playlistController.deletePlaylist);
router.post('/:id/songs', authenticate, playlistController.addSong);
router.delete('/:id/songs/:songId', authenticate, playlistController.removeSong);
router.patch('/:id/songs/reorder', authenticate, playlistController.reorderSongs);
router.post('/:id/collaborators', authenticate, playlistController.addCollaborator);
router.delete('/:id/collaborators/:userId', authenticate, playlistController.removeCollaborator);

export { router as playlistRouter };
