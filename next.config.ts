import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
