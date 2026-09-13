// Minimal sitemap placeholder. Phase 6 will expand this to include dynamic
// blog posts, services, and full per-page metadata.

import { listServices } from "@/lib/repository/services";
import { listBlogPosts } from "@/lib/repository/blog";

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

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
  const [services, posts] = await Promise.all([listServices(), listBlogPosts()]);
  const urls: { loc: string; lastmod?: string }[] = [];
  for (const path of STATIC_PATHS) urls.push({ loc: `${SITE_BASE}${path}` });
  for (const s of services) urls.push({ loc: `${SITE_BASE}/services/${s.slug}` });
  for (const p of posts)    urls.push({ loc: `${SITE_BASE}/blog/${p.slug}` });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${xmlEscape(u.loc)}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
