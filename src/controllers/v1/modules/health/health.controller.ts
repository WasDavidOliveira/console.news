import { Request, Response } from 'express';
import { HealthService } from '@/services/v1/modules/health/health.service';
import { StatusCode } from '@/constants/status-code.constants';

export class HealthController {
  protected healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  check = async (req: Request, res: Response) => {
    const healthStatus = await this.healthService.getDetailedStatus();

    res.status(StatusCode.OK).json({
      message: 'API está funcionando corretamente',
      data: healthStatus,
    });
  };

  simple = async (req: Request, res: Response) => {
    const status = await this.healthService.getSimpleStatus();

    res.status(StatusCode.OK).json(status);
  };
}

export default new HealthController();
