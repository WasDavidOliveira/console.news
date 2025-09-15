import { Router } from 'express';
import HealthController from '@/controllers/v1/modules/health/health.controller';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import { hasRole } from '@/middlewares/authorization/role.middleware';

const router: Router = Router();

router.get('/', HealthController.simple);

router.get(
  '/detailed',
  authMiddleware,
  hasRole('admin'),
  HealthController.check,
);

export default router;
