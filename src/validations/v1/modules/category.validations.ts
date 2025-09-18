import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';

extendZodWithOpenApi(z);

export const createCategorySchema = z.object({
  body: z.object({
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
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform(Number)
      .refine(val => val > 0, 'ID deve ser positivo')
      .openapi({ example: 1 }),
  }),
  body: z.object({
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
  }),
});

export const categoryParamsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform(Number)
      .refine(val => val > 0, 'ID deve ser positivo')
      .openapi({ example: 1 }),
  }),
});

export const categoryPaginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform(val => parseInt(val, 10))
      .refine(val => val >= 1, {
        message: 'Página deve ser maior ou igual a 1',
      })
      .openapi({ example: 1 }),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform(val => parseInt(val, 10))
      .refine(val => val >= 1 && val <= 100, {
        message: 'Limite deve estar entre 1 e 100',
      })
      .openapi({ example: 10 }),
    perPage: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : undefined))
      .refine(val => val === undefined || (val >= 1 && val <= 100), {
        message: 'PerPage deve estar entre 1 e 100',
      })
      .openapi({
        example: 15,
        description:
          'Número específico de itens por página (sobrescreve limit)',
      }),
  }),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>['body'];
export type CategoryParamsSchema = z.infer<typeof categoryParamsSchema>;
export type CategoryPaginationSchema = z.infer<typeof categoryPaginationSchema>;
