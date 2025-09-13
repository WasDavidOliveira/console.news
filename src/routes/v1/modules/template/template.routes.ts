import { Router } from 'express';
import TemplateController from '@/controllers/v1/modules/template/template.controller';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateParamsSchema,
  templateQuerySchema,
} from '@/validations/v1/modules/template.validations';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';

const router: Router = Router();

router.get(
  '/',
  validateRequest(templateQuerySchema),
  TemplateController.show,
);

router.get(
  '/preview',
  TemplateController.preview,
);

router.get(
  '/:id',
  validateRequest(templateParamsSchema),
  TemplateController.findById,
);

router.post(
  '/',
  validateRequest(createTemplateSchema),
  TemplateController.create,
);

router.put(
  '/:id',
  validateRequest(updateTemplateSchema),
  TemplateController.update,
);

router.patch(
  '/:id/activate',
  validateRequest(templateParamsSchema),
  TemplateController.activate,
);

router.patch(
  '/:id/deactivate',
  validateRequest(templateParamsSchema),
  TemplateController.deactivate,
);

router.delete(
  '/:id',
  validateRequest(templateParamsSchema),
  TemplateController.delete,
);

export default router;
