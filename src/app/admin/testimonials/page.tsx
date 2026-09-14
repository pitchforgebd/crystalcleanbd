import { listAllTestimonials } from "@/lib/repository/testimonials";
import { AdminTestimonialsClient } from "@/app/admin/testimonials/AdminTestimonialsClient";

export default async function AdminTestimonialsPage() {
  const testimonials = await listAllTestimonials();
  return <AdminTestimonialsClient initial={testimonials} />;
}
