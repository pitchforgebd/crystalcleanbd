import { z } from "zod";

const role = z.enum(["owner", "editor"]);

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(160),
  email: z.string().trim().email("Enter a valid email.").max(160),
  role,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const updateAdminSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Name is required.").max(160),
  email: z.string().trim().email("Enter a valid email.").max(160),
  role,
});

export const resetAdminPasswordSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const deleteAdminSchema = z.object({ id: z.string().min(1) });

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
