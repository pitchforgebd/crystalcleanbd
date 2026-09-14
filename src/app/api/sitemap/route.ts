import { listServices } from "@/lib/repository/services";
import { listBlogPosts } from "@/lib/repository/blog";
import { getSiteBaseUrl } from "@/lib/site-url";

const STATIC_PATHS = ["/", "/about", "/services", "/our-concern", "/gallery", "/blog", "/faq", "/contact"];

function xmlEscape(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const [services, posts, siteBase] = await Promise.all([
    listServices(),
    listBlogPosts(),
    getSiteBaseUrl(),
  ]);
  const urls: { loc: string; lastmod?: string }[] = [];
  for (const path of STATIC_PATHS) urls.push({ loc: `${siteBase}${path}` });
  for (const s of services) urls.push({ loc: `${siteBase}/services/${s.slug}` });
  for (const p of posts)    urls.push({ loc: `${siteBase}/blog/${p.slug}` });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${xmlEscape(u.loc)}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
