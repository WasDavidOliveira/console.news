import { newsletter } from '@/db/schema/v1/newsletter.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type NewsletterModel = InferSelectModel<typeof newsletter>;
export type CreateNewsletterModel = InferInsertModel<typeof newsletter>;
export type UpdateNewsletterModel = Partial<CreateNewsletterModel>;
