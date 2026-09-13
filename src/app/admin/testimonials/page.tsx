import { listTestimonials } from "@/lib/repository/testimonials";
import { AdminTestimonialsClient } from "@/app/admin/testimonials/AdminTestimonialsClient";

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();
  return <AdminTestimonialsClient initial={testimonials} />;
}
