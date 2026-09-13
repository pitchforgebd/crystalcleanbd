import { z } from "zod";

export const seoSettingsInputSchema = z.object({
  siteTitle:          z.string().max(255).default(""),
  defaultDescription: z.string().max(500).default(""),
  ogImageLabel:      z.string().max(160).default(""),
  twitterHandle:     z.string().max(64).default(""),
  robotsIndex:       z.boolean().default(true),
  canonicalBase:     z.string().max(255).default(""),
});

export const pageSeoInputSchema = z.object({
  page:        z.string().min(1).max(80),
  path:        z.string().min(1).max(255),
  title:       z.string().max(255),
  description: z.string().max(500),
  ogImage:     z.string().max(255).optional(),
  canonical:   z.string().max(255).optional(),
});

export const deletePageSeoSchema = z.object({ id: z.string().min(1) });

export type SeoSettingsInput = z.infer<typeof seoSettingsInputSchema>;
export type PageSeoInput = z.infer<typeof pageSeoInputSchema>;
