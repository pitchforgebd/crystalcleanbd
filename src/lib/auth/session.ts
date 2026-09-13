import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ccs_admin_session";
const SESSION_DAYS = 7;

export type SessionPayload = {
  /** AdminUser id */
  sub: string;
  /** issued at (seconds) */
  iat: number;
  /** expires at (seconds) */
  exp: number;
};

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short (needs 32+ characters). Set it in .env.",
    );
  }
  return value;
}

const encode = (value: Buffer | string) =>
  Buffer.from(value).toString("base64url");

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(userId: string): { token: string; expires: Date } {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: userId,
    iat: now,
    exp: now + SESSION_DAYS * 24 * 60 * 60,
  };
  const body = encode(JSON.stringify(payload));
  return { token: `${body}.${sign(body)}`, expires: new Date(payload.exp * 1000) };
}

/** Returns the payload only when the signature matches and it has not expired. */
export function readSessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload.sub || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}
