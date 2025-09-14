import { subscriptions } from '@/db/schema/v1/subscription.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type SubscriptionModel = InferSelectModel<typeof subscriptions>;
export type CreateSubscriptionModel = InferInsertModel<typeof subscriptions>;
export type UpdateSubscriptionModel = Partial<CreateSubscriptionModel>;
