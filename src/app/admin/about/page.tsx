import { notFound } from "next/navigation";
import { AdminAboutClient } from "@/app/admin/about/AdminAboutClient";
import { getAboutContent } from "@/lib/repository/about";

export default async function AdminAboutPage() {
  const about = await getAboutContent();
  if (!about) notFound();
  return <AdminAboutClient initial={about} />;
}
