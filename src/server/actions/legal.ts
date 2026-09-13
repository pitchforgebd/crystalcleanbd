"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { legalPageInputSchema } from "@/server/validation/legal";

export async function updateLegalPage(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = legalPageInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  const d = parsed.data;
  try {
    const row = await prisma.legalPage.upsert({
      where: { kind: d.kind },
      update: { title: d.title, updated: new Date(d.updated), sections: d.sections },
      create: { kind: d.kind, title: d.title, updated: new Date(d.updated), sections: d.sections },
    });
    revalidatePath("/admin/legal");
    revalidatePath(d.kind === "terms" ? "/terms" : "/privacy");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("updateLegalPage", err, "Failed to update legal page.");
  }
}
