import { listAllGalleryVideos } from "@/lib/repository/gallery";
import { AdminGalleryVideosClient } from "@/app/admin/gallery/videos/AdminGalleryVideosClient";

export default async function AdminGalleryVideosPage() {
  const videos = await listAllGalleryVideos();
  return <AdminGalleryVideosClient initial={videos} />;
}
