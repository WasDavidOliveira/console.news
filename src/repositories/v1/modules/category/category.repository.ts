import { categories } from '@/db/schema/v1/category.schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import {
  CategoryModel,
  CreateCategoryModel,
  UpdateCategoryModel,
} from '@/types/models/v1/category.types';

export class CategoryRepository {
  async findById(id: number): Promise<CategoryModel | null> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return category ?? null;
  }

  async findAll(): Promise<CategoryModel[]> {
    const categoriesResults = await db.select().from(categories);

    return categoriesResults;
  }

  async update(
    id: number,
    category: UpdateCategoryModel,
  ): Promise<CategoryModel> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  async create(category: CreateCategoryModel): Promise<CategoryModel> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();

    return newCategory;
  }
}

export default new CategoryRepository();
