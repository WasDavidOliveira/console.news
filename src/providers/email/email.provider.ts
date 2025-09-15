import nodemailer from 'nodemailer';
import { EmailOptions } from '@/types/models/v1/email.types';
import { emailConfig } from '@/configs/email.config';

export class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: options.from || emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async verifyConnection(): Promise<boolean> {
    return await this.transporter.verify();
  }
}

export default new EmailProvider();
