import { newsletter } from '@/db/schema/v1/newsletter.schema';
import { db } from '@/db/db.connection';
import { eq, count } from 'drizzle-orm';
import {
  NewsletterModel,
  CreateNewsletterModel,
  UpdateNewsletterModel,
} from '@/types/models/v1/newsletter.types';
import { NewsletterStatus } from '@/enums/v1/modules/newsletter/newsletter-status.enum';

export class NewsletterRepository {
  async findById(id: number): Promise<NewsletterModel | null> {
    const [newsletterResult] = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.id, id))
      .limit(1);

    return newsletterResult ?? null;
  }

  async findAll(): Promise<NewsletterModel[]> {
    const newslettersResults = await db.select().from(newsletter);

    return newslettersResults;
  }

  async findByStatus(status: NewsletterStatus): Promise<NewsletterModel[]> {
    const newslettersResults = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.status, status));

    return newslettersResults;
  }

  async update(
    id: number,
    newsletterData: UpdateNewsletterModel,
  ): Promise<NewsletterModel> {
    const [updatedNewsletter] = await db
      .update(newsletter)
      .set({
        ...newsletterData,
        updatedAt: new Date(),
      })
      .where(eq(newsletter.id, id))
      .returning();

    return updatedNewsletter;
  }

  async create(
    newsletterData: CreateNewsletterModel,
  ): Promise<NewsletterModel> {
    const [newNewsletter] = await db
      .insert(newsletter)
      .values(newsletterData)
      .returning();

    return newNewsletter;
  }

  async delete(id: number): Promise<void> {
    await db.delete(newsletter).where(eq(newsletter.id, id));
  }

  async countTotal(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(newsletter);

    return result.count;
  }

  async countSent(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(newsletter)
      .where(eq(newsletter.status, NewsletterStatus.SENT));

    return result.count;
  }
}

export default new NewsletterRepository();
