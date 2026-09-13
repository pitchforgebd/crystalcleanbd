import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CleanBubbles } from "@/components/motion/CleanBubbles";
import { getSiteInfo } from "@/lib/repository/site";
import { listSocialLinks } from "@/lib/repository/social";

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
