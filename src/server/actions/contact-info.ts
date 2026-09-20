"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  contactEmailInputSchema,
  contactPhoneInputSchema,
  deleteContactEmailSchema,
  deleteContactPhoneSchema,
} from "@/server/validation/contact-info";

function revalidateContactChannels() {
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/layout");
}

// ---------------------------------------------------------------------------
// Emails
// ---------------------------------------------------------------------------

export async function createContactEmail(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = contactEmailInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.contactEmail.create({ data: parsed.data });
    revalidateContactChannels();
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createContactEmail", err, "Failed to create email.");
  }
}

export async function updateContactEmail(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = contactEmailInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.contactEmail.update({ where: { id }, data: parsed.data });
    revalidateContactChannels();
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Email not found." };
    }
    return actionError("updateContactEmail", err, "Failed to update email.");
  }
}

export async function deleteContactEmail(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteContactEmailSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.contactEmail.delete({ where: { id: parsed.data.id } });
    revalidateContactChannels();
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Email not found." };
    }
    return actionError("deleteContactEmail", err, "Failed to delete email.");
  }
}

// ---------------------------------------------------------------------------
// Phones
// ---------------------------------------------------------------------------

export async function createContactPhone(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = contactPhoneInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.contactPhone.create({ data: parsed.data });
    revalidateContactChannels();
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createContactPhone", err, "Failed to create phone number.");
  }
}

export async function updateContactPhone(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = contactPhoneInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.contactPhone.update({ where: { id }, data: parsed.data });
    revalidateContactChannels();
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Phone number not found." };
    }
    return actionError("updateContactPhone", err, "Failed to update phone number.");
  }
}

export async function deleteContactPhone(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteContactPhoneSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.contactPhone.delete({ where: { id: parsed.data.id } });
    revalidateContactChannels();
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Phone number not found." };
    }
    return actionError("deleteContactPhone", err, "Failed to delete phone number.");
  }
}
