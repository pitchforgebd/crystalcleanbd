import { listAllFaqs } from "@/lib/repository/faq";
import { AdminFaqClient } from "@/app/admin/faq/AdminFaqClient";

export default async function AdminFaqPage() {
  const faqs = await listAllFaqs();
  return <AdminFaqClient initial={faqs} />;
}
