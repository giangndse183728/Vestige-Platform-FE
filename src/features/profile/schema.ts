import * as z from "zod";
import { TrustTier, AccountStatus, Gender } from "@/constants/enum";

export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.string()
    .regex(/^(\+?\d{1,3}[- ]?)?\d{9,10}$/, { message: "Invalid phone number format" })
    .optional()
    .nullable(),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" })
    .optional()
    .nullable(),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.PREFER_NOT_TO_SAY])
    .optional()
    .nullable(),
  bio: z.string()
    .max(250, { message: "Bio must be less than 250 characters" })
    .optional()
    .nullable(),
  profilePictureUrl: z.string()
    .url({ message: "Invalid URL format" })
    .optional()
    .nullable(),
});

export const profileStatsSchema = z.object({
  sellerRating: z.number().min(0).max(5),
  trustScore: z.number().min(0).max(5),
  trustTier: z.enum([TrustTier.NEW_SELLER, TrustTier.RISING_SELLER, TrustTier.PRO_SELLER, TrustTier.ELITE_SELLER]),
  successfulTransactions: z.number().min(0),
  totalProductsListed: z.number().min(0),
  activeProductsCount: z.number().min(0),
  soldProductsCount: z.number().min(0),
  sellerReviewsCount: z.number().min(0),
  lastLoginAt: z.string().datetime(),
  joinedDate: z.string().datetime(),
});

export const profileUserSchema = profileFormSchema.extend({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  isVerified: z.boolean(),
  accountStatus: z.enum([AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.SUSPENDED, AccountStatus.PENDING]),
}).merge(profileStatsSchema);

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ProfileStats = z.infer<typeof profileStatsSchema>;
export type ProfileUser = z.infer<typeof profileUserSchema>;

export const addressSchema = z.object({
  addressId: z.number(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string()
});

export const addressFormSchema = z.object({
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().default(false)
});

export const addressesResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(addressSchema),
  metadata: z.record(z.any()),
  errors: z.array(z.string())
});

export type Address = z.infer<typeof addressSchema>;
export type AddressFormData = z.infer<typeof addressFormSchema>;
export type AddressesResponse = z.infer<typeof addressesResponseSchema>; 