import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const testimonialInputSchema = z.object({
  name:      z.string().min(1).max(160),
  role:      z.string().max(160).default(""),
  quote:     z.string().min(1),
  avatarSrc: imageSource,
  avatarAlt: z.string().max(255).default(""),
  order:     z.number().int().min(0).default(0),
  active:    z.boolean().default(true),
});

export const deleteTestimonialSchema = z.object({ id: z.string().min(1) });
export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
