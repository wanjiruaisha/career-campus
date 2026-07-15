import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters"),

    email: z
      .string()
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});