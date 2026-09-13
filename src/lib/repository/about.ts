// About content repository.
import { prisma } from "@/lib/db";
import { mapAboutContent } from "@/lib/mappers";
import type { AboutContent } from "@/lib/types";

export async function getAboutContent(): Promise<AboutContent | null> {
  const row = await prisma.aboutContent.findFirst();
  return row ? mapAboutContent(row) : null;
}
