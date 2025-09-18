import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';

extendZodWithOpenApi(z);

export const createSubscriptionSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .max(50, 'Nome deve ter no máximo 50 caracteres')
      .openapi({ example: 'João Silva' }),

    email: z
      .string()
      .email('Email deve ter um formato válido')
      .max(100, 'Email deve ter no máximo 100 caracteres')
      .openapi({ example: 'joao@email.com' }),
  }),
});

export const updateSubscriptionSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform(Number)
      .refine(val => val > 0, 'ID deve ser positivo')
      .openapi({ example: 1 }),
  }),
  body: z.object({
    status: z
      .nativeEnum(SubscriptionStatus)
      .optional()
      .openapi({ example: SubscriptionStatus.INACTIVE }),

    isActive: z.boolean().optional().openapi({ example: false }),
  }),
});

export const subscriptionParamsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform(Number)
      .refine(val => val > 0, 'ID deve ser positivo')
      .openapi({ example: 1 }),
  }),
});

export const subscriptionQuerySchema = z.object({
  query: z.object({
    status: z
      .nativeEnum(SubscriptionStatus)
      .optional()
      .openapi({ example: SubscriptionStatus.ACTIVE }),

    isActive: z
      .string()
      .optional()
      .transform(val =>
        val === 'true' ? true : val === 'false' ? false : undefined,
      )
      .openapi({ example: 'true' }),
  }),
});

export const subscriptionPaginationSchema = z.object({
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
    status: z
      .nativeEnum(SubscriptionStatus)
      .optional()
      .openapi({ example: SubscriptionStatus.ACTIVE }),
    isActive: z
      .string()
      .optional()
      .transform(val =>
        val === 'true' ? true : val === 'false' ? false : undefined,
      )
      .openapi({ example: 'true' }),
    name: z.string().optional().openapi({
      example: 'João Silva',
      description: 'Filtrar por nome do usuário (busca parcial)',
    }),
    email: z.string().optional().openapi({
      example: 'joao@email.com',
      description: 'Filtrar por email do usuário (busca parcial)',
    }),
    createdAtFrom: z
      .string()
      .optional()
      .transform(val => (val ? new Date(val) : undefined))
      .refine(val => val === undefined || !isNaN(val.getTime()), {
        message: 'Data de criação inicial deve ser válida',
      })
      .openapi({
        example: '2024-01-01',
        description:
          'Filtrar inscrições criadas a partir desta data (YYYY-MM-DD)',
      }),
    createdAtTo: z
      .string()
      .optional()
      .transform(val => (val ? new Date(val) : undefined))
      .refine(val => val === undefined || !isNaN(val.getTime()), {
        message: 'Data de criação final deve ser válida',
      })
      .openapi({
        example: '2024-12-31',
        description: 'Filtrar inscrições criadas até esta data (YYYY-MM-DD)',
      }),
  }),
});

export type CreateSubscriptionSchema = z.infer<
  typeof createSubscriptionSchema
>['body'];
export type UpdateSubscriptionSchema = z.infer<
  typeof updateSubscriptionSchema
>['body'];
export type SubscriptionParamsSchema = z.infer<typeof subscriptionParamsSchema>;
export type SubscriptionQuerySchema = z.infer<
  typeof subscriptionQuerySchema
>['query'];
export type SubscriptionPaginationSchema = z.infer<
  typeof subscriptionPaginationSchema
>;
