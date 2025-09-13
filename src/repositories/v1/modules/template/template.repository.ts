import { templates } from '@/db/schema/v1/template.schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import {
  TemplateModel,
  CreateTemplateModel,
  UpdateTemplateModel,
} from '@/types/models/v1/template.types';

export class TemplateRepository {
  async findById(id: number): Promise<TemplateModel | null> {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    return template ?? null;
  }

  async findAll(): Promise<TemplateModel[]> {
    const templatesResults = await db.select().from(templates);

    return templatesResults;
  }

  async findByActive(isActive: boolean = true): Promise<TemplateModel[]> {
    const templatesResults = await db
      .select()
      .from(templates)
      .where(eq(templates.isActive, isActive));

    return templatesResults;
  }

  async update(
    id: number,
    template: UpdateTemplateModel,
  ): Promise<TemplateModel> {
    const [updatedTemplate] = await db
      .update(templates)
      .set({
        ...template,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning();

    return updatedTemplate;
  }

  async create(template: CreateTemplateModel): Promise<TemplateModel> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();

    return newTemplate;
  }

  async delete(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }
}

export default new TemplateRepository();
