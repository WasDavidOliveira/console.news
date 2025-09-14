import { SubscriptionModel } from '@/types/models/v1/subscription.types';

export class SubscriptionResource {
  static toResponse(subscription: SubscriptionModel) {
    return {
      id: subscription.id,
      userId: subscription.userId,
      status: subscription.status,
      isActive: subscription.isActive,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  static collectionToResponse(subscriptions: SubscriptionModel[]) {
    return subscriptions.map(subscription => this.toResponse(subscription));
  }
}
