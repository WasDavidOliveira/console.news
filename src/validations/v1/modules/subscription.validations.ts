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

    isActive: z
      .boolean()
      .optional()
      .openapi({ example: false }),
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
      .transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
      .openapi({ example: 'true' }),
  }),
});

export type CreateSubscriptionSchema = z.infer<typeof createSubscriptionSchema>['body'];
export type UpdateSubscriptionSchema = z.infer<typeof updateSubscriptionSchema>['body'];
export type SubscriptionParamsSchema = z.infer<typeof subscriptionParamsSchema>;
export type SubscriptionQuerySchema = z.infer<typeof subscriptionQuerySchema>['query'];
