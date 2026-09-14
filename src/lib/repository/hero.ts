// Hero section repository — a single static hero (no slider).
import { prisma } from "@/lib/db";
import { mapHeroContent } from "@/lib/mappers";
import type { HeroContent } from "@/lib/types";

export async function getHeroContent(): Promise<HeroContent | null> {
  const row = await prisma.heroContent.findFirst();
  return row ? mapHeroContent(row) : null;
}
