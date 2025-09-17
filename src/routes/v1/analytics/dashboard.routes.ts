import { Router } from 'express';
import DashboardController from '@/controllers/v1/analytics/dashboard.controller';

const router: Router = Router();

router.get('/', DashboardController.getAnalytics);

export default router;
