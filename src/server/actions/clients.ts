"use server";

import { actionError } from "@/server/action-error";

import { requireAdmin } from "@/lib/auth/current";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { clientInputSchema, deleteClientSchema } from "@/server/validation/client";

export async function createClient(
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = clientInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.client.create({ data: parsed.data });
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err) {
    return actionError("createClient", err, "Failed to create client.");
  }
}

export async function updateClient(
  id: string,
  raw: unknown,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = clientInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((e) => e.message).join("; ") };
  try {
    const row = await prisma.client.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { ok: true, data: row };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Client not found." };
    }
    return actionError("updateClient", err, "Failed to update client.");
  }
}

export async function deleteClient(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const parsed = deleteClientSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid input." };
  try {
    await prisma.client.delete({ where: { id: parsed.data.id } });
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { ok: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return { ok: false, error: "Client not found." };
    }
    return actionError("deleteClient", err, "Failed to delete client.");
  }
}
