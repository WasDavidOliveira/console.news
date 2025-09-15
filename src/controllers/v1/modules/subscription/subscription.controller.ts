import { Request, Response } from 'express';
import { SubscriptionService } from '@/services/v1/modules/subscription/subscription.service';
import { SubscriptionResource } from '@/resources/v1/modules/subscription/subscription.resource';
import { StatusCode } from '@/constants/status-code.constants';
import { SubscriptionQuerySchema } from '@/validations/v1/modules/subscription.validations';

export class SubscriptionController {
  protected subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  index = async (req: Request, res: Response) => {
    const query = req.query as SubscriptionQuerySchema;
    const subscriptions = await this.subscriptionService.index(query);

    res.status(StatusCode.OK).json({
      message: 'Inscrições encontradas com sucesso',
      data: SubscriptionResource.collectionToResponse(subscriptions),
    });
  };

  show = async (req: Request, res: Response) => {
    const subscription = await this.subscriptionService.show(
      Number(req.params.id),
    );

    res.status(StatusCode.OK).json({
      message: 'Inscrição encontrada com sucesso',
      data: SubscriptionResource.toResponse(subscription),
    });
  };

  create = async (req: Request, res: Response) => {
    const subscription = await this.subscriptionService.create(req.body);

    res.status(StatusCode.CREATED).json({
      message: 'Inscrição criada com sucesso',
      data: SubscriptionResource.toResponse(subscription),
    });
  };

  update = async (req: Request, res: Response) => {
    const subscription = await this.subscriptionService.update(
      Number(req.params.id),
      req.body,
    );

    res.status(StatusCode.OK).json({
      message: 'Inscrição atualizada com sucesso',
      data: SubscriptionResource.toResponse(subscription),
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.subscriptionService.delete(Number(req.params.id));

    res.status(StatusCode.OK).json({
      message: 'Inscrição removida com sucesso',
    });
  };

  activate = async (req: Request, res: Response) => {
    const subscription = await this.subscriptionService.activate(
      Number(req.params.id),
    );

    res.status(StatusCode.OK).json({
      message: 'Inscrição ativada com sucesso',
      data: SubscriptionResource.toResponse(subscription),
    });
  };

  deactivate = async (req: Request, res: Response) => {
    const subscription = await this.subscriptionService.deactivate(
      Number(req.params.id),
    );

    res.status(StatusCode.OK).json({
      message: 'Inscrição desativada com sucesso',
      data: SubscriptionResource.toResponse(subscription),
    });
  };

  findByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    const subscriptions = await this.subscriptionService.findByEmail(email);

    res.status(StatusCode.OK).json({
      message: 'Inscrições encontradas com sucesso',
      data: SubscriptionResource.collectionToResponse(subscriptions),
    });
  };
}

export default new SubscriptionController();
