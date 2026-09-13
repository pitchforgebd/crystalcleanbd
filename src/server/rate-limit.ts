/**
 * Tiny in-memory rate limiter for public endpoints.
 *
 * Single-process only, which matches the cPanel/Node deployment target. If the
 * app is ever scaled to multiple instances this needs to move to the database
 * or a shared cache.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

export function allowSubmission(key: string, max = MAX_PER_WINDOW): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic cleanup so the map cannot grow without bound.
    if (buckets.size > 500) {
      for (const [entryKey, entry] of buckets) {
        if (entry.resetAt <= now) buckets.delete(entryKey);
      }
    }
    return true;
  }

  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}
