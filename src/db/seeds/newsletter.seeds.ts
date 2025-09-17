import { db } from '@/db/db.connection';
import { newsletter } from '@/db/schema/v1/newsletter.schema';
import { categories } from '@/db/schema/v1/category.schema';
import { NewsletterStatus } from '@/enums/v1/modules/newsletter/newsletter-status.enum';
import { logger } from '@/utils/core/logger.utils';
import { eq, and } from 'drizzle-orm';

export async function seedNewsletters() {
  try {
    logger.info('Seeding newsletters...');

    const [firstCategory] = await db.select().from(categories).limit(1);

    const defaultNewsletters = [
      {
        title: 'Bem-vindo ao Console News',
        subject: 'As principais novidades da semana',
        content:
          'Conteúdo introdutório sobre as principais novidades do projeto e da comunidade.',
        previewText: 'As novidades mais importantes em um só lugar.',
        status: NewsletterStatus.DRAFT,
        categoryId: firstCategory?.id,
      },
      {
        title: 'Tendências em Tecnologia',
        subject: 'AI, Cloud e DevEx em alta',
        content:
          'Análise das tendências atuais em inteligência artificial, computação em nuvem e experiência do desenvolvedor.',
        previewText: 'O que está em alta no mundo tech.',
        status: NewsletterStatus.DRAFT,
        categoryId: firstCategory?.id,
      },
      {
        title: 'Boletim de Produto',
        subject: 'Novidades e melhorias lançadas',
        content:
          'Resumo das novas funcionalidades, melhorias e correções entregues recentemente.',
        previewText: 'Confira o que mudou recentemente.',
        status: NewsletterStatus.DRAFT,
        categoryId: firstCategory?.id,
      },
    ];

    for (const item of defaultNewsletters) {
      const exists = await db
        .select()
        .from(newsletter)
        .where(
          and(
            eq(newsletter.title, item.title),
            eq(newsletter.subject, item.subject),
          ),
        )
        .limit(1);

      if (exists.length === 0) {
        await db.insert(newsletter).values(item);
      }
    }

    logger.info('Newsletters seeded successfully');
  } catch (error) {
    logger.error('Error seeding newsletters:', error);

    throw error;
  }
}

if (require.main === module) {
  seedNewsletters()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed newsletters:', error);
      process.exit(1);
    });
}
