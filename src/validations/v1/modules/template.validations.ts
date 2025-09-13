import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { TemplateVariable } from '@/enums/v1/modules/template/template-variables.enum';

extendZodWithOpenApi(z);

export const createTemplateSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .max(255, 'Nome deve ter no máximo 255 caracteres')
      .openapi({ example: 'Template Newsletter Semanal' }),

    description: z
      .string()
      .max(255, 'Descrição deve ter no máximo 255 caracteres')
      .optional()
      .openapi({ example: 'Template para newsletter semanal de notícias' }),

    html: z
      .string()
      .min(1, 'HTML é obrigatório')
      .openapi({ 
        example: '<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>' 
      }),

    text: z
      .string()
      .optional()
      .openapi({ example: '{{title}}\n\n{{content}}' }),

    css: z
      .string()
      .optional()
      .openapi({ example: 'body { font-family: Arial, sans-serif; }' }),

    variables: z
      .array(z.nativeEnum(TemplateVariable))
      .default([])
      .openapi({ 
        example: [TemplateVariable.TITLE, TemplateVariable.CONTENT] 
      }),

    isActive: z
      .boolean()
      .default(true)
      .openapi({ example: true }),
  }),
});

export const updateTemplateSchema = z.object({
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
      .openapi({ example: 'Template Newsletter Atualizado' }),

    description: z
      .string()
      .max(255, 'Descrição deve ter no máximo 255 caracteres')
      .optional()
      .openapi({ example: 'Template atualizado para newsletter' }),

    html: z
      .string()
      .min(1, 'HTML é obrigatório')
      .optional()
      .openapi({ 
        example: '<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>' 
      }),

    text: z
      .string()
      .optional()
      .openapi({ example: '{{title}}\n\n{{content}}' }),

    css: z
      .string()
      .optional()
      .openapi({ example: 'body { font-family: Arial, sans-serif; }' }),

    variables: z
      .array(z.nativeEnum(TemplateVariable))
      .optional()
      .openapi({ 
        example: [TemplateVariable.TITLE, TemplateVariable.CONTENT] 
      }),

    isActive: z
      .boolean()
      .optional()
      .openapi({ example: false }),
  }),
});

export const templateParamsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform(Number)
      .refine(val => val > 0, 'ID deve ser positivo')
      .openapi({ example: 1 }),
  }),
});

export const templateQuerySchema = z.object({
  query: z.object({
    active: z
      .string()
      .optional()
      .transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
      .openapi({ example: 'true' }),
  }),
});

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>['body'];
export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>['body'];
export type TemplateParamsSchema = z.infer<typeof templateParamsSchema>;
export type TemplateQuerySchema = z.infer<typeof templateQuerySchema>['query'];
