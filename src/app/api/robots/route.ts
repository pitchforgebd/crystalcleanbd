import { getSeoSettings } from "@/lib/repository/seo";
import { getSiteBaseUrl } from "@/lib/site-url";

export async function GET() {
  const [seo, base] = await Promise.all([getSeoSettings(), getSiteBaseUrl()]);
  const allowIndexing = seo?.robotsIndex ?? true;
  const body = `User-agent: *
${allowIndexing ? "Allow: /" : "Disallow: /"}
Disallow: /admin
Sitemap: ${base}/api/sitemap
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
