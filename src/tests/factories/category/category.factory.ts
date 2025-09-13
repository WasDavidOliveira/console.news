import { faker } from '@faker-js/faker';
import { CreateCategoryModel, CategoryModel } from '@/types/models/v1/category.types';
import CategoryRepository from '@/repositories/v1/modules/category/category.repository';
import { CreateCategorySchema } from '@/validations/v1/modules/category.validations';
import { CategoryStatus } from '@/enums/v1/modules/category/category-status.enum';

type PartialCreateCategory = Partial<CreateCategoryModel>;

class CategoryFactoryBuilder {
  protected currentName: string;
  protected currentDescription: string;
  protected currentStatus: CategoryStatus;
  protected currentOverrides: PartialCreateCategory;

  constructor(overrides: PartialCreateCategory = {}) {
    this.currentName = faker.commerce.department();
    this.currentDescription = faker.lorem.sentence();
    this.currentStatus = CategoryStatus.ACTIVE;
    this.currentOverrides = overrides;
  }

  name(value: string): this {
    this.currentName = value;
    return this;
  }

  description(value: string): this {
    this.currentDescription = value;
    return this;
  }

  status(value: CategoryStatus): this {
    this.currentStatus = value;
    return this;
  }

  state(overrides: PartialCreateCategory): this {
    this.currentOverrides = { ...this.currentOverrides, ...overrides };
    return this;
  }

  make(): CreateCategoryModel {
    return {
      name: this.currentOverrides.name ?? this.currentName,
      description: this.currentOverrides.description ?? this.currentDescription,
      status: this.currentOverrides.status ?? this.currentStatus,
    };
  }

  async create(): Promise<CategoryModel> {
    const categoryData = this.make();
    const newCategory = await CategoryRepository.create(categoryData);

    return newCategory;
  }
}

export class CategoryFactory {
  static build(overrides: PartialCreateCategory = {}): CategoryFactoryBuilder {
    return new CategoryFactoryBuilder(overrides);
  }

  static async createCategory(
    overrides: Partial<CreateCategoryModel> = {},
  ): Promise<CategoryModel> {
    return await this.build(overrides).create();
  }

  static async createMultipleCategories(
    count: number,
    overrides: Partial<CreateCategoryModel> = {},
  ): Promise<CategoryModel[]> {
    const categories: CategoryModel[] = [];

    for (let i = 0; i < count; i++) {
      const category = await this.createCategory(overrides);
      categories.push(category);
    }

    return categories;
  }
}
