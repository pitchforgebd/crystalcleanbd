import { listAllHeroSlides } from "@/lib/repository/hero";
import { AdminHeroSlidesClient } from "@/app/admin/hero-slides/AdminHeroSlidesClient";

export default async function AdminHeroSlidesPage() {
  const slides = await listAllHeroSlides();
  return <AdminHeroSlidesClient initial={slides} />;
}
