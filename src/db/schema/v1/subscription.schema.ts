import { pgTable, serial, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from '@/db/schema/v1/user.schema';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 1 })
    .notNull()
    .default(SubscriptionStatus.ACTIVE),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
}));
