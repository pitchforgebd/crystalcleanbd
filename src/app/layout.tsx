import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { getSiteInfo } from "@/lib/repository/site";
import { getSeoSettings } from "@/lib/repository/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [siteInfo, seo] = await Promise.all([getSiteInfo(), getSeoSettings()]);
  return {
    title: {
      default: `${siteInfo.brandName} | Professional Cleaning`,
      template: `%s | ${siteInfo.brandName}`,
    },
    description: siteInfo.tagline,
    icons: {
      icon: [{ url: siteInfo.favicon || "/favicon.jpg" }],
      apple: [{ url: siteInfo.mainLogo || "/brand/crystal-clean-logo.jpg" }],
    },
    robots: seo?.robotsIndex === false ? { index: false, follow: false } : undefined,
    twitter: seo?.twitterHandle ? { card: "summary_large_image", site: seo.twitterHandle } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
