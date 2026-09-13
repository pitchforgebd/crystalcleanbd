import { z } from "zod";

export const statisticInputSchema = z.object({
  label:  z.string().min(1).max(160),
  value:  z.number().int().min(0),
  suffix: z.string().max(16).default(""),
  order:  z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const deleteStatisticSchema = z.object({ id: z.string().min(1) });
export type StatisticInput = z.infer<typeof statisticInputSchema>;
