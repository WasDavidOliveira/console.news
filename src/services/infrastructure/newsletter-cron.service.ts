import cron from 'node-cron';
import { EmailService } from './email.service';
import { logger } from '@/utils/core/logger.utils';
import { newsletterCronConfig } from '@/configs/newsletter-cron.config';
import NewsletterRepository from '@/repositories/v1/modules/newsletter/newsletter.repository';
import SubscriptionRepository from '@/repositories/v1/modules/subscription/subscription.repository';
import ShippingRepository from '@/repositories/v1/modules/shipping/shipping.repository';
import { NewsletterStatus } from '@/enums/v1/modules/newsletter/newsletter-status.enum';
import { ShippingStatus } from '@/enums/v1/modules/shipping/shipping-status.enum';

export class NewsletterCronService {
  protected emailService = new EmailService();

  startNewsletterCron(): void {
    if (!newsletterCronConfig.enabled) {
      logger.info('Serviço de cron de newsletter desabilitado');
      return;
    }

    this.scheduleWeeklyNewsletter();
    logger.info('Serviço de cron de newsletter semanal configurado');
  }

  async sendNewsletterToAllSubscribers(newsletterId: number): Promise<void> {
    const newsletter = await NewsletterRepository.findById(newsletterId);

    if (!newsletter) {
      logger.error(`Newsletter com ID ${newsletterId} não encontrada`);
      return;
    }

    const activeSubscriptions =
      await SubscriptionRepository.findActiveSubscriptionsWithUsers();
    const emailsSent = await this.sendNewsletterToSubscribers(
      newsletter,
      activeSubscriptions,
    );

    logger.info(`Newsletter manual enviada: ${emailsSent} emails enviados`);
  }

  protected async sendNewsletterToSubscribers(
    newsletter: { id: number; title: string; content: string },
    subscriptions: Array<{
      id: number;
      userId: number;
      user: { email: string; name: string };
    }>,
  ): Promise<number> {
    const batchSize = newsletterCronConfig.batch.maxEmailsPerBatch;
    const delay = newsletterCronConfig.batch.delayBetweenBatches;
    let emailsSent = 0;

    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize);

      const promises = batch.map(async subscription => {
        const shipping = await ShippingRepository.create({
          newsletterId: newsletter.id,
          userId: subscription.userId,
          description: `Newsletter: ${newsletter.title}`,
          status: ShippingStatus.PENDING,
        });

        await this.emailService.sendNewsletterEmail({
          userEmail: subscription.user.email,
          userName: subscription.user.name,
          newsletterTitle: newsletter.title,
          newsletterContent: newsletter.content,
        });

        await ShippingRepository.markAsDelivered(shipping.id);
        return 1;
      });

      const results = await Promise.all(promises);
      emailsSent += results.reduce(
        (sum: number, result: number) => sum + result,
        0,
      );

      if (i + batchSize < subscriptions.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return emailsSent;
  }

  protected async processWeeklyNewsletter(): Promise<void> {
    const publishedNewsletters = await NewsletterRepository.findByStatus(
      NewsletterStatus.PUBLISHED,
    );
    const activeSubscriptions =
      await SubscriptionRepository.findActiveSubscriptionsWithUsers();

    if (publishedNewsletters.length === 0) {
      logger.info('Nenhuma newsletter publicada encontrada para envio');
      return;
    }

    if (activeSubscriptions.length === 0) {
      logger.info('Nenhuma assinatura ativa encontrada para envio');
      return;
    }

    let emailsSent = 0;

    for (const newsletter of publishedNewsletters) {
      emailsSent += await this.sendNewsletterToSubscribers(
        newsletter,
        activeSubscriptions,
      );

      await NewsletterRepository.update(newsletter.id, {
        status: NewsletterStatus.SENT,
      });
    }

    logger.info(`Newsletter semanal enviada: ${emailsSent} emails enviados`);
  }

  protected scheduleWeeklyNewsletter(): void {
    cron.schedule(
      newsletterCronConfig.weekly.schedule,
      async () => {
        logger.info('Iniciando envio de newsletter semanal');
        await this.processWeeklyNewsletter();
      },
      {
        timezone: newsletterCronConfig.timezone,
      },
    );
  }
}

export default new NewsletterCronService();
