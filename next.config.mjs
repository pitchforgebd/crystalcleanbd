/**
 * Plain JS (not .ts): a TypeScript config needs a transform to even be read at
 * startup, and on at least one cPanel host that transform routes through the
 * native SWC binary (@next/swc-linux-x64-gnu), which crashes with a Bus error
 * on that CPU — not just during `next build`, but on every server start.
 * A .mjs/.js config needs no transform at all, so it loads regardless.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Phase 2: the app now runs as a Next.js Node server (target: cPanel + Node.js)
  // so API routes, server actions and MySQL access work. Static export
  // (`output: "export"`) was Phase 1/1B only and has been removed.
  images: {
    // Keep images unoptimized: cPanel/Node shared hosting typically cannot run
    // the Next.js image optimizer service reliably.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
