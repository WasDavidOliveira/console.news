import { EmailProvider } from '@/providers/email/email.provider';
import { EmailOptions, WelcomeEmailData, NewsletterEmailData } from '@/types/models/v1/email.types';

export class EmailService {
  protected emailProvider: EmailProvider;

  constructor() {
    this.emailProvider = new EmailProvider();
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const emailOptions: EmailOptions = {
      to: data.userEmail,
      subject: 'Bem-vindo à Newsletter Console.News!',
      text: `Olá ${data.userName}, bem-vindo à nossa newsletter!`,
      html: `
        <h1>Bem-vindo à Newsletter Console.News!</h1>
        <p>Olá <strong>${data.userName}</strong>,</p>
        <p>Obrigado por se inscrever em nossa newsletter!</p>
        <p>Você receberá as melhores notícias de tecnologia diretamente no seu email.</p>
        <p>Equipe Console.News</p>
      `,
    };

    await this.emailProvider.sendEmail(emailOptions);
  }

  async sendNewsletterEmail(data: NewsletterEmailData): Promise<void> {
    const emailOptions: EmailOptions = {
      to: data.userEmail,
      subject: data.newsletterTitle,
      text: `Olá ${data.userName}, ${data.newsletterContent}`,
      html: `
        <h1>${data.newsletterTitle}</h1>
        <p>Olá <strong>${data.userName}</strong>,</p>
        <div>${data.newsletterContent}</div>
        <p>Equipe Console.News</p>
      `,
    };

    await this.emailProvider.sendEmail(emailOptions);
  }

  async sendCustomEmail(options: EmailOptions): Promise<void> {
    await this.emailProvider.sendEmail(options);
  }

  async verifyConnection(): Promise<boolean> {
    return await this.emailProvider.verifyConnection();
  }
}

export default new EmailService();
