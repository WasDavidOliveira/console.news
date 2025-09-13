import { Request, Response } from 'express';
import { TemplateService } from '@/services/v1/modules/template/template.service';
import { TemplateResource } from '@/resources/v1/modules/template/template.resource';
import { StatusCode } from '@/constants/status-code.constants';
import { TemplateQuerySchema } from '@/validations/v1/modules/template.validations';

export class TemplateController {
  protected templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  show = async (req: Request, res: Response) => {
    const query = req.query as TemplateQuerySchema;
    const templates = await this.templateService.show(query);

    res.status(StatusCode.OK).json({
      message: 'Templates encontrados com sucesso.',
      data: TemplateResource.collectionToResponse(templates),
    });
  };

  findById = async (req: Request, res: Response) => {
    const template = await this.templateService.findById(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Template encontrado com sucesso.',
      data: TemplateResource.toResponse(template),
    });
  };

  create = async (req: Request, res: Response) => {
    const template = await this.templateService.create(req.body);

    res.status(StatusCode.CREATED).json({
      message: 'Template criado com sucesso.',
      data: TemplateResource.toResponse(template),
    });
  };

  update = async (req: Request, res: Response) => {
    const template = await this.templateService.update(
      Number(req.params.id),
      req.body,
    );

    res.status(StatusCode.OK).json({
      message: 'Template atualizado com sucesso.',
      data: TemplateResource.toResponse(template),
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.templateService.delete(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Template removido com sucesso.',
    });
  };

  activate = async (req: Request, res: Response) => {
    const template = await this.templateService.activate(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Template ativado com sucesso.',
      data: TemplateResource.toResponse(template),
    });
  };

  deactivate = async (req: Request, res: Response) => {
    const template = await this.templateService.deactivate(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Template desativado com sucesso.',
      data: TemplateResource.toResponse(template),
    });
  };

  preview = async (req: Request, res: Response) => {
    const templates = await this.templateService.show({ active: true });

    res.status(StatusCode.OK).json({
      message: 'Templates para preview encontrados com sucesso.',
      data: TemplateResource.collectionToResponseForPreview(templates),
    });
  };
}

export default new TemplateController();
