// FAQ repository.
import { prisma } from "@/lib/db";
import { mapFaqItem } from "@/lib/mappers";
import type { FaqItem } from "@/lib/types";

export async function listFaqs(): Promise<FaqItem[]> {
  const rows = await prisma.faqItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapFaqItem);
}

/** Admin listing — includes inactive FAQ items so they can be reviewed and re-activated. */
export async function listAllFaqs(): Promise<FaqItem[]> {
  const rows = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapFaqItem);
}
