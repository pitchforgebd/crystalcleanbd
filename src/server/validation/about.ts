import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

const aboutValuesShape = z.object({
  title:       z.string(),
  description: z.string(),
});

export const aboutContentInputSchema = z.object({
  introduction:     z.string().min(1),
  mission:          z.string(),
  vision:           z.string(),
  proprietorMessage: z.string(),
  teamImage:        imageSource,
  teamImageAlt:     z.string().max(255).default(""),
  workspaceImage:   imageSource,
  workspaceImageAlt: z.string().max(255).default(""),
  contactImage:     imageSource,
  contactImageAlt:  z.string().max(255).default(""),
  values:           z.array(aboutValuesShape).default([]),
  whyChooseUs:      z.array(z.string()).default([]),
});

export type AboutContentInput = z.infer<typeof aboutContentInputSchema>;
