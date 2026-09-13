// Minimal robots.txt placeholder. Phase 6 may add a disallow list for /admin.

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/api/sitemap
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
