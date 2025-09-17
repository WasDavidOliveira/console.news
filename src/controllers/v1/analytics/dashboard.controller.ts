import { Request, Response } from 'express';
import { DashboardService } from '@/services/v1/analytics/dashboard.service';
import { StatusCode } from '@/constants/status-code.constants';

export class DashboardController {
  protected dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getAnalytics = async (req: Request, res: Response) => {
    const analytics = await this.dashboardService.getAnalytics();

    res.status(StatusCode.OK).json({
      message: 'Analytics do dashboard obtidas com sucesso',
      data: analytics,
    });
  };
}

export default new DashboardController();
