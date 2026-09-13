import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SiteInfoProvider } from "@/components/admin/AdminSiteContext";
import { getCurrentAdmin } from "@/lib/auth/current";
import { getSiteInfo } from "@/lib/repository/site";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteInfo, admin, headerList] = await Promise.all([
    getSiteInfo(),
    getCurrentAdmin(),
    headers(),
  ]);

  // Defence in depth: the proxy already redirects, but the layout refuses to
  // render the dashboard for an unauthenticated request as well.
  const path = headerList.get("x-admin-path") ?? "";
  if (!admin && path !== "/admin/login") redirect("/admin/login");

  return (
    <SiteInfoProvider value={siteInfo}>
      <AdminShell admin={admin}>{children}</AdminShell>
    </SiteInfoProvider>
  );
}
