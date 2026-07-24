import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  category: z
    .string()
    .min(1, "Please select a category."),

  summary: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters.")
    .max(300, "Summary cannot exceed 300 characters."),

  content: z
    .string()
    .trim()
    .min(100, "Content must be at least 100 characters."),

  status: z.enum(["Published", "Draft"]),

  thumbnail: z.any().optional(),
});