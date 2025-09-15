import { IEmailProvider } from '@/types/providers/email-provider.interface';
import { SmtpEmailProvider } from './smtp/smtp-email.provider';
import { ResendEmailProvider } from './resend/resend-email.provider';
import { emailConfig } from '@/configs/email.config';

const providers = new Map<string, () => IEmailProvider>();
providers.set('smtp', () => new SmtpEmailProvider());
providers.set('resend', () => new ResendEmailProvider());

export class EmailProviderFactory {
  static createProvider(): IEmailProvider {
    const providerFactory = providers.get(emailConfig.provider);
    
    if (!providerFactory) {
      throw new Error(`Provider '${emailConfig.provider}' não suportado`);
    }

    return providerFactory();
  }
}

export default EmailProviderFactory.createProvider();
