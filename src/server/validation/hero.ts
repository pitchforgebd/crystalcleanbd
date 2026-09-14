import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const heroContentInputSchema = z.object({
  heading:    z.string().min(1).max(255),
  subheading: z.string().max(255),
  text:       z.string().default(""),
  ctaLabel:   z.string().max(80).default("Learn more"),
  ctaHref:    z.string().max(255).default("/services"),
  image1:     imageSource,
  image1Alt:  z.string().max(255).default(""),
  image2:     imageSource,
  image2Alt:  z.string().max(255).default(""),
  image3:     imageSource,
  image3Alt:  z.string().max(255).default(""),
});

export type HeroContentInput = z.infer<typeof heroContentInputSchema>;
