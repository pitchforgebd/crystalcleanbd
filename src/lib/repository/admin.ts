// Admin user repository.
import { prisma } from "@/lib/db";
import type { AdminUser } from "@/lib/admin-types";

export async function listAdminUsers(): Promise<AdminUser[]> {
  const rows = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as AdminUser["role"],
    createdAt: row.createdAt,
  }));
}
