import { NotFoundError } from '@/utils/core/app-error.utils';
import CategoryRepository from '@/repositories/v1/modules/category/category.repository';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from '@/validations/v1/modules/category.validations';

export class CategoryService {
  async show() {
    const categories = await CategoryRepository.findAll();

    return categories;
  }

  async findById(id: number) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError('Categoria não encontrada');
    }

    return category;
  }

  async create(data: CreateCategorySchema) {
    const category = await CategoryRepository.create(data);

    return category;
  }

  async update(id: number, data: UpdateCategorySchema) {
    const existingCategory = await CategoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError('Categoria não encontrada');
    }

    const updatedCategory = await CategoryRepository.update(id, data);

    return updatedCategory;
  }

  async delete(id: number) {
    const existingCategory = await CategoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError('Categoria não encontrada');
    }

    await CategoryRepository.delete(id);
  }
}

export default new CategoryService();
