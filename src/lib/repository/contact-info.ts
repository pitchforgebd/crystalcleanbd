// Contact channels repository — the repeatable email/phone lists shown in
// the footer and on the contact page (distinct from SiteSettings.email/phone,
// which remain the single number/address used in compact header/CTA spots).
import { prisma } from "@/lib/db";
import { mapContactEmail, mapContactPhone } from "@/lib/mappers";
import type { ContactEmail, ContactPhone } from "@/lib/types";

export async function listContactEmails(): Promise<ContactEmail[]> {
  const rows = await prisma.contactEmail.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapContactEmail);
}

export async function listContactPhones(): Promise<ContactPhone[]> {
  const rows = await prisma.contactPhone.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapContactPhone);
}

/** Admin listings — include inactive rows so they can be reviewed and re-activated. */
export async function listAllContactEmails(): Promise<ContactEmail[]> {
  const rows = await prisma.contactEmail.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapContactEmail);
}

export async function listAllContactPhones(): Promise<ContactPhone[]> {
  const rows = await prisma.contactPhone.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapContactPhone);
}
