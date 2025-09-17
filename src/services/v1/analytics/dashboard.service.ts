import { DashboardAnalytics } from '@/types/models/v1/dashboard.types';
import { DashboardRepository } from '@/repositories/v1/analytics/dashboard.repository';

export class DashboardService {
  protected dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getAnalytics(): Promise<DashboardAnalytics> {
    return this.dashboardRepository.getAnalytics();
  }
}

export default new DashboardService();
