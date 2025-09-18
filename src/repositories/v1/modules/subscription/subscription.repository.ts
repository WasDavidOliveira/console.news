import { subscriptions } from '@/db/schema/v1/subscription.schema';
import { user } from '@/db/schema/v1/user.schema';
import { db } from '@/db/db.connection';
import { eq, and, desc, like, gte, lte } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import {
  SubscriptionModel,
  CreateSubscriptionModel,
  UpdateSubscriptionModel,
  SubscriptionWithUserModel,
} from '@/types/models/v1/subscription.types';
import { SubscriptionQuerySchema } from '@/validations/v1/modules/subscription.validations';
import PaginationUtils from '@/utils/core/pagination.utils';
import { PaginatedResult } from '@/types/core/pagination.types';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';

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

  async findAllPaginated(
    page: number,
    limit: number,
    filters?: {
      status?: SubscriptionStatus;
      isActive?: boolean;
      name?: string;
      email?: string;
      createdAtFrom?: Date;
      createdAtTo?: Date;
    },
  ): Promise<PaginatedResult<SubscriptionWithUserModel>> {
    const whereConditions = [];

    if (filters?.status) {
      whereConditions.push(eq(subscriptions.status, filters.status));
    }

    if (filters?.isActive !== undefined) {
      whereConditions.push(eq(subscriptions.isActive, filters.isActive));
    }

    if (filters?.name) {
      whereConditions.push(like(user.name, `%${filters.name}%`));
    }

    if (filters?.email) {
      whereConditions.push(like(user.email, `%${filters.email}%`));
    }

    if (filters?.createdAtFrom) {
      whereConditions.push(gte(subscriptions.createdAt, filters.createdAtFrom));
    }

    if (filters?.createdAtTo) {
      whereConditions.push(lte(subscriptions.createdAt, filters.createdAtTo));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const validatedParams = PaginationUtils.validatePaginationParams(
      page,
      limit,
    );
    const offset = PaginationUtils.calculateOffset(
      validatedParams.page,
      validatedParams.limit,
    );

    let countQuery = db
      .select({ count: count() })
      .from(subscriptions)
      .innerJoin(user, eq(subscriptions.userId, user.id));

    let dataQuery = db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        status: subscriptions.status,
        isActive: subscriptions.isActive,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
      .from(subscriptions)
      .innerJoin(user, eq(subscriptions.userId, user.id));

    if (whereClause) {
      countQuery = countQuery.where(whereClause) as typeof countQuery;
      dataQuery = dataQuery.where(whereClause) as typeof dataQuery;
    }

    dataQuery = dataQuery.orderBy(
      desc(subscriptions.createdAt),
    ) as typeof dataQuery;

    const [countResult] = await countQuery;
    const totalItems = countResult.count;

    const data = await dataQuery.limit(validatedParams.limit).offset(offset);

    const meta = PaginationUtils.createPaginationMeta(
      validatedParams.page,
      validatedParams.limit,
      totalItems,
    );

    return {
      data: data as SubscriptionWithUserModel[],
      meta,
    };
  }

  async findByQuery(
    query: SubscriptionQuerySchema,
  ): Promise<SubscriptionModel[]> {
    const conditions = [];

    if (query.status) {
      conditions.push(eq(subscriptions.status, query.status));
    }

    if (query.isActive !== undefined) {
      conditions.push(eq(subscriptions.isActive, query.isActive));
    }

    if (conditions.length > 0) {
      return db
        .select()
        .from(subscriptions)
        .where(and(...conditions));
    }

    return db.select().from(subscriptions);
  }

  async findByUserId(userId: number): Promise<SubscriptionModel[]> {
    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  }

  async findActiveByUserId(userId: number): Promise<SubscriptionModel | null> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)),
      )
      .limit(1);

    return subscription ?? null;
  }

  async findByEmail(email: string): Promise<SubscriptionModel[]> {
    return db
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

  async create(
    subscription: CreateSubscriptionModel,
  ): Promise<SubscriptionModel> {
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
