import { Router } from 'express';
import HealthController from '@/controllers/v1/modules/health/health.controller';

const router: Router = Router();

router.get('/', HealthController.simple);

router.get('/detailed', HealthController.check);

export default router;
