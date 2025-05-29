import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


export const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  yearOfBirth: z.coerce.date({
    required_error: "Please pick your birth date",
  }),
  gender: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;


export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  gender: string;
  yearOfBirth: Date;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface SignupResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}