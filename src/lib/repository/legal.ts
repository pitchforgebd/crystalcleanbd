// Legal pages repository (terms / privacy).
import { prisma } from "@/lib/db";
import { mapLegalPage, type LegalPageShape } from "@/lib/mappers";

export async function getLegalPage(kind: "terms" | "privacy"): Promise<LegalPageShape | null> {
  const row = await prisma.legalPage.findUnique({ where: { kind } });
  return row ? mapLegalPage(row) : null;
}
