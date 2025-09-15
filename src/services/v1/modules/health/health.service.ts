import { db } from '@/db/db.connection';
import appConfig from '@/configs/app.config';

export class HealthService {
  async getSimpleStatus() {
    return {
      message: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  async getDetailedStatus() {
    await db.execute('SELECT 1');

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: appConfig.nodeEnv,
      version: process.env.npm_package_version ?? '1.0.0',
      database: 'connected',
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
      },
    };
  }
}

export default new HealthService();
