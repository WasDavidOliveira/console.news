import { faker } from '@faker-js/faker';
import {
  CreateTemplateModel,
  TemplateModel,
} from '@/types/models/v1/template.types';
import TemplateRepository from '@/repositories/v1/modules/template/template.repository';
import { CreateTemplateSchema } from '@/validations/v1/modules/template.validations';
import { TemplateVariable } from '@/enums/v1/modules/template/template-variables.enum';

type PartialCreateTemplate = Partial<CreateTemplateModel>;

class TemplateFactoryBuilder {
  protected currentName: string;
  protected currentDescription: string;
  protected currentHtml: string;
  protected currentText: string;
  protected currentCss: string;
  protected currentVariables: TemplateVariable[];
  protected currentIsActive: boolean;
  protected currentOverrides: PartialCreateTemplate;

  constructor(overrides: PartialCreateTemplate = {}) {
    this.currentName = faker.lorem.words(3);
    this.currentDescription = faker.lorem.sentence();
    this.currentHtml = `<html><body><h1>{{title}}</h1><div>{{content}}</div></body></html>`;
    this.currentText = '{{title}}\n\n{{content}}';
    this.currentCss = 'body { font-family: Arial, sans-serif; }';
    this.currentVariables = [TemplateVariable.TITLE, TemplateVariable.CONTENT];
    this.currentIsActive = true;
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

  html(value: string): this {
    this.currentHtml = value;
    return this;
  }

  text(value: string): this {
    this.currentText = value;
    return this;
  }

  css(value: string): this {
    this.currentCss = value;
    return this;
  }

  variables(value: TemplateVariable[]): this {
    this.currentVariables = value;
    return this;
  }

  isActive(value: boolean): this {
    this.currentIsActive = value;
    return this;
  }

  state(overrides: PartialCreateTemplate): this {
    this.currentOverrides = { ...this.currentOverrides, ...overrides };
    return this;
  }

  make(): CreateTemplateModel {
    return {
      name: this.currentOverrides.name ?? this.currentName,
      description: this.currentOverrides.description ?? this.currentDescription,
      html: this.currentOverrides.html ?? this.currentHtml,
      text: this.currentOverrides.text ?? this.currentText,
      css: this.currentOverrides.css ?? this.currentCss,
      variables: this.currentOverrides.variables ?? this.currentVariables,
      isActive: this.currentOverrides.isActive ?? this.currentIsActive,
    };
  }

  async create(): Promise<TemplateModel> {
    const templateData = this.make();
    const newTemplate = await TemplateRepository.create(templateData);

    return newTemplate;
  }
}

export class TemplateFactory {
  static build(overrides: PartialCreateTemplate = {}): TemplateFactoryBuilder {
    return new TemplateFactoryBuilder(overrides);
  }

  static async createTemplate(
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel> {
    return await this.build(overrides).create();
  }

  static async createMultipleTemplates(
    count: number,
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel[]> {
    const templates: TemplateModel[] = [];

    for (let i = 0; i < count; i++) {
      const template = await this.createTemplate(overrides);
      templates.push(template);
    }

    return templates;
  }

  static async createActiveTemplate(
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel> {
    return await this.createTemplate({ ...overrides, isActive: true });
  }

  static async createInactiveTemplate(
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel> {
    return await this.createTemplate({ ...overrides, isActive: false });
  }

  static async createMultipleActiveTemplates(
    count: number,
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel[]> {
    return await this.createMultipleTemplates(count, {
      ...overrides,
      isActive: true,
    });
  }

  static async createMultipleInactiveTemplates(
    count: number,
    overrides: Partial<CreateTemplateModel> = {},
  ): Promise<TemplateModel[]> {
    return await this.createMultipleTemplates(count, {
      ...overrides,
      isActive: false,
    });
  }
}
