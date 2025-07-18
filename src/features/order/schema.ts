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
  paymentMethod: z.enum(['COD', 'PAYOS']),
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

export const buyerSchema = z.object({
  userId: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
});

export const escrowStatusEnum = z.enum(['HOLDING', 'RELEASED', 'REFUNDED', 'CANCELLED']);

// Order status (overall order)
export const orderStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'EXPIRED']);

// OrderItem status (individual items)
export const orderItemStatusEnum = z.enum(['PENDING', 'PROCESSING', 'AWAITING_PICKUP', 'IN_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED']);

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
  orderItemId: z.number(),
  productId: z.number(),
  productTitle: z.string(),
  productImage: z.string().nullable(),
  price: z.number(),
  sellerUsername: z.string(),
  sellerIsLegitProfile: z.boolean(),
  escrowStatus: escrowStatusEnum,
  itemStatus: orderItemStatusEnum,
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
  paidAt: z.string().nullable(),
  stripePaymentIntentId: z.string().optional(),
  orderItems: z.array(orderItemDetailSchema),
  shippingAddress: addressSchema.omit({ isDefault: true, createdAt: true }),
  itemsBySeller: z.record(z.array(orderItemDetailSchema)),
  metadata: orderMetadataSchema.optional(),
  buyer: buyerSchema,
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type OrderProduct = z.infer<typeof orderProductSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Buyer = z.infer<typeof buyerSchema>;
export type OrderItemDetail = z.infer<typeof orderItemDetailSchema>;
export type OrderMetadata = z.infer<typeof orderMetadataSchema>;
export type Order = z.infer<typeof orderSchema>;
export type EscrowStatus = z.infer<typeof escrowStatusEnum>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type OrderItemStatus = z.infer<typeof orderItemStatusEnum>;
export type OrderItemSummary = z.infer<typeof orderItemSummarySchema>;
export type ActualOrder = z.infer<typeof actualOrderSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

// Logistics schemas for shipper functionality
export const pickupItemSchema = z.object({
  orderItemId: z.number(),
  status: orderStatusEnum,
  product: orderProductSchema,
  seller: sellerSchema,
  order: z.object({
    shippingAddress: addressSchema.omit({ isDefault: true, createdAt: true }),
  }),
});

export const pickupListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(pickupItemSchema),
});

export const confirmPickupRequestSchema = z.object({
  photoUrls: z.array(z.string().url()),
});

export const confirmDeliveryRequestSchema = z.object({
  photoUrls: z.array(z.string().url()),
});

export type PickupItem = z.infer<typeof pickupItemSchema>;
export type PickupListResponse = z.infer<typeof pickupListResponseSchema>;
export type ConfirmPickupRequest = z.infer<typeof confirmPickupRequestSchema>;
export type ConfirmDeliveryRequest = z.infer<typeof confirmDeliveryRequestSchema>;
