// Clients repository.
import { prisma } from "@/lib/db";
import { mapClient } from "@/lib/mappers";
import type { ClientLogo } from "@/lib/types";

export async function listClients(): Promise<ClientLogo[]> {
  const rows = await prisma.client.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapClient);
}
