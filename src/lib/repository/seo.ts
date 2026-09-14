// SEO repository — global + per-page settings.
import { prisma } from "@/lib/db";
import type { PageSeoRow, SeoSettings, SiteSettings } from "@/lib/admin-types";

export async function getSeoSettings(): Promise<SeoSettings | null> {
  const row = await prisma.seoSettings.findFirst();
  if (!row) return null;
  return {
    siteTitle: row.siteTitle,
    defaultDescription: row.defaultDescription,
    ogImageLabel: row.ogImageLabel,
    twitterHandle: row.twitterHandle,
    robotsIndex: row.robotsIndex,
    canonicalBase: row.canonicalBase,
  };
}

export async function getSiteSettingsRow(): Promise<SiteSettings | null> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) return null;
  return {
    brandName: row.brandName,
    tagline: row.tagline,
    email: row.email,
    phone: row.phone,
    address: row.address,
    mainLogo: row.mainLogo,
    footerLogo: row.footerLogo,
    favicon: row.favicon,
    mainLogoHeight: row.mainLogoHeight,
    footerLogoHeight: row.footerLogoHeight,
  };
}

export async function listPageSeo(): Promise<PageSeoRow[]> {
  const rows = await prisma.pageSeo.findMany({ orderBy: { path: "asc" } });
  return rows.map((r) => ({
    id: r.id, page: r.page, path: r.path,
    title: r.title, description: r.description,
    ogImage: r.ogImage, canonical: r.canonical,
  }));
}

export async function getPageSeoByPath(path: string): Promise<PageSeoRow | null> {
  const row = await prisma.pageSeo.findUnique({ where: { path } });
  if (!row) return null;
  return {
    id: row.id, page: row.page, path: row.path,
    title: row.title, description: row.description,
    ogImage: row.ogImage, canonical: row.canonical,
  };
}
