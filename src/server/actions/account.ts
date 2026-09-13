"use server";

import { actionError } from "@/server/action-error";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/current";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(160),
  email: z.string().trim().email("Enter a valid email.").max(160),
});

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "New password must be at least 8 characters."),
    confirm: z.string().min(1, "Confirm the new password."),
  })
  .refine((value) => value.next === value.confirm, {
    message: "New passwords do not match.",
    path: ["confirm"],
  });

/** Update the signed-in admin's own name and email. */
export async function updateOwnProfile(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    const row = await prisma.adminUser.update({
      where: { id: auth.admin.id },
      data: { name: parsed.data.name, email: parsed.data.email.toLowerCase() },
      select: { id: true, name: true, email: true, role: true },
    });
    revalidatePath("/admin/account");
    revalidatePath("/admin");
    return { ok: true, data: row };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { ok: false, error: "Another admin already uses that email address." };
    }
    return actionError("updateOwnProfile", error, "Failed to update the profile.");
  }
}

/** Change the signed-in admin's own password, verifying the current one first. */
export async function changeOwnPassword(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = passwordSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { id: auth.admin.id } });
    if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
      return { ok: false, error: "Current password is incorrect." };
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.next) },
    });
    return { ok: true };
  } catch (error) {
    return actionError("changeOwnPassword", error, "Failed to change the password.");
  }
}
