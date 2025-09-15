export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface NewsletterEmailData {
  userName: string;
  userEmail: string;
  newsletterTitle: string;
  newsletterContent: string;
}
