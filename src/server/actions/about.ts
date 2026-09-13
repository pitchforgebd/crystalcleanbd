"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { aboutContentInputSchema } from "@/server/validation/about";

export async function updateAboutContent(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = aboutContentInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.aboutContent.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });
    revalidatePath("/admin");
    revalidatePath("/about");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("updateAboutContent", err, "Failed to update about content.");
  }
}
