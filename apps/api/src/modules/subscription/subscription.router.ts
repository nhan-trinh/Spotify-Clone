import { Router } from 'express';
import { subscriptionController } from './subscription.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/plans', subscriptionController.getPlans);
router.get('/my', authenticate, subscriptionController.getMySubscription);
router.post('/payment', authenticate, subscriptionController.createPayment);
router.get('/vnpay-return', subscriptionController.vnpayReturn);
router.post('/vnpay-webhook', subscriptionController.vnpayWebhook);
router.delete('/my', authenticate, subscriptionController.cancelSubscription);
router.get('/my/invoices', authenticate, subscriptionController.getInvoices);

export { router as subscriptionRouter };
