import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { NewsletterStatus } from '@/enums/v1/modules/newsletter/newsletter-status.enum';

extendZodWithOpenApi(z);

export const createNewsletterSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .openapi({ example: 'Newsletter Semanal' }),

  categoryId: z
    .number()
    .int('ID da categoria deve ser um número inteiro')
    .positive('ID da categoria deve ser positivo')
    .optional()
    .openapi({ example: 1 }),

  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(255, 'Conteúdo deve ter no máximo 255 caracteres')
    .openapi({ example: 'Este é o conteúdo da newsletter' }),

  subject: z
    .string()
    .min(1, 'Assunto é obrigatório')
    .max(255, 'Assunto deve ter no máximo 255 caracteres')
    .openapi({ example: 'Newsletter Semanal - Edição 1' }),

  status: z
    .nativeEnum(NewsletterStatus)
    .default(NewsletterStatus.DRAFT)
    .openapi({ example: NewsletterStatus.DRAFT }),
  previewText: z
    .string()
    .min(1, 'Texto de prévia é obrigatório')
    .max(255, 'Texto de prévia deve ter no máximo 255 caracteres')
    .openapi({ example: 'Resumo da newsletter desta semana' }),
});

export const updateNewsletterSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Newsletter Semanal Atualizada' }),

  categoryId: z
    .number()
    .int('ID da categoria deve ser um número inteiro')
    .positive('ID da categoria deve ser positivo')
    .optional()
    .openapi({ example: 2 }),

  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(255, 'Conteúdo deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Conteúdo atualizado da newsletter' }),

  subject: z
    .string()
    .min(1, 'Assunto é obrigatório')
    .max(255, 'Assunto deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Newsletter Semanal - Edição 2' }),

  status: z
    .nativeEnum(NewsletterStatus)
    .optional()
    .openapi({ example: NewsletterStatus.PUBLISHED }),

  previewText: z
    .string()
    .min(1, 'Texto de prévia é obrigatório')
    .max(255, 'Texto de prévia deve ter no máximo 255 caracteres')
    .optional()
    .openapi({ example: 'Resumo atualizado da newsletter' }),
});

export const newsletterParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID deve ser um número')
    .transform(Number)
    .refine(val => val > 0, 'ID deve ser positivo')
    .openapi({ example: 1 }),
});

export type CreateNewsletterSchema = z.infer<typeof createNewsletterSchema>;
export type UpdateNewsletterSchema = z.infer<typeof updateNewsletterSchema>;
export type NewsletterParamsSchema = z.infer<typeof newsletterParamsSchema>;
