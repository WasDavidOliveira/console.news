import { NotFoundError, ConflictError } from '@/utils/core/app-error.utils';
import SubscriptionRepository from '@/repositories/v1/modules/subscription/subscription.repository';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionQuerySchema,
} from '@/validations/v1/modules/subscription.validations';
import bcrypt from 'bcrypt';

export class SubscriptionService {
  async index(query?: SubscriptionQuerySchema) {
    if (query) {
      return await SubscriptionRepository.findByQuery(query);
    }

    return await SubscriptionRepository.findAll();
  }

  async show(id: number) {
    const subscription = await SubscriptionRepository.findById(id);

    if (!subscription) {
      throw new NotFoundError('Inscrição não encontrada');
    }

    return subscription;
  }

  async create(data: CreateSubscriptionSchema) {
    let user = await UserRepository.findByEmail(data.email);

    if (!user) {
      const password = String(data.email + data.name).toLowerCase().trim();
      
      const passwordHash = await bcrypt.hash(password, 10);

      user = await UserRepository.create({
        name: data.name,
        email: data.email,
        password: passwordHash,
      });
    }

    const existingActiveSubscription = await SubscriptionRepository.findActiveByUserId(user.id);

    if (existingActiveSubscription) {
      throw new ConflictError('Usuário já possui uma inscrição ativa');
    }

    const subscription = await SubscriptionRepository.create({
      userId: user.id,
    });

    return subscription;
  }

  async update(id: number, data: UpdateSubscriptionSchema) {
    const existingSubscription = await SubscriptionRepository.findById(id);

    if (!existingSubscription) {
      throw new NotFoundError('Inscrição não encontrada');
    }

    const updatedSubscription = await SubscriptionRepository.update(id, data);

    return updatedSubscription;
  }

  async delete(id: number) {
    const existingSubscription = await SubscriptionRepository.findById(id);

    if (!existingSubscription) {
      throw new NotFoundError('Inscrição não encontrada');
    }

    await SubscriptionRepository.delete(id);
  }

  async activate(id: number) {
    const existingSubscription = await SubscriptionRepository.findById(id);

    if (!existingSubscription) {
      throw new NotFoundError('Inscrição não encontrada');
    }

    const activatedSubscription = await SubscriptionRepository.activate(id);

    return activatedSubscription;
  }

  async deactivate(id: number) {
    const existingSubscription = await SubscriptionRepository.findById(id);

    if (!existingSubscription) {
      throw new NotFoundError('Inscrição não encontrada');
    }

    const deactivatedSubscription = await SubscriptionRepository.deactivate(id);

    return deactivatedSubscription;
  }

  async findByEmail(email: string) {
    const subscriptions = await SubscriptionRepository.findByEmail(email);

    return subscriptions;
  }
}

export default new SubscriptionService();
