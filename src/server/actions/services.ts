"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { serviceInputSchema, deleteServiceSchema, reorderServicesSchema } from "@/server/validation/service";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export async function createService(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = serviceInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  }
  const d = parsed.data;
  try {
    const row = await prisma.service.create({
      data: {
        name: d.name, slug: d.slug, category: d.category, icon: d.icon,
        featuredImage: d.featuredImage, imageAlt: d.imageAlt,
        shortDescription: d.shortDescription, fullDescription: d.fullDescription,
        workScope: d.workScope, outcomes: d.outcomes,
        features: d.features, packageTags: d.packageTags,
        availability: d.availability, rating: d.rating, reviewCount: d.reviewCount,
        featured: d.featured, popular: d.popular,
        order: d.order, active: d.active,
      },
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A service with slug "${d.slug}" already exists.` };
    }
    return actionError("createService", err, "Failed to create service.");
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
export async function updateService(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = serviceInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  }
  const d = parsed.data;
  try {
    const row = await prisma.service.update({
      where: { id },
      data: {
        name: d.name, slug: d.slug, category: d.category, icon: d.icon,
        featuredImage: d.featuredImage, imageAlt: d.imageAlt,
        shortDescription: d.shortDescription, fullDescription: d.fullDescription,
        workScope: d.workScope, outcomes: d.outcomes,
        features: d.features, packageTags: d.packageTags,
        availability: d.availability, rating: d.rating, reviewCount: d.reviewCount,
        featured: d.featured, popular: d.popular,
        order: d.order, active: d.active,
      },
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    // A literal resolved path alone does not reach a page rendered by a
    // generateStaticParams'd dynamic segment under a route group — Next keys
    // that cache entry by the route FILE pattern, not the URL, so the
    // pattern form (route group included) is required to actually purge it.
    revalidatePath("/(public)/services/[slug]", "page");
    revalidatePath(`/services/${row.slug}`);
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A service with slug "${d.slug}" already exists.` };
    }
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Service not found." };
    }
    return actionError("updateService", err, "Failed to update service.");
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
export async function deleteService(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteServiceSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    const row = await prisma.service.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    // A literal resolved path alone does not reach a page rendered by a
    // generateStaticParams'd dynamic segment under a route group — without
    // the pattern form (route group included), the deleted service's detail
    // page keeps serving its last cached copy instead of 404ing right away.
    revalidatePath("/(public)/services/[slug]", "page");
    revalidatePath(`/services/${row.slug}`);
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Service not found." };
    }
    return actionError("deleteService", err, "Failed to delete service.");
  }
}

// ---------------------------------------------------------------------------
// Reorder
// ---------------------------------------------------------------------------
export async function reorderServices(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = reorderServicesSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.$transaction(
      parsed.data.orderedIds.map((id, idx) =>
        prisma.service.update({ where: { id }, data: { order: idx } }),
      ),
    );
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return actionError("reorderServices", err, "Failed to reorder services.");
  }
}
