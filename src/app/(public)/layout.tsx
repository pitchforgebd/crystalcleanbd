import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CleanBubbles } from "@/components/motion/CleanBubbles";
import { getSiteInfo } from "@/lib/repository/site";
import { listSocialLinks } from "@/lib/repository/social";

/**
 * Without this, static pages ship `Cache-Control: s-maxage=31536000` (cache
 * forever, purge only via revalidatePath). That purge is an internal Next.js
 * mechanism — on self-hosted Node deployments, any reverse-proxy cache in
 * front of the app (this host's nginx layer, in particular) has no way to
 * hear it, and keeps serving the old page for up to a year regardless of
 * what an admin just saved. Capping revalidate bounds that staleness to a
 * short, predictable window everywhere, on top of (not instead of) the
 * instant on-demand revalidation admin saves still trigger.
 */
export const revalidate = 60;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteInfo, socialLinks] = await Promise.all([getSiteInfo(), listSocialLinks()]);

  return (
    <div className="flex min-h-full flex-col">
      <CleanBubbles />
      <Navbar siteInfo={siteInfo} socialLinks={socialLinks} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
