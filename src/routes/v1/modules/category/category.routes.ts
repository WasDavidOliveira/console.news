import { Router } from 'express';
import CategoryController from '@/controllers/v1/modules/category/category.controller';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from '@/validations/v1/modules/category.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';

const router: Router = Router();

router.get('/', CategoryController.show);

router.get(
  '/:id',
  validateRequest(categoryParamsSchema),
  CategoryController.findById,
);

router.post(
  '/',
  validateRequest(createCategorySchema),
  CategoryController.create,
);

router.put(
  '/:id',
  validateRequest(updateCategorySchema),
  CategoryController.update,
);

router.delete(
  '/:id',
  validateRequest(categoryParamsSchema),
  CategoryController.delete,
);

export default router;