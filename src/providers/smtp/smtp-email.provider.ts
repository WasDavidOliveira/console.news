import nodemailer from 'nodemailer';
import { EmailOptions, EmailResponse } from '@/types/models/v1/email.types';
import { emailConfig } from '@/configs/email.config';
import { IEmailProvider } from '@/types/providers/email-provider.interface';

export class SmtpEmailProvider implements IEmailProvider {
  protected transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    const mailOptions = {
      from: options.from ?? emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const response = await this.transporter.sendMail(mailOptions);

    return response;
  }

  async verifyConnection(): Promise<boolean> {
    return await this.transporter.verify();
  }
}
