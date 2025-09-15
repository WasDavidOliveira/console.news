import { Resend } from 'resend';
import { EmailOptions, EmailResponse } from '@/types/models/v1/email.types';
import { emailConfig } from '@/configs/email.config';
import { EmailServiceError } from '@/utils/core/app-error.utils';
import { IEmailProvider } from '@/types/providers/email-provider.interface';

export class ResendEmailProvider implements IEmailProvider {
  protected resend: Resend;

  constructor() {
    this.resend = new Resend(emailConfig.resendApiKey);
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    const emailData: any = {
      from: options.from ?? emailConfig.from,
      to: [options.to],
      subject: options.subject,
    };

    if (options.html) {
      emailData.html = options.html;
    }

    if (options.text) {
      emailData.text = options.text;
    }

    if (!emailData.html && !emailData.text) {
      emailData.text = options.subject;
    }

    const { data, error } = await this.resend.emails.send(emailData);

    if (error) {
      throw new EmailServiceError(
        `Erro ao enviar email via Resend: ${error.message}`,
      );
    }

    if (!data) {
      throw new EmailServiceError('Resposta vazia do Resend');
    }

    return this.convertResendResponse(data);
  }

  async verifyConnection(): Promise<boolean> {
    const result = await this.resend.domains.list();
    return !!result;
  }

  protected convertResendResponse(data: any): EmailResponse {
    return {
      accepted: data.to || [],
      rejected: [],
      ehlo: [],
      envelopeTime: 0,
      messageTime: 0,
      messageSize: 0,
      response: '200',
      envelope: {
        from: data.from || emailConfig.from,
        to: data.to || [],
      },
      messageId: data.id || '',
    };
  }
}
