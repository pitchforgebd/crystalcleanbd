import { getSeoSettings, getSiteSettingsRow } from "@/lib/repository/seo";
import { listAllSocialLinks } from "@/lib/repository/social";
import { AdminSettingsClient } from "@/app/admin/settings/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const [siteSettings, socialLinks, seoSettings] = await Promise.all([
    getSiteSettingsRow(),
    listAllSocialLinks(),
    getSeoSettings(),
  ]);
  return (
    <AdminSettingsClient
      initial={{
        siteSettings: siteSettings ?? {
          brandName: "",
          tagline: "",
          email: "",
          phone: "",
          address: "",
          mainLogo: "",
          footerLogo: "",
          favicon: "",
          mainLogoHeight: 32,
          footerLogoHeight: 40,
        },
        socialLinks,
        ogImageLabel: seoSettings?.ogImageLabel ?? "",
      }}
    />
  );
}
