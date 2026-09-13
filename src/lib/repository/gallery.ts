// Gallery repository.
import { prisma } from "@/lib/db";
import { mapGalleryImage, mapGalleryVideo } from "@/lib/mappers";
import type { GalleryImage, GalleryVideo } from "@/lib/types";

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const rows = await prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapGalleryImage);
}

export async function listGalleryVideos(): Promise<GalleryVideo[]> {
  const rows = await prisma.galleryVideo.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return rows.map(mapGalleryVideo);
}
