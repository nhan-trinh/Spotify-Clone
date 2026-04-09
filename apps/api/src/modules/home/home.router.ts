import { Router } from 'express';
import { homeController } from './home.controller';

export const homeRouter = Router();

// Publicly available mock route
homeRouter.get('/feed', homeController.getFeed);
homeRouter.get('/settings', homeController.getSettings);
