import { faker } from '@faker-js/faker';
import {
  CreateSubscriptionModel,
  SubscriptionModel,
} from '@/types/models/v1/subscription.types';
import { CreateSubscriptionSchema } from '@/validations/v1/modules/subscription.validations';
import SubscriptionRepository from '@/repositories/v1/modules/subscription/subscription.repository';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { SubscriptionStatus } from '@/enums/v1/modules/subscription/subscription-status.enum';

type PartialCreateSubscription = Partial<CreateSubscriptionModel>;

class SubscriptionFactoryBuilder {
  protected currentUserId: number;
  protected currentOverrides: PartialCreateSubscription;

  constructor(overrides: PartialCreateSubscription = {}) {
    this.currentUserId = 0;
    this.currentOverrides = overrides;
  }

  userId(value: number): this {
    this.currentUserId = value;
    return this;
  }

  state(overrides: PartialCreateSubscription): this {
    this.currentOverrides = { ...this.currentOverrides, ...overrides };
    return this;
  }

  make(): CreateSubscriptionSchema {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
    };
  }

  async create(): Promise<{ subscription: SubscriptionModel; user: any }> {
    const { user } = await UserFactory.build().create();

    const subscriptionData: CreateSubscriptionModel = {
      userId: user.id,
      ...this.currentOverrides,
    };

    const subscription = await SubscriptionRepository.create(subscriptionData);

    return {
      subscription,
      user,
    };
  }

  async createWithUser(userId: number): Promise<SubscriptionModel> {
    const subscriptionData: CreateSubscriptionModel = {
      userId,
      ...this.currentOverrides,
    };

    return await SubscriptionRepository.create(subscriptionData);
  }

  async createActive(): Promise<{
    subscription: SubscriptionModel;
    user: any;
  }> {
    return await this.state({ isActive: true }).create();
  }

  async createInactive(): Promise<{
    subscription: SubscriptionModel;
    user: any;
  }> {
    return await this.state({ isActive: false }).create();
  }

  async createWithStatus(
    status: SubscriptionStatus,
  ): Promise<{ subscription: SubscriptionModel; user: any }> {
    return await this.state({ status }).create();
  }
}

export class SubscriptionFactory {
  static build(
    overrides: PartialCreateSubscription = {},
  ): SubscriptionFactoryBuilder {
    return new SubscriptionFactoryBuilder(overrides);
  }

  static async createSubscriptionWithUser(
    overrides: Partial<CreateSubscriptionModel> = {},
  ): Promise<{ subscription: SubscriptionModel; user: any }> {
    return await this.build(overrides).create();
  }

  static async createActiveSubscription(
    overrides: Partial<CreateSubscriptionModel> = {},
  ): Promise<{ subscription: SubscriptionModel; user: any }> {
    return await this.build(overrides).createActive();
  }

  static async createInactiveSubscription(
    overrides: Partial<CreateSubscriptionModel> = {},
  ): Promise<{ subscription: SubscriptionModel; user: any }> {
    return await this.build(overrides).createInactive();
  }

  static async createWithStatus(
    status: SubscriptionStatus,
    overrides: Partial<CreateSubscriptionModel> = {},
  ): Promise<{ subscription: SubscriptionModel; user: any }> {
    return await this.build(overrides).createWithStatus(status);
  }
}
