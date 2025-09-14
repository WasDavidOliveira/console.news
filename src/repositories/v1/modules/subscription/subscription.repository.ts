import { subscriptions } from '@/db/schema/v1/subscription.schema';
import { user } from '@/db/schema/v1/user.schema';
import { db } from '@/db/db.connection';
import { eq, and } from 'drizzle-orm';
import {
  SubscriptionModel,
  CreateSubscriptionModel,
  UpdateSubscriptionModel,
} from '@/types/models/v1/subscription.types';
import { SubscriptionQuerySchema } from '@/validations/v1/modules/subscription.validations';

export class SubscriptionRepository {
  async findById(id: number): Promise<SubscriptionModel | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .limit(1);

    return subscription ?? null;
  }

  async findAll(): Promise<SubscriptionModel[]> {
    const subscriptionsResults = await db.select().from(subscriptions);

    return subscriptionsResults;
  }

  async findByQuery(query: SubscriptionQuerySchema): Promise<SubscriptionModel[]> {
    const conditions = [];

    if (query.status) {
      conditions.push(eq(subscriptions.status, query.status));
    }

    if (query.isActive !== undefined) {
      conditions.push(eq(subscriptions.isActive, query.isActive));
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(subscriptions)
        .where(and(...conditions));
    }

    return await db.select().from(subscriptions);
  }

  async findByUserId(userId: number): Promise<SubscriptionModel[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  }

  async findActiveByUserId(userId: number): Promise<SubscriptionModel | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.isActive, true)
      ))
      .limit(1);

    return subscription ?? null;
  }

  async findByEmail(email: string): Promise<SubscriptionModel[]> {
    return await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        status: subscriptions.status,
        isActive: subscriptions.isActive,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
      })
      .from(subscriptions)
      .innerJoin(user, eq(subscriptions.userId, user.id))
      .where(eq(user.email, email));
  }

  async create(subscription: CreateSubscriptionModel): Promise<SubscriptionModel> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();

    return newSubscription;
  }

  async update(
    id: number,
    subscription: UpdateSubscriptionModel,
  ): Promise<SubscriptionModel> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(subscription)
      .where(eq(subscriptions.id, id))
      .returning();

    return updatedSubscription;
  }

  async delete(id: number): Promise<void> {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  }

  async deactivate(id: number): Promise<SubscriptionModel> {
    const [deactivatedSubscription] = await db
      .update(subscriptions)
      .set({ isActive: false })
      .where(eq(subscriptions.id, id))
      .returning();

    return deactivatedSubscription;
  }

  async activate(id: number): Promise<SubscriptionModel> {
    const [activatedSubscription] = await db
      .update(subscriptions)
      .set({ isActive: true })
      .where(eq(subscriptions.id, id))
      .returning();

    return activatedSubscription;
  }
}

export default new SubscriptionRepository();
