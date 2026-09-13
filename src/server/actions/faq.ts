"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { faqInputSchema, deleteFaqSchema, reorderFaqsSchema } from "@/server/validation/faq";

export async function createFaq(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = faqInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.faqItem.create({ data: parsed.data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createFaq", err, "Failed to create FAQ.");
  }
}

export async function updateFaq(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = faqInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.faqItem.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "FAQ not found." };
    }
    return actionError("updateFaq", err, "Failed to update FAQ.");
  }
}

export async function deleteFaq(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteFaqSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.faqItem.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "FAQ not found." };
    }
    return actionError("deleteFaq", err, "Failed to delete FAQ.");
  }
}

export async function reorderFaqs(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = reorderFaqsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.$transaction(
      parsed.data.orderedIds.map((id, idx) =>
        prisma.faqItem.update({ where: { id }, data: { order: idx } }),
      ),
    );
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { ok: true };
  } catch (err) {
    return actionError("reorderFaqs", err, "Failed to reorder FAQs.");
  }
}
