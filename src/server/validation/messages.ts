import { z } from "zod";

/** Public submission from the website contact form. */
export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(160),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phone: z.string().trim().min(6, "Phone is required.").max(64),
  subject: z.string().trim().min(2, "Subject is required.").max(255),
  message: z
    .string()
    .trim()
    .min(12, "Please provide a bit more detail.")
    .max(5000, "Message is too long."),
  // Honeypot: a real visitor never fills this hidden field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;

export const updateMessageStatusSchema = z.object({
  id:     z.string().min(1),
  status: z.enum(["new", "read", "archived"]),
});

export const deleteMessageSchema = z.object({ id: z.string().min(1) });

export type UpdateMessageStatusInput = z.infer<typeof updateMessageStatusSchema>;
