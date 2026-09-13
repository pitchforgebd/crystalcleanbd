import { z } from "zod";

const platformValues = ["facebook", "instagram", "youtube", "linkedin", "tiktok", "whatsapp"] as const;

export const socialLinkInputSchema = z.object({
  platform: z.enum(platformValues),
  label:    z.string().min(1).max(80),
  href:     z.union([z.string().url(), z.string().startsWith("/")])
              .refine((v) => v.length <= 1000, "href must be 1000 characters or fewer"),
  order:    z.number().int().min(0).default(0),
  active:   z.boolean().default(true),
});

export const deleteSocialLinkSchema = z.object({ id: z.string().min(1) });
export type SocialLinkInput = z.infer<typeof socialLinkInputSchema>;
