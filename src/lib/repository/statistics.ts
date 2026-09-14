// Statistics repository.
import { prisma } from "@/lib/db";
import { mapStatistic } from "@/lib/mappers";
import type { Statistic } from "@/lib/types";

export async function listStatistics(): Promise<Statistic[]> {
  const rows = await prisma.statistic.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapStatistic);
}

/** Admin listing — includes inactive statistics so they can be reviewed and re-activated. */
export async function listAllStatistics(): Promise<Statistic[]> {
  const rows = await prisma.statistic.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapStatistic);
}
