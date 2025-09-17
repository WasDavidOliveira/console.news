import { db } from '@/db/db.connection';
import { sql } from 'drizzle-orm';
import { DashboardAnalytics } from '@/types/models/v1/dashboard.types';

export class DashboardRepository {
  async getAnalytics(): Promise<DashboardAnalytics> {
    const result = await db.execute(sql`
      SELECT 
        -- Assinantes ativos
        (SELECT COUNT(*) FROM subscriptions 
         WHERE is_active = true AND status = 'A') as active_subscribers,
        
        -- Total de assinantes
        (SELECT COUNT(*) FROM subscriptions) as total_subscribers,
        
        -- Newsletters criadas
        (SELECT COUNT(*) FROM newsletter) as created_newsletters,
        
        -- Newsletters enviadas
        (SELECT COUNT(*) FROM newsletter WHERE status = 'S') as sent_newsletters,
        
        -- Categorias ativas
        (SELECT COUNT(*) FROM categories WHERE status = 'A') as total_categories,
        
        -- Templates ativos
        (SELECT COUNT(*) FROM templates WHERE is_active = true) as active_templates
    `);

    const data = result.rows[0] as {
      active_subscribers: number;
      total_subscribers: number;
      created_newsletters: number;
      sent_newsletters: number;
      total_categories: number;
      active_templates: number;
    };

    return {
      subscribers: {
        active: data.active_subscribers,
        total: data.total_subscribers,
      },
      newsletters: {
        created: data.created_newsletters,
        sent: data.sent_newsletters,
      },
      categories: {
        total: data.total_categories,
      },
      templates: {
        active: data.active_templates,
      },
    };
  }
}

export default new DashboardRepository();
