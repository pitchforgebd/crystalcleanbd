import { listHomepageSections } from "@/lib/repository/homepage";
import { AdminHomepageClient } from "@/app/admin/homepage/AdminHomepageClient";

export default async function AdminHomepagePage() {
  const sections = await listHomepageSections();
  return <AdminHomepageClient initial={sections} />;
}
