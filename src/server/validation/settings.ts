import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const siteSettingsInputSchema = z.object({
  brandName:       z.string().min(1).max(160),
  tagline:         z.string().max(255),
  email:           z.string().email().max(160),
  phone:           z.string().max(64),
  address:         z.string(),
  mainLogo:        imageSource,
  footerLogo:      imageSource,
  favicon:         imageSource,
  // Kept inside a sane range so a stray value cannot break the header layout.
  mainLogoHeight:   z.number().int().min(16, "Minimum 16px").max(160, "Maximum 160px").default(32),
  footerLogoHeight: z.number().int().min(16, "Minimum 16px").max(160, "Maximum 160px").default(40),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;
