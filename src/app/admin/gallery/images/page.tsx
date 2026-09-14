import { listAllGalleryImages } from "@/lib/repository/gallery";
import { AdminGalleryImagesClient } from "@/app/admin/gallery/images/AdminGalleryImagesClient";

export default async function AdminGalleryImagesPage() {
  const images = await listAllGalleryImages();
  return <AdminGalleryImagesClient initial={images} />;
}
