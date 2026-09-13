// Homepage section repository.
import { prisma } from "@/lib/db";
import { mapHomepageSection } from "@/lib/mappers";
import type { HomepageSection } from "@/lib/admin-types";

export async function listHomepageSections(): Promise<HomepageSection[]> {
  const rows = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapHomepageSection);
}
