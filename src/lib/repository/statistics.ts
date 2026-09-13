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
