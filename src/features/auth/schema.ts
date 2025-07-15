import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupBaseSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(5, { message: "Username must be at least 5 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
    .refine((val) => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
    .refine((val) => /[0-9]/.test(val), { message: "Password must contain at least one number" })
    .refine((val) => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special character" }),
  firstName: z.string()
    .min(1, { message: "First name is required" })
    .regex(/^[A-Za-z\s'-]+$/, { message: "First name can only contain letters, spaces, apostrophes and hyphens" }),
  lastName: z.string()
    .min(1, { message: "Last name is required" })
    .regex(/^[A-Za-z\s'-]+$/, { message: "Last name can only contain letters, spaces, apostrophes and hyphens" }),
  phoneNumber: z.string()
    .regex(/^(\+?\d{1,3}[- ]?)?\d{9,10}$/, { message: "Invalid phone number format" }),
});

export const signupSchema = signupBaseSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupPayload = z.infer<typeof signupBaseSchema>;

export interface AuthUser {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  gender?: string | null;
  dateOfBirth: string | null;
  profilePictureUrl: string | null;
  bio: string | null;
  joinedDate: string;
  sellerRating: number;
  sellerReviewsCount: number;
  successfulTransactions: number;
  isLegitProfile: boolean;
  isVerified: boolean;
  accountStatus: string;
  trustScore: number;
  lastLoginAt: string;
  roleName: string;
  totalProductsListed: number;
  activeProductsCount: number;
  soldProductsCount: number;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface SignupResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
}