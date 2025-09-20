import express from 'express';
import 'dotenv/config';
import appConfig from '@/configs/app.config';
import { logger } from '@/utils/core/logger.utils';
import { bootstrapMiddlewares } from '@/middlewares/core/bootstrap.middleware';
import newsletterCronService from '@/services/infrastructure/newsletter-cron.service';

const app = express();

bootstrapMiddlewares(app);

app.listen(appConfig.port, () => {
  logger.serverStartup(appConfig.nodeEnv, appConfig.port as number);

  newsletterCronService.startNewsletterCron();
});

export default app;
