import { db } from '@/db/db.connection';
import { subscriptions } from '@/db/schema/v1/subscription.schema';
import { user } from '@/db/schema/v1/user.schema';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';
import { logger } from '@/utils/core/logger.utils';
import { eq } from 'drizzle-orm';

export async function seedSubscriptions() {
  try {
    logger.info('Seeding subscriptions...');

    const users = await db.select().from(user);

    if (users.length === 0) {
      logger.info('No users found. Skipping subscriptions seeding.');
      return;
    }

    for (const u of users) {
      const exists = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, u.id))
        .limit(1);

      if (exists.length === 0) {
        await db.insert(subscriptions).values({
          userId: u.id,
          status: SubscriptionStatus.ACTIVE,
          isActive: true,
        });
      }
    }

    logger.info('Subscriptions seeded successfully');
  } catch (error) {
    logger.error('Error seeding subscriptions:', error);

    throw error;
  }
}

if (require.main === module) {
  seedSubscriptions()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed subscriptions:', error);
      process.exit(1);
    });
}
