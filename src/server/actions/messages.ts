"use server";

import { actionError } from "@/server/action-error";

import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/current";
import { allowSubmission } from "@/server/rate-limit";
import { sendContactNotification } from "@/server/email";
import { getSiteInfo } from "@/lib/repository/site";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  contactMessageInputSchema,
  deleteMessageSchema,
  updateMessageStatusSchema,
} from "@/server/validation/messages";

// Admin: mark a message read/archived.
export async function updateMessageStatus(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = updateMessageStatusSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.contactMessage.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Message not found." };
    }
    return actionError("updateMessageStatus", err, "Failed to update message.");
  }
}

export async function deleteMessage(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteMessageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid message id." };
  try {
    await prisma.contactMessage.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return actionError("deleteMessage", error, "Failed to delete the message.");
  }
}

/**
 * Public endpoint — the website contact form. Deliberately NOT behind
 * requireAdmin(); abuse is limited by validation, a honeypot field and a
 * per-IP rate limit.
 */
export async function submitContactMessage(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = contactMessageInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((e) => e.message).join(" ") };
  }
  // Bot filled the hidden field — accept silently so it learns nothing.
  if (parsed.data.company) return { ok: true };

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";
  if (!allowSubmission(ip)) {
    return { ok: false, error: "Too many messages sent. Please try again in a few minutes." };
  }

  try {
    const row = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    // The message is safely stored; email is best-effort on top of that.
    const siteInfo = await getSiteInfo();
    const origin = headerList.get("origin") ?? process.env.SITE_URL ?? "";
    const outcome = await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
      brandName: siteInfo.brandName,
      adminUrl: origin ? `${origin}/admin/messages` : undefined,
    });
    if (!outcome.sent && outcome.reason === "not-configured") {
      console.warn(
        `[submitContactMessage] stored message ${row.id} but SMTP is not configured — no email sent.`,
      );
    }

    return { ok: true };
  } catch (error) {
    return actionError("submitContactMessage", error, "Could not send your message. Please try again.");
  }
}
