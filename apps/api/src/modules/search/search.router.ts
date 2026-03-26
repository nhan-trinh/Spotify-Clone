import { Router } from 'express';
import { searchController } from './search.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/', searchController.search);
router.get('/genres', searchController.getGenres);
router.get('/top-charts', searchController.getTopCharts);
router.get('/discover-weekly', authenticate, searchController.getDiscoverWeekly);

export { router as searchRouter };
