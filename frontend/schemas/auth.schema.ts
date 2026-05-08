import { z } from "zod";

/* LOGIN */

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

export type signInFormData = z.infer<typeof signInSchema>;

/* REGISTER */

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean(),
});

export type signUpFormData = z.infer<typeof signUpSchema>;

/* FORGOT PASSWORD */

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Verification Code
export const verificationCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

// Reset Password
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Types pour le store
export interface PasswordResetState {
  phoneNumber: string;
  verificationId: string;
  expiresAt: number;
  attempts: number;
}
