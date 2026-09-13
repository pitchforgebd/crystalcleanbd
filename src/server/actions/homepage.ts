"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { homepageSectionInputSchema } from "@/server/validation/homepage";

export async function updateHomepageSection(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = homepageSectionInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.homepageSection.upsert({
      where: { key: parsed.data.key },
      update: { name: parsed.data.name, enabled: parsed.data.enabled, order: parsed.data.order },
      create: { ...parsed.data },
    });
    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("updateHomepageSection", err, "Failed to update homepage section.");
  }
}
