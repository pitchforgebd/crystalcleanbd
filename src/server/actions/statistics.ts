"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { statisticInputSchema, deleteStatisticSchema } from "@/server/validation/statistic";

export async function createStatistic(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = statisticInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.statistic.create({ data: parsed.data });
    revalidatePath("/admin/statistics");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createStatistic", err, "Failed to create statistic.");
  }
}

export async function updateStatistic(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = statisticInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.statistic.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/statistics");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Statistic not found." };
    }
    return actionError("updateStatistic", err, "Failed to update statistic.");
  }
}

export async function deleteStatistic(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteStatisticSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.statistic.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/statistics");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Statistic not found." };
    }
    return actionError("deleteStatistic", err, "Failed to delete statistic.");
  }
}
