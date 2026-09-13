// Hero slides repository.
import { prisma } from "@/lib/db";
import { mapHeroSlide } from "@/lib/mappers";
import type { HeroSlide } from "@/lib/types";

export async function listHeroSlides(): Promise<HeroSlide[]> {
  const rows = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapHeroSlide);
}
