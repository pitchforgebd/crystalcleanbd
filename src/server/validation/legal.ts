import { z } from "zod";

const legalSectionShape = z.object({
  heading: z.string(),
  body:    z.string(),
});

export const legalPageInputSchema = z.object({
  kind:     z.enum(["terms", "privacy"]),
  title:    z.string().min(1).max(160),
  updated:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  sections: z.array(legalSectionShape).min(1, "At least one section is required"),
});

export type LegalPageInput = z.infer<typeof legalPageInputSchema>;
