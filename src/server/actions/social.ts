"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { socialLinkInputSchema, deleteSocialLinkSchema } from "@/server/validation/social";

export async function createSocialLink(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = socialLinkInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.socialLink.create({ data: parsed.data });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/layout");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createSocialLink", err, "Failed to create social link.");
  }
}

export async function updateSocialLink(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = socialLinkInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.socialLink.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Social link not found." };
    }
    return actionError("updateSocialLink", err, "Failed to update social link.");
  }
}

export async function deleteSocialLink(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteSocialLinkSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.socialLink.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Social link not found." };
    }
    return actionError("deleteSocialLink", err, "Failed to delete social link.");
  }
}
