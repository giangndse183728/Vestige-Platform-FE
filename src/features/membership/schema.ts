import { z } from "zod";

export const feeTierSchema = z.object({
  tierId: z.number(),
  name: z.string(),
  feePercentage: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const membershipPlanSchema = z.object({
  planId: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  boostsPerMonth: z.number(),
  payosPriceId: z.string().nullable(),
  requiredTrustTier: z.enum(["RISING_SELLER", "PRO_SELLER", "ELITE_SELLER"]),
  feeTier: feeTierSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  active: z.boolean(),
});

export const membershipPlansResponseSchema = z.object({
  message: z.string(),
  data: z.array(membershipPlanSchema),
});

export const subscriptionPaymentResponseSchema = z.object({
  message: z.string(),
  data: z.string(), 
});

// Updated schema to match actual API response
export const currentSubscriptionPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export const currentSubscriptionSchema = z.object({
  id: z.number(),
  userId: z.number(),
  username: z.string(),
  email: z.string(),
  roleName: z.string(),
  plan: currentSubscriptionPlanSchema,
  status: z.enum(["ACTIVE", "CANCELLED", "EXPIRED", "PENDING"]),
  startDate: z.string(),
  endDate: z.string(),
  payosSubscriptionId: z.string(),
});

export const currentSubscriptionResponseSchema = z.object({
  message: z.string(),
  data: currentSubscriptionSchema,
});

export type FeeTier = z.infer<typeof feeTierSchema>;
export type MembershipPlan = z.infer<typeof membershipPlanSchema>;
export type MembershipPlansResponse = z.infer<typeof membershipPlansResponseSchema>;
export type SubscriptionPaymentResponse = z.infer<typeof subscriptionPaymentResponseSchema>;
export type CurrentSubscription = z.infer<typeof currentSubscriptionSchema>;
export type CurrentSubscriptionResponse = z.infer<typeof currentSubscriptionResponseSchema>;
export type CurrentSubscriptionPlan = z.infer<typeof currentSubscriptionPlanSchema>; 