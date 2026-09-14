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

/** Admin listing — includes inactive clients so they can be reviewed and re-activated. */
export async function listAllClients(): Promise<ClientLogo[]> {
  const rows = await prisma.client.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapClient);
}
