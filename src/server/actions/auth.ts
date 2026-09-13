"use server";

import { actionError } from "@/server/action-error";

import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signIn(raw: unknown): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    // Same message either way — never reveal which half was wrong.
    const valid = await verifyPassword(parsed.data.password, user?.passwordHash);
    if (!user || !valid) return { ok: false, error: "Email or password is incorrect." };

    const { token, expires } = createSessionToken(user.id);
    const store = await cookies();
    store.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
    return { ok: true };
  } catch (error) {
    return actionError("signIn", error, "Sign in failed. Please try again.");
  }
}

export async function signOut(): Promise<{ ok: true }> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return { ok: true };
}
