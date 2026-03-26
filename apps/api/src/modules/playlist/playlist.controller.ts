import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

export const playlistController = {
  getPlaylists: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  getPlaylistById: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'OK'); },
  createPlaylist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Playlist đã được tạo', 201); },
  updatePlaylist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Playlist đã được cập nhật'); },
  deletePlaylist: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Playlist đã được xóa'); },
  addSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã thêm bài hát'); },
  removeSong: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã xóa bài hát'); },
  reorderSongs: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã sắp xếp lại'); },
  addCollaborator: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã thêm cộng tác viên'); },
  removeCollaborator: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, null, 'Đã xóa cộng tác viên'); },
};
