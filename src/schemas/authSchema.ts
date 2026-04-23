import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password too long"), // bcrypt лимит 72 байта
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export const ApplicationSchema = z.object({
  company: z.string().min(1).max(255).trim(),
  position: z.string().min(1).max(255).trim(),
  notes: z.string().max(2000).optional().default(""),
});

export const StatusSchema = z.object({
  status: z.enum(["applied", "interview", "rejected", "offer"]),
});

export const UpdateApplicationSchema = z
  .object({
    company: z.string().min(1).max(255).trim().optional(),
    position: z.string().min(1).max(255).trim().optional(),
    notes: z.string().max(2000).optional(),
    status: z.enum(["applied", "interview", "rejected", "offer"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
