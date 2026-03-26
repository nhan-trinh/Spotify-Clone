import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';

// Search — Meilisearch full-text
export const searchController = {
  // GET /api/v1/search?q=&type=song|artist|album|playlist
  search: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, { songs: [], artists: [], albums: [], playlists: [] }, 'OK');
  },
  // GET /api/v1/search/genres
  getGenres: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // GET /api/v1/search/top-charts
  getTopCharts: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
  // GET /api/v1/search/discover-weekly
  getDiscoverWeekly: async (_req: Request, res: Response, _next: NextFunction): Promise<void> => { sendSuccess(res, [], 'OK'); },
};
