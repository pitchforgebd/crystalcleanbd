// Zod schemas for service-related inputs.
import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const serviceIconValues = ["spark", "building", "home", "window", "carpet", "sanitize"] as const;

export const serviceInputSchema = z.object({
  name:             z.string().min(1, "Name is required").max(160),
  slug:             z.string().min(1, "Slug is required").max(160)
                     .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  category:         z.string().min(1).max(80),
  icon:             z.enum(serviceIconValues),
  featuredImage:    imageSource,
  imageAlt:         z.string().max(255).default(""),
  shortDescription: z.string().max(500),
  fullDescription:  z.string().min(1),
  workScope:        z.array(z.string()).default([]),
  outcomes:         z.array(z.string()).default([]),
  features:        z.array(z.string()).default([]),
  packageTags:      z.array(z.string()).default([]),
  availability:     z.string().default(""),
  rating:           z.number().min(0).max(5).default(0),
  reviewCount:      z.number().int().min(0).default(0),
  featured:         z.boolean().default(false),
  popular:          z.boolean().default(false),
  order:            z.number().int().min(0).default(0),
  active:           z.boolean().default(true),
});

export const deleteServiceSchema = z.object({ id: z.string().min(1) });
export const reorderServicesSchema = z.object({
  orderedIds: z.array(z.string()),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;
