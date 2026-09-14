import { prisma } from "@/lib/db";
import { listUploadedFiles, type StoredFile } from "@/lib/uploads";

/**
 * Finds uploaded files that nothing in the database points at any more.
 *
 * The scan reads every content row and looks for `/uploads/...` anywhere in its
 * JSON — not just in the obvious image columns. A path can also sit inside a
 * blog paragraph, a JSON array of values, or an SEO field, and deleting one of
 * those would break a live page.
 */

/** A freshly uploaded file may not be attached to a record yet. */
export const GRACE_HOURS = 24;

const UPLOAD_PATH = /\/uploads\/[A-Za-z0-9_\-./]+?\.(?:jpg|jpeg|png|gif|webp)/gi;

async function referencedUrls(): Promise<Set<string>> {
  const tables = await Promise.all([
    prisma.siteSettings.findMany(),
    prisma.seoSettings.findMany(),
    prisma.pageSeo.findMany(),
    prisma.homepageSection.findMany(),
    prisma.heroContent.findMany(),
    prisma.service.findMany(),
    prisma.serviceReview.findMany(),
    prisma.statistic.findMany(),
    prisma.testimonial.findMany(),
    prisma.client.findMany(),
    prisma.galleryImage.findMany(),
    prisma.galleryVideo.findMany(),
    prisma.blogCategory.findMany(),
    prisma.blogPost.findMany(),
    prisma.faqItem.findMany(),
    prisma.socialLink.findMany(),
    prisma.aboutContent.findMany(),
    prisma.concernContent.findMany(),
    prisma.legalPage.findMany(),
    prisma.contactMessage.findMany(),
  ]);

  const used = new Set<string>();
  for (const rows of tables) {
    if (rows.length === 0) continue;
    const haystack = JSON.stringify(rows);
    for (const match of haystack.matchAll(UPLOAD_PATH)) {
      used.add(match[0]);
    }
  }
  return used;
}

export type StorageReport = {
  files: StoredFile[];
  orphans: StoredFile[];
  /** Unreferenced but still inside the grace window — left alone for now. */
  recent: StoredFile[];
  totalBytes: number;
  orphanBytes: number;
};

export async function scanStorage(): Promise<StorageReport> {
  const [files, used] = await Promise.all([listUploadedFiles(), referencedUrls()]);
  const cutoff = Date.now() - GRACE_HOURS * 60 * 60 * 1000;

  const unused = files.filter((file) => !used.has(file.url));
  const orphans = unused.filter((file) => file.modifiedAt.getTime() < cutoff);
  const recent = unused.filter((file) => file.modifiedAt.getTime() >= cutoff);

  return {
    files,
    orphans,
    recent,
    totalBytes: files.reduce((sum, file) => sum + file.size, 0),
    orphanBytes: orphans.reduce((sum, file) => sum + file.size, 0),
  };
}
