import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userRoles } from '@/db/schema/v1/user-role.schema';
import { UserStatus } from '@/enums/v1/modules/user/user-status.enum';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 })
    .notNull()
    .default(UserStatus.ACTIVE),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRoles),
}));
