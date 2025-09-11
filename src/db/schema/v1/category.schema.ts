import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  status: varchar('status', { length: 1 })
    .$type<CategoryStatus>()
    .notNull()
    .default(CategoryStatus.ACTIVE),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
