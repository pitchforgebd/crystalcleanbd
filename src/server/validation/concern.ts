import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

const concernFeatureShape = z.object({
  title:       z.string(),
  description: z.string(),
});

export const concernContentInputSchema = z.object({
  name:         z.string().min(1).max(160),
  tagline:      z.string().max(255),
  introduction: z.string().min(1),
  brandingNote: z.string(),
  image:        imageSource,
  imageAlt:     z.string().max(255).default(""),
  ctaLabel:     z.string().max(80).default("Contact Us"),
  ctaHref:      z.string().max(255).default("/contact"),
  features:     z.array(concernFeatureShape).default([]),
});

export type ConcernContentInput = z.infer<typeof concernContentInputSchema>;
