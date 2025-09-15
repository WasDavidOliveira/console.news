import { NotFoundError } from '@/utils/core/app-error.utils';
import TemplateRepository from '@/repositories/v1/modules/template/template.repository';
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  TemplateQuerySchema,
} from '@/validations/v1/modules/template.validations';

export class TemplateService {
  async index(query?: TemplateQuerySchema) {
    if (query?.active !== undefined) {
      const templates = await TemplateRepository.findByActive(query.active);
      return templates;
    }

    const templates = await TemplateRepository.findAll();
    return templates;
  }

  async show(id: number) {
    const template = await TemplateRepository.findById(id);

    if (!template) {
      throw new NotFoundError('Template não encontrado');
    }

    return template;
  }

  async findById(id: number) {
    const template = await TemplateRepository.findById(id);

    if (!template) {
      throw new NotFoundError('Template não encontrado');
    }

    return template;
  }

  async create(data: CreateTemplateSchema) {
    const template = await TemplateRepository.create(data);

    return template;
  }

  async update(id: number, data: UpdateTemplateSchema) {
    const existingTemplate = await TemplateRepository.findById(id);

    if (!existingTemplate) {
      throw new NotFoundError('Template não encontrado');
    }

    const updatedTemplate = await TemplateRepository.update(id, data);

    return updatedTemplate;
  }

  async delete(id: number) {
    const existingTemplate = await TemplateRepository.findById(id);

    if (!existingTemplate) {
      throw new NotFoundError('Template não encontrado');
    }

    await TemplateRepository.delete(id);
  }

  async activate(id: number) {
    const existingTemplate = await TemplateRepository.findById(id);

    if (!existingTemplate) {
      throw new NotFoundError('Template não encontrado');
    }

    const activatedTemplate = await TemplateRepository.update(id, {
      isActive: true,
    });

    return activatedTemplate;
  }

  async deactivate(id: number) {
    const existingTemplate = await TemplateRepository.findById(id);

    if (!existingTemplate) {
      throw new NotFoundError('Template não encontrado');
    }

    const deactivatedTemplate = await TemplateRepository.update(id, {
      isActive: false,
    });

    return deactivatedTemplate;
  }

  async getActiveTemplates() {
    const templates = await TemplateRepository.findByActive(true);
    return templates;
  }
}

export default new TemplateService();
