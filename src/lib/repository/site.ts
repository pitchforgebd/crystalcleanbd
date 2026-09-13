// Site info repository — reads from SiteSettings and maps to SiteInfo.
import { prisma } from "@/lib/db";
import { mapSiteSettings } from "@/lib/mappers";
import type { SiteInfo } from "@/lib/types";

export async function getSiteInfo(): Promise<SiteInfo> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) {
    // Return defaults when the table is empty (before seed or fresh migration).
    return {
      brandName: "Crystal Clean Service",
      tagline: "Professional cleaning for spaces that need to feel trusted.",
      email: "hello@example.com",
      phone: "+880 0000-000000",
      address: "Add your address via the CMS.",
      mainLogo: "",
      footerLogo: "",
      favicon: "",
      mainLogoHeight: 32,
      footerLogoHeight: 40,
      mockNotice: "",
    };
  }
  return mapSiteSettings(row);
}
