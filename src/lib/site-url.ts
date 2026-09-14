import { getSeoSettings } from "@/lib/repository/seo";

/**
 * The env var is the deployment's authoritative base URL and always wins when
 * set, so the admin-editable `canonicalBase` can never silently break a
 * working sitemap/robots by being left at its seed placeholder.
 */
export async function getSiteBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const seo = await getSeoSettings();
  return seo?.canonicalBase || "https://example.com";
}
