import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";

export type AdminIdentity = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor";
};

/** The signed-in admin, or null. Safe to call from layouts, pages and actions. */
export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const store = await cookies();
  const payload = readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true },
  });
  return user ?? null;
}

export type AdminGuard =
  | { ok: true; admin: AdminIdentity }
  | { ok: false; error: string };

/**
 * Gate for every write. Server Actions are public HTTP endpoints, so each one
 * must check for itself — route protection alone is not enough.
 */
export async function requireAdmin(): Promise<AdminGuard> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Your session has expired. Please sign in again." };
  return { ok: true, admin };
}

/** Owner-only operations (e.g. managing other admins). */
export async function requireOwner(): Promise<AdminGuard> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  if (guard.admin.role !== "owner") {
    return { ok: false, error: "Only an owner can perform this action." };
  }
  return guard;
}
