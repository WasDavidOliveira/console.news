export interface DashboardAnalytics {
  subscribers: {
    active: number;
    total: number;
  };
  newsletters: {
    created: number;
    sent: number;
  };
  categories: {
    total: number;
  };
  templates: {
    active: number;
  };
}
