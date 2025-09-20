export const newsletterCronConfig = {
  enabled: process.env.NEWSLETTER_CRON_ENABLED === 'true',
  timezone: process.env.NEWSLETTER_CRON_TIMEZONE ?? 'America/Sao_Paulo',

  weekly: {
    enabled: process.env.WEEKLY_NEWSLETTER_ENABLED === 'true',
    schedule: process.env.WEEKLY_NEWSLETTER_SCHEDULE ?? '0 8 * * 1',
    description: 'Newsletter semanal às segundas às 8h',
  },

  batch: {
    maxEmailsPerBatch: parseInt(process.env.MAX_EMAILS_PER_BATCH ?? '100'),
    delayBetweenBatches: parseInt(process.env.DELAY_BETWEEN_BATCHES ?? '1000'),
  },

  retry: {
    maxRetries: parseInt(process.env.NEWSLETTER_MAX_RETRIES ?? '3'),
    retryDelay: parseInt(process.env.NEWSLETTER_RETRY_DELAY ?? '5000'),
  },
};
