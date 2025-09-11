import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { ShippingStatus } from '@/enums/v1/modules/shipping/shipping-status.enum';
import { newsletter } from '@/db/schema/v1/newsletter.schema';
import { user } from '@/db/schema/v1/user.schema';

export const shipping = pgTable('shipping', {
  id: serial('id').primaryKey(),
  newsletterId: integer('newsletter_id').references(() => newsletter.id),
  userId: integer('user_id').references(() => user.id),
  description: varchar('description', { length: 255 }).notNull(),
  status: varchar('status', { length: 1 })
    .$type<ShippingStatus>()
    .notNull()
    .default(ShippingStatus.DELIVERED),
  bouncedAt: timestamp('bounced_at'),
  failedAt: timestamp('failed_at'),
  deliveredAt: timestamp('delivered_at'),
  openedAt: timestamp('opened_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
