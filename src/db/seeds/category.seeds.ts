import { db } from '@/db/db.connection';
import { categories } from '@/db/schema/v1/category.schema';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';
import { logger } from '@/utils/core/logger.utils';
import { eq } from 'drizzle-orm';

export async function seedCategories() {
  try {
    logger.info('Seeding categories...');

    const defaultCategories = [
      {
        name: 'Tecnologia',
        description: 'Novidades, tendências e análises do mundo tech',
        status: CategoryStatus.ACTIVE,
      },
      {
        name: 'Negócios',
        description: 'Mercado, gestão e inovação em negócios',
        status: CategoryStatus.ACTIVE,
      },
      {
        name: 'Marketing',
        description: 'Estratégias, conteúdo e crescimento',
        status: CategoryStatus.ACTIVE,
      },
      {
        name: 'Design',
        description: 'UX, UI e design de produto',
        status: CategoryStatus.ACTIVE,
      },
      {
        name: 'Dados',
        description: 'Data science, engenharia e analytics',
        status: CategoryStatus.ACTIVE,
      },
    ];

    for (const category of defaultCategories) {
      const exists = await db
        .select()
        .from(categories)
        .where(eq(categories.name, category.name))
        .limit(1);

      if (exists.length === 0) {
        await db.insert(categories).values(category);
      }
    }

    logger.info('Categories seeded successfully');
  } catch (error) {
    logger.error('Error seeding categories:', error);

    throw error;
  }
}

if (require.main === module) {
  seedCategories()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed categories:', error);
      process.exit(1);
    });
}
