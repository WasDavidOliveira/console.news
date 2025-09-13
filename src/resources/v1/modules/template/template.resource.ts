import { TemplateModel } from '@/types/models/v1/template.types';

export class TemplateResource {
  static toResponse(template: TemplateModel) {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      html: template.html,
      text: template.text,
      css: template.css,
      variables: template.variables,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  static toResponseBasic(template: TemplateModel) {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  static toResponseForPreview(template: TemplateModel) {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      variables: template.variables,
      isActive: template.isActive,
    };
  }

  static collectionToResponse(templates: TemplateModel[]) {
    return templates.map(template => this.toResponse(template));
  }

  static collectionToResponseBasic(templates: TemplateModel[]) {
    return templates.map(template => this.toResponseBasic(template));
  }

  static collectionToResponseForPreview(templates: TemplateModel[]) {
    return templates.map(template => this.toResponseForPreview(template));
  }
}
