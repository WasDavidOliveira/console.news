import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  text,
  jsonb,
} from 'drizzle-orm/pg-core';
import { TemplateVariable } from '@/enums/v1/modules/template/template-variables.enum';

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  html: text('html').notNull(),
  text: text('text'),
  css: text('css'),
  variables: jsonb('variables')
    .$type<TemplateVariable[]>()
    .notNull()
    .default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
