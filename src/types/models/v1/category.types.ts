import { categories } from '@/db/schema/v1/category.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type CategoryModel = InferSelectModel<typeof categories>;
export type CreateCategoryModel = InferInsertModel<typeof categories>;
export type UpdateCategoryModel = Partial<CreateCategoryModel>;