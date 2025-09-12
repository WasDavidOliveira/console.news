import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';

extendZodWithOpenApi(z);

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .openapi({ example: 'Tecnologia' }),
  
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .openapi({ example: 'Categoria para notícias de tecnologia' }),
  
  status: z
    .nativeEnum(CategoryStatus)
    .default(CategoryStatus.ACTIVE)
    .openapi({ example: CategoryStatus.ACTIVE }),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Tecnologia Atualizada' }),
  
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Categoria atualizada para notícias de tecnologia' }),
  
  status: z
    .nativeEnum(CategoryStatus)
    .optional()
    .openapi({ example: CategoryStatus.INACTIVE }),
});

export const categoryParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID deve ser um número')
    .transform(Number)
    .refine((val) => val > 0, 'ID deve ser positivo')
    .openapi({ example: 1 }),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type CategoryParamsSchema = z.infer<typeof categoryParamsSchema>;