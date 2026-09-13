"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  galleryImageInputSchema,
  galleryVideoInputSchema,
  deleteGalleryImageSchema,
  deleteGalleryVideoSchema,
} from "@/server/validation/gallery";

// ---- Images ----

export async function createGalleryImage(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = galleryImageInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.galleryImage.create({ data: parsed.data });
    revalidatePath("/admin/gallery/images");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createGalleryImage", err, "Failed to create gallery image.");
  }
}

export async function updateGalleryImage(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = galleryImageInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.galleryImage.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/gallery/images");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Gallery image not found." };
    }
    return actionError("updateGalleryImage", err, "Failed to update gallery image.");
  }
}

export async function deleteGalleryImage(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteGalleryImageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.galleryImage.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/gallery/images");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Gallery image not found." };
    }
    return actionError("deleteGalleryImage", err, "Failed to delete gallery image.");
  }
}

// ---- Videos ----

export async function createGalleryVideo(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = galleryVideoInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.galleryVideo.create({ data: parsed.data });
    revalidatePath("/admin/gallery/videos");
    revalidatePath("/gallery");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createGalleryVideo", err, "Failed to create gallery video.");
  }
}

export async function updateGalleryVideo(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = galleryVideoInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.galleryVideo.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/gallery/videos");
    revalidatePath("/gallery");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Gallery video not found." };
    }
    return actionError("updateGalleryVideo", err, "Failed to update gallery video.");
  }
}

export async function deleteGalleryVideo(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteGalleryVideoSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.galleryVideo.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/gallery/videos");
    revalidatePath("/gallery");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Gallery video not found." };
    }
    return actionError("deleteGalleryVideo", err, "Failed to delete gallery video.");
  }
}
