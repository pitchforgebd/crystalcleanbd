// Contact messages repository (admin reads). Public submissions land here via
// submitContactMessage() in src/server/actions/messages.ts.
import { prisma } from "@/lib/db";
import type { ContactMessage } from "@/lib/admin-types";

export async function listContactMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    subject: r.subject, message: r.message,
    createdAt: r.createdAt.toISOString().replace("Z", ""),
    status: r.status as ContactMessage["status"],
  }));
}
