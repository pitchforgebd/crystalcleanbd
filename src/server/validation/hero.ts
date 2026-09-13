import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const heroSlideInputSchema = z.object({
  image:      imageSource,
  imageAlt:   z.string().max(255).default(""),
  heading:    z.string().min(1).max(255),
  subheading: z.string().max(255),
  text:       z.string().default(""),
  ctaLabel:   z.string().max(80).default("Learn more"),
  ctaHref:    z.string().max(255).default("/services"),
  order:      z.number().int().min(0).default(0),
  active:     z.boolean().default(true),
});

export const deleteHeroSlideSchema = z.object({ id: z.string().min(1) });
export const reorderHeroSlidesSchema = z.object({ orderedIds: z.array(z.string()) });

export type HeroSlideInput = z.infer<typeof heroSlideInputSchema>;
