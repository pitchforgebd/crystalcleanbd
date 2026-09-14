// Services repository.
import { prisma } from "@/lib/db";
import { mapService, mapServiceReview } from "@/lib/mappers";
import type { Service, ServiceReview } from "@/lib/types";

export async function listServices(opts?: {
  featured?: boolean;
  popular?: boolean;
}): Promise<Service[]> {
  const rows = await prisma.service.findMany({
    where: {
      active: true,
      ...(opts?.featured !== undefined ? { featured: opts.featured } : {}),
      ...(opts?.popular !== undefined ? { popular: opts.popular } : {}),
    },
    orderBy: { order: "asc" },
  });
  return rows.map(mapService);
}

/** Admin listing — includes inactive services so they can be reviewed and re-activated. */
export async function listAllServices(): Promise<Service[]> {
  const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return rows.map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const row = await prisma.service.findFirst({ where: { slug, active: true } });
  return row ? mapService(row) : null;
}

export async function listServiceSlugs(): Promise<string[]> {
  const rows = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function listServiceReviews(serviceSlug: string): Promise<ServiceReview[]> {
  const rows = await prisma.serviceReview.findMany({
    where: { serviceSlug, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapServiceReview);
}
