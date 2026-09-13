// Social links repository.
import { prisma } from "@/lib/db";
import { mapSocialLink } from "@/lib/mappers";
import type { SocialLink } from "@/lib/types";

export async function listSocialLinks(): Promise<SocialLink[]> {
  const rows = await prisma.socialLink.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapSocialLink);
}

export async function getWhatsAppLink(): Promise<SocialLink | null> {
  const row = await prisma.socialLink.findFirst({
    where: { active: true, platform: "whatsapp" },
  });
  return row ? mapSocialLink(row) : null;
}
