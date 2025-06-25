import { z } from 'zod';
import { sellerSchema } from '@/features/products/schema';
import { addressSchema } from '@/features/profile/schema';

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

// Create a product schema for order responses 
export const orderProductSchema = z.object({
  productId: z.number(),
  title: z.string(),
  description: z.string(),
  condition: z.string(),
  size: z.string().nullable(),
  color: z.string().nullable(),
  primaryImageUrl: z.string(),
  shippingFee: z.number(),
  categoryId: z.number(),
  categoryName: z.string(),
  brandId: z.number(),
  brandName: z.string(),
});

export const transactionSchema = z.object({
  transactionId: z.number(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  shippedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  buyerProtectionEligible: z.boolean(),
});

export const escrowStatusEnum = z.enum(['HOLDING', 'RELEASED', 'REFUNDED', 'CANCELLED']);
export const orderStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'EXPIRED', 'PAID', 'PROCESSING']);

export const orderItemDetailSchema = z.object({
  orderItemId: z.number(),
  price: z.number(),
  platformFee: z.number(),
  feePercentage: z.number(),
  notes: z.string().optional(),
  status: orderStatusEnum,
  escrowStatus: escrowStatusEnum,
  product: orderProductSchema,
  seller: sellerSchema,
  transaction: transactionSchema,
});


export const orderItemSummarySchema = z.object({
  productId: z.number(),
  productTitle: z.string(),
  productImage: z.string().nullable(),
  price: z.number(),
  sellerUsername: z.string(),
  sellerIsLegitProfile: z.boolean(),
  escrowStatus: escrowStatusEnum,
  itemStatus: orderStatusEnum,
});

export const actualOrderSchema = z.object({
  orderId: z.number(),
  status: orderStatusEnum,
  totalAmount: z.number(),
  totalShippingFee: z.number(),
  totalItems: z.number(),
  uniqueSellers: z.number(),
  createdAt: z.string(),
  paidAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
  itemSummaries: z.array(orderItemSummarySchema),
  overallEscrowStatus: escrowStatusEnum.nullable(),
  totalPlatformFee: z.number(),
});

export const paginationSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const ordersResponseSchema = z.object({
  content: z.array(actualOrderSchema),
  pagination: paginationSchema,
  filters: z.any().nullable(),
});

export const orderMetadataSchema = z.object({
  clientSecret: z.string(),
});

export const orderSchema = z.object({
  orderId: z.number(),
  status: orderStatusEnum,
  totalAmount: z.number(),
  totalShippingFee: z.number(),
  totalPlatformFee: z.number(),
  totalItems: z.number(),
  uniqueSellers: z.number(),
  createdAt: z.string(),
  stripePaymentIntentId: z.string().optional(),
  orderItems: z.array(orderItemDetailSchema),
  shippingAddress: addressSchema.omit({ isDefault: true, createdAt: true }),
  itemsBySeller: z.record(z.array(orderItemDetailSchema)),
  metadata: orderMetadataSchema.optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type OrderProduct = z.infer<typeof orderProductSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type OrderItemDetail = z.infer<typeof orderItemDetailSchema>;
export type OrderMetadata = z.infer<typeof orderMetadataSchema>;
export type Order = z.infer<typeof orderSchema>;
export type EscrowStatus = z.infer<typeof escrowStatusEnum>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type OrderItemSummary = z.infer<typeof orderItemSummarySchema>;
export type ActualOrder = z.infer<typeof actualOrderSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;
