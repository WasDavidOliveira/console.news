import { Router } from 'express';
import SubscriptionController from '@/controllers/v1/modules/subscription/subscription.controller';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  subscriptionParamsSchema,
  subscriptionPaginationSchema,
} from '@/validations/v1/modules/subscription.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import { hasRole } from '@/middlewares/authorization/role.middleware';

const router: Router = Router();

router.get(
  '/',
  authMiddleware,
  hasRole('admin'),
  validateRequest(subscriptionPaginationSchema),
  SubscriptionController.index,
);

router.get(
  '/email/:email',
  authMiddleware,
  hasRole('admin'),
  SubscriptionController.findByEmail,
);

router.get(
  '/:id',
  authMiddleware,
  hasRole('admin'),
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.show,
);

router.post(
  '/',
  validateRequest(createSubscriptionSchema),
  SubscriptionController.create,
);

router.put(
  '/:id',
  authMiddleware,
  hasRole('admin'),
  validateRequest(updateSubscriptionSchema),
  SubscriptionController.update,
);

router.patch(
  '/:id/activate',
  authMiddleware,
  hasRole('admin'),
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.activate,
);

router.patch(
  '/:id/deactivate',
  authMiddleware,
  hasRole('admin'),
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.deactivate,
);

router.delete(
  '/:id',
  authMiddleware,
  hasRole('admin'),
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.delete,
);

export default router;
