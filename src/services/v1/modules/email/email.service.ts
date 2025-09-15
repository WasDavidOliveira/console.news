import { emailProvider } from '@/providers';
import { EmailOptions, WelcomeEmailData, NewsletterEmailData } from '@/types/models/v1/email.types';
import { EmailResponse } from '@/types/models/v1/email.types';

export class EmailService {
  protected emailProvider = emailProvider;

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResponse> {
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

    const email = await this.emailProvider.sendEmail(emailOptions);

    return email;
  }

  async sendNewsletterEmail(data: NewsletterEmailData): Promise<EmailResponse> {
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

    const email = await this.emailProvider.sendEmail(emailOptions);

    return email;
  }

  async sendCustomEmail(options: EmailOptions): Promise<EmailResponse> {
    const email = await this.emailProvider.sendEmail(options);

    return email;
  }

  async verifyConnection(): Promise<boolean> {
    return await this.emailProvider.verifyConnection();
  }
}

export default new EmailService();
