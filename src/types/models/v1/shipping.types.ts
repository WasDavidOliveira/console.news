import { ShippingStatus } from '@/enums/v1/modules/shipping/shipping-status.enum';

export interface ShippingModel {
  id: number;
  newsletterId: number | null;
  userId: number | null;
  description: string;
  status: ShippingStatus;
  bouncedAt: Date | null;
  failedAt: Date | null;
  deliveredAt: Date | null;
  openedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShippingModel {
  newsletterId: number;
  userId: number;
  description: string;
  status?: ShippingStatus;
}

export interface UpdateShippingModel {
  description?: string;
  status?: ShippingStatus;
  bouncedAt?: Date | null;
  failedAt?: Date | null;
  deliveredAt?: Date | null;
  openedAt?: Date | null;
}
