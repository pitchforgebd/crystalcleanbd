// Concern (Crystal Force) repository.
import { prisma } from "@/lib/db";
import { mapConcernContent } from "@/lib/mappers";
import type { ConcernContent } from "@/lib/types";

export async function getConcernContent(): Promise<ConcernContent | null> {
  const row = await prisma.concernContent.findFirst();
  return row ? mapConcernContent(row) : null;
}
