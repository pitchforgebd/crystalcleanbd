"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { testimonialInputSchema, deleteTestimonialSchema } from "@/server/validation/testimonial";

export async function createTestimonial(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = testimonialInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.testimonial.create({ data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createTestimonial", err, "Failed to create testimonial.");
  }
}

export async function updateTestimonial(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = testimonialInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Testimonial not found." };
    }
    return actionError("updateTestimonial", err, "Failed to update testimonial.");
  }
}

export async function deleteTestimonial(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteTestimonialSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.testimonial.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Testimonial not found." };
    }
    return actionError("deleteTestimonial", err, "Failed to delete testimonial.");
  }
}
