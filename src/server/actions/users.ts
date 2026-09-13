"use server";

import { actionError } from "@/server/action-error";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth/current";
import { hashPassword } from "@/lib/auth/password";
import {
  createAdminSchema,
  deleteAdminSchema,
  resetAdminPasswordSchema,
  updateAdminSchema,
} from "@/server/validation/users";

type Result<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

const DUPLICATE_EMAIL = "Another admin already uses that email address.";

function isDuplicate(error: unknown) {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

/** Owners must never be able to lock everyone out of the dashboard. */
async function ownerCount(): Promise<number> {
  return prisma.adminUser.count({ where: { role: "owner" } });
}

export async function createAdmin(raw: unknown): Promise<Result> {
  const guard = await requireOwner();
  if (!guard.ok) return guard;

  const parsed = createAdminSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    const row = await prisma.adminUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    revalidatePath("/admin/users");
    return { ok: true, data: row };
  } catch (error) {
    if (isDuplicate(error)) return { ok: false, error: DUPLICATE_EMAIL };
    return actionError("createAdmin", error, "Failed to create the admin.");
  }
}

export async function updateAdmin(raw: unknown): Promise<Result> {
  const guard = await requireOwner();
  if (!guard.ok) return guard;

  const parsed = updateAdminSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    const target = await prisma.adminUser.findUnique({ where: { id: parsed.data.id } });
    if (!target) return { ok: false, error: "That admin no longer exists." };

    // Demoting the last owner would leave nobody able to manage admins.
    if (target.role === "owner" && parsed.data.role !== "owner" && (await ownerCount()) <= 1) {
      return { ok: false, error: "There must be at least one owner." };
    }

    const row = await prisma.adminUser.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin/account");
    return { ok: true, data: row };
  } catch (error) {
    if (isDuplicate(error)) return { ok: false, error: DUPLICATE_EMAIL };
    return actionError("updateAdmin", error, "Failed to update the admin.");
  }
}

/** Owner-set password, e.g. when a colleague is locked out. */
export async function resetAdminPassword(raw: unknown): Promise<Result<null>> {
  const guard = await requireOwner();
  if (!guard.ok) return guard;

  const parsed = resetAdminPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    await prisma.adminUser.update({
      where: { id: parsed.data.id },
      data: { passwordHash: await hashPassword(parsed.data.password) },
    });
    return { ok: true, data: null };
  } catch (error) {
    return actionError("resetAdminPassword", error, "Failed to set the password.");
  }
}

export async function deleteAdmin(raw: unknown): Promise<Result<null>> {
  const guard = await requireOwner();
  if (!guard.ok) return guard;

  const parsed = deleteAdminSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid admin id." };

  // Deleting yourself would sign you out mid-session with no way back.
  if (parsed.data.id === guard.admin.id) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  try {
    const target = await prisma.adminUser.findUnique({ where: { id: parsed.data.id } });
    if (!target) return { ok: false, error: "That admin no longer exists." };
    if (target.role === "owner" && (await ownerCount()) <= 1) {
      return { ok: false, error: "There must be at least one owner." };
    }

    await prisma.adminUser.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/users");
    return { ok: true, data: null };
  } catch (error) {
    return actionError("deleteAdmin", error, "Failed to delete the admin.");
  }
}
