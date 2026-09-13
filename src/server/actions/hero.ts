"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { heroSlideInputSchema, deleteHeroSlideSchema, reorderHeroSlidesSchema } from "@/server/validation/hero";

export async function createHeroSlide(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = heroSlideInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  const d = parsed.data;
  try {
    const row = await prisma.heroSlide.create({ data: { ...d } });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createHeroSlide", err, "Failed to create hero slide.");
  }
}

export async function updateHeroSlide(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = heroSlideInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.heroSlide.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Hero slide not found." };
    }
    return actionError("updateHeroSlide", err, "Failed to update hero slide.");
  }
}

export async function deleteHeroSlide(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteHeroSlideSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.heroSlide.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Hero slide not found." };
    }
    return actionError("deleteHeroSlide", err, "Failed to delete hero slide.");
  }
}

export async function reorderHeroSlides(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = reorderHeroSlidesSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.$transaction(
      parsed.data.orderedIds.map((id, idx) =>
        prisma.heroSlide.update({ where: { id }, data: { order: idx } }),
      ),
    );
    revalidatePath("/admin/hero-slides");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return actionError("reorderHeroSlides", err, "Failed to reorder hero slides.");
  }
}
