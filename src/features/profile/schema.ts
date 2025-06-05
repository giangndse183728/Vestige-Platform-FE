import * as z from "zod";

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
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"])
    .optional()
    .nullable(),
  bio: z.string()
    .max(200, { message: "Bio must be less than 200 characters" })
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
  accountStatus: z.enum(["active", "suspended", "pending"]),
}).merge(profileStatsSchema);

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ProfileStats = z.infer<typeof profileStatsSchema>;
export type ProfileUser = z.infer<typeof profileUserSchema>; 