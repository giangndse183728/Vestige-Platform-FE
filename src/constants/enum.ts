// Product Status Enums
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  DELETED = 'DELETED',
  REPORTED = 'REPORTED',
  BANNED = 'BANNED',
  DRAFT = 'DRAFT'
}

// Blocked statuses where buy/add to cart should be hidden
export const BLOCKED_PRODUCT_STATUSES = [
  ProductStatus.INACTIVE,
  ProductStatus.SOLD,
  ProductStatus.DELETED,
  ProductStatus.REPORTED,
  ProductStatus.BANNED,
  ProductStatus.DRAFT
] as const;

// Status messages for blocked products
export const PRODUCT_STATUS_MESSAGES = {
  [ProductStatus.SOLD]: 'This item has been sold',
  [ProductStatus.INACTIVE]: 'This item is currently unavailable',
  [ProductStatus.DELETED]: 'This item has been removed',
  [ProductStatus.REPORTED]: 'This item is under review',
  [ProductStatus.BANNED]: 'This item is no longer available',
  [ProductStatus.DRAFT]: 'This item is still in draft mode'
} as const;

// Order Status Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID'
}

// Escrow Status Enums
export enum EscrowStatus {
  HOLDING = 'HOLDING',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

// Product Condition Enums
export enum ProductCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  USED_EXCELLENT = 'USED_EXCELLENT',
  USED_GOOD = 'USED_GOOD',
  FAIR = 'FAIR'
}

// User Trust Tier Enums
export enum TrustTier {
  NEW_SELLER = 'NEW_SELLER',
  RISING_SELLER = 'RISING_SELLER',
  PRO_SELLER = 'PRO_SELLER',
  ELITE_SELLER = 'ELITE_SELLER'
}

// Account Status Enums
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

// Gender Enums
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// Trust tier display names
export const TRUST_TIER_LABELS = {
  [TrustTier.NEW_SELLER]: 'ROOKIE',
  [TrustTier.RISING_SELLER]: '★ RISING',
  [TrustTier.PRO_SELLER]: '★★ PRO',
  [TrustTier.ELITE_SELLER]: '★★★ ELITE'
} as const;

// Trust tier display descriptions
export const TRUST_TIER_DESCRIPTIONS = {
  [TrustTier.NEW_SELLER]: 'New Seller',
  [TrustTier.RISING_SELLER]: 'Rising Seller',
  [TrustTier.PRO_SELLER]: 'Pro Seller',
  [TrustTier.ELITE_SELLER]: 'Elite Seller'
} as const;

// Trust tier requirements for tooltips
export const TRUST_TIER_REQUIREMENTS = {
  [TrustTier.NEW_SELLER]: {
    trustScore: 'N/A',
    completedSales: '< 10 completed sales',
    additionalRequirements: []
  },
  [TrustTier.RISING_SELLER]: {
    trustScore: '70 - 84',
    completedSales: '>= 10 completed sales',
    additionalRequirements: []
  },
  [TrustTier.PRO_SELLER]: {
    trustScore: '85 - 94',
    completedSales: '>= 25 sales',
    additionalRequirements: ['isLegitProfile is true']
  },
  [TrustTier.ELITE_SELLER]: {
    trustScore: '>= 95',
    completedSales: '>= 100 sales',
    additionalRequirements: ['isLegitProfile is true']
  }
} as const;
