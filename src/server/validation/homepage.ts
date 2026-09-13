import { z } from "zod";

export const homepageSectionInputSchema = z.object({
  key:    z.string().min(1).max(80),
  name:   z.string().min(1).max(160),
  enabled: z.boolean(),
  order:  z.number().int().min(0),
});
export type HomepageSectionInput = z.infer<typeof homepageSectionInputSchema>;
