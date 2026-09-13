import { z } from "zod";

export const faqInputSchema = z.object({
  question: z.string().min(1).max(500),
  answer:   z.string().min(1),
  order:    z.number().int().min(0).default(0),
  active:   z.boolean().default(true),
});

export const deleteFaqSchema = z.object({ id: z.string().min(1) });
export const reorderFaqsSchema = z.object({ orderedIds: z.array(z.string()) });
export type FaqInput = z.infer<typeof faqInputSchema>;
