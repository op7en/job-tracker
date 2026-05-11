import { z } from "zod";
import { APPLICATION_STATUSES } from "../domain/applicationStatus";

const emailField = z
  .string()
  .email("Invalid email")
  .max(255)
  .transform((v) => v.trim().toLowerCase());

export const RegisterSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password too long"),
});

export const LoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password required"),
});

export const ApplicationSchema = z.object({
  company: z.string().min(1).max(255).trim(),
  position: z.string().min(1).max(255).trim(),
  notes: z.string().max(2000).optional().default(""),
});

export const StatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

export const UpdateApplicationSchema = z
  .object({
    company: z.string().min(1).max(255).trim().optional(),
    position: z.string().min(1).max(255).trim().optional(),
    notes: z.string().max(2000).optional(),
    status: z.enum(APPLICATION_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
