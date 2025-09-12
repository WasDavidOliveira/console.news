import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categories } from '@/db/schema/v1/category.schema';
import { NewsletterStatus } from '@/enums/v1/modules/newsletter/newsletter-status.enum';
import { shipping } from './shipping.schema';

export const newsletter = pgTable('newsletter', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  content: text('content').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  status: varchar('status', { length: 1 })
    .$type<NewsletterStatus>()
    .notNull()
    .default(NewsletterStatus.DRAFT),
  previewText: varchar('preview_text', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const newsletterRelations = relations(newsletter, ({ one, many }) => ({
  category: one(categories, {
    fields: [newsletter.categoryId],
    references: [categories.id],
  }),
  shipping: many(shipping),
}));
