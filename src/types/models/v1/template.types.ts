import { templates } from '@/db/schema/v1/template.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type TemplateModel = InferSelectModel<typeof templates>;
export type CreateTemplateModel = InferInsertModel<typeof templates>;
export type UpdateTemplateModel = Partial<CreateTemplateModel>;
