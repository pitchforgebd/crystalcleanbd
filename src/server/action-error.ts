/**
 * One place to turn a thrown error into an admin-facing message.
 *
 * Production keeps the short, safe sentence. Development appends the real
 * reason, because a bare "Failed to update …" gives the person at the keyboard
 * nothing to act on — a stale Prisma client or a too-long column looks
 * identical otherwise.
 */
export function actionError(
  scope: string,
  error: unknown,
  fallback: string,
): { ok: false; error: string } {
  console.error(`[${scope}]`, error);

  if (process.env.NODE_ENV === "production" || !(error instanceof Error)) {
    return { ok: false, error: fallback };
  }

  // Prisma errors are long and multi-line; the last line carries the cause.
  const detail = error.message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();

  if (!detail) return { ok: false, error: fallback };
  const trimmed = detail.length > 180 ? `${detail.slice(0, 180)}…` : detail;
  return { ok: false, error: `${fallback} (${trimmed})` };
}
