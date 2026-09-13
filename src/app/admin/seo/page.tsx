import { getSeoSettings, listPageSeo } from "@/lib/repository/seo";
import { AdminSeoClient } from "@/app/admin/seo/AdminSeoClient";

export default async function AdminSeoPage() {
  const [seoSettings, pageSeoRows] = await Promise.all([
    getSeoSettings(),
    listPageSeo(),
  ]);
  return (
    <AdminSeoClient
      initial={{
        seoSettings: seoSettings ?? {
          siteTitle: "",
          defaultDescription: "",
          ogImageLabel: "",
          twitterHandle: "",
          robotsIndex: true,
          canonicalBase: "",
        },
        pageSeoRows,
      }}
    />
  );
}
