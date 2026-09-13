"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { concernContentInputSchema } from "@/server/validation/concern";

export async function updateConcernContent(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = concernContentInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.concernContent.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });
    revalidatePath("/admin/concern");
    revalidatePath("/our-concern");
    revalidatePath("/about");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("updateConcernContent", err, "Failed to update concern content.");
  }
}
