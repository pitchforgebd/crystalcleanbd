"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { seoSettingsInputSchema, pageSeoInputSchema, deletePageSeoSchema } from "@/server/validation/seo";

export async function updateSeoSettings(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = seoSettingsInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.seoSettings.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });
    revalidatePath("/admin/seo");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("updateSeoSettings", err, "Failed to update SEO settings.");
  }
}

export async function createPageSeo(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = pageSeoInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.pageSeo.create({ data: parsed.data });
    revalidatePath("/admin/seo");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A page SEO entry for "${parsed.data.path}" already exists.` };
    }
    return actionError("createPageSeo", err, "Failed to create page SEO entry.");
  }
}

export async function updatePageSeo(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = pageSeoInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.pageSeo.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/seo");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return { ok: false, error: `A page SEO entry for "${parsed.data.path}" already exists.` };
    }
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Page SEO entry not found." };
    }
    return actionError("updatePageSeo", err, "Failed to update page SEO entry.");
  }
}

export async function deletePageSeo(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deletePageSeoSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.pageSeo.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/seo");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Page SEO entry not found." };
    }
    return actionError("deletePageSeo", err, "Failed to delete page SEO entry.");
  }
}
