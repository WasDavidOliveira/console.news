import { shipping } from '@/db/schema/v1/shipping.schema';
import { db } from '@/db/db.connection';
import { eq, desc } from 'drizzle-orm';
import { ShippingStatus } from '@/enums/v1/modules/shipping/shipping-status.enum';
import {
  ShippingModel,
  CreateShippingModel,
  UpdateShippingModel,
} from '@/types/models/v1/shipping.types';

export class ShippingRepository {
  async findById(id: number): Promise<ShippingModel | null> {
    const [shippingResult] = await db
      .select()
      .from(shipping)
      .where(eq(shipping.id, id))
      .limit(1);

    return shippingResult ?? null;
  }

  async findByNewsletterId(newsletterId: number): Promise<ShippingModel[]> {
    return db
      .select()
      .from(shipping)
      .where(eq(shipping.newsletterId, newsletterId))
      .orderBy(desc(shipping.createdAt));
  }

  async findByUserId(userId: number): Promise<ShippingModel[]> {
    return db
      .select()
      .from(shipping)
      .where(eq(shipping.userId, userId))
      .orderBy(desc(shipping.createdAt));
  }

  async findByStatus(status: ShippingStatus): Promise<ShippingModel[]> {
    return db
      .select()
      .from(shipping)
      .where(eq(shipping.status, status))
      .orderBy(desc(shipping.createdAt));
  }

  async create(shippingData: CreateShippingModel): Promise<ShippingModel> {
    const [newShipping] = await db
      .insert(shipping)
      .values(shippingData)
      .returning();

    return newShipping;
  }

  async update(
    id: number,
    shippingData: UpdateShippingModel,
  ): Promise<ShippingModel> {
    const [updatedShipping] = await db
      .update(shipping)
      .set({
        ...shippingData,
        updatedAt: new Date(),
      })
      .where(eq(shipping.id, id))
      .returning();

    return updatedShipping;
  }

  async markAsDelivered(id: number): Promise<ShippingModel> {
    const [updatedShipping] = await db
      .update(shipping)
      .set({
        status: ShippingStatus.DELIVERED,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shipping.id, id))
      .returning();

    return updatedShipping;
  }

  async markAsBounced(id: number): Promise<ShippingModel> {
    const [updatedShipping] = await db
      .update(shipping)
      .set({
        status: ShippingStatus.BOUNCED,
        bouncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shipping.id, id))
      .returning();

    return updatedShipping;
  }

  async markAsFailed(id: number): Promise<ShippingModel> {
    const [updatedShipping] = await db
      .update(shipping)
      .set({
        status: ShippingStatus.FAILED,
        failedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shipping.id, id))
      .returning();

    return updatedShipping;
  }

  async markAsOpened(id: number): Promise<ShippingModel> {
    const [updatedShipping] = await db
      .update(shipping)
      .set({
        openedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shipping.id, id))
      .returning();

    return updatedShipping;
  }

  async delete(id: number): Promise<void> {
    await db.delete(shipping).where(eq(shipping.id, id));
  }
}

export default new ShippingRepository();
