import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.number(),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
  shippingAddressId: z.number(),
  paymentMethod: z.enum(['COD', 'STRIPE_CARD']),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;

export interface Order {
  orderId: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Address {
  addressId: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
