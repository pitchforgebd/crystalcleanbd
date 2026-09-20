import { getSeoSettings, getSiteSettingsRow } from "@/lib/repository/seo";
import { listAllSocialLinks } from "@/lib/repository/social";
import { listAllContactEmails, listAllContactPhones } from "@/lib/repository/contact-info";
import { AdminSettingsClient } from "@/app/admin/settings/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const [siteSettings, socialLinks, seoSettings, contactEmails, contactPhones] = await Promise.all([
    getSiteSettingsRow(),
    listAllSocialLinks(),
    getSeoSettings(),
    listAllContactEmails(),
    listAllContactPhones(),
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
        contactEmails,
        contactPhones,
        ogImageLabel: seoSettings?.ogImageLabel ?? "",
      }}
    />
  );
}
