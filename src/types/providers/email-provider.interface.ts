import { EmailOptions, EmailResponse } from '@/types/models/v1/email.types';

export interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResponse>;
  verifyConnection(): Promise<boolean>;
}
