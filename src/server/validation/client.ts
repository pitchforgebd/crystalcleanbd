import { z } from "zod";
import { imageSource } from "@/server/validation/shared";

export const clientInputSchema = z.object({
  name:    z.string().min(1).max(160),
  logoSrc: imageSource,
  logoAlt: z.string().max(255).default(""),
  order:   z.number().int().min(0).default(0),
  active:  z.boolean().default(true),
});

export const deleteClientSchema = z.object({ id: z.string().min(1) });
export type ClientInput = z.infer<typeof clientInputSchema>;
