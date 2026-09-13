import { listFaqs } from "@/lib/repository/faq";
import { AdminFaqClient } from "@/app/admin/faq/AdminFaqClient";

export default async function AdminFaqPage() {
  const faqs = await listFaqs();
  return <AdminFaqClient initial={faqs} />;
}
