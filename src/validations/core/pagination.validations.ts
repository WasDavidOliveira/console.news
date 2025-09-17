import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1, {
      message: 'Página deve ser maior ou igual a 1',
    }),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: 'Limite deve estar entre 1 e 100',
    }),
});

export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>;
