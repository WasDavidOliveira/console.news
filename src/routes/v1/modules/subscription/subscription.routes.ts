import { Router } from 'express';
import SubscriptionController from '@/controllers/v1/modules/subscription/subscription.controller';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  subscriptionParamsSchema,
  subscriptionQuerySchema,
} from '@/validations/v1/modules/subscription.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';

const router: Router = Router();

router.get(
  '/',
  validateRequest(subscriptionQuerySchema),
  SubscriptionController.index,
);

router.get(
  '/email/:email',
  SubscriptionController.findByEmail,
);

router.get(
  '/:id',
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
  validateRequest(updateSubscriptionSchema),
  SubscriptionController.update,
);

router.patch(
  '/:id/activate',
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.activate,
);

router.patch(
  '/:id/deactivate',
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.deactivate,
);

router.delete(
  '/:id',
  validateRequest(subscriptionParamsSchema),
  SubscriptionController.delete,
);

export default router;
