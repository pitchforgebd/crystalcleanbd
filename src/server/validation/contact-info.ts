import { z } from "zod";

export const contactEmailInputSchema = z.object({
  label:  z.string().max(80).default(""),
  email:  z.string().email("Enter a valid email address"),
  order:  z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const contactPhoneInputSchema = z.object({
  label:  z.string().max(80).default(""),
  phone:  z.string().min(1, "Phone number is required").max(64),
  order:  z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const deleteContactEmailSchema = z.object({ id: z.string().min(1) });
export const deleteContactPhoneSchema = z.object({ id: z.string().min(1) });

export type ContactEmailInput = z.infer<typeof contactEmailInputSchema>;
export type ContactPhoneInput = z.infer<typeof contactPhoneInputSchema>;
