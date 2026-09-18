/**
 * Simple in-memory login rate limiter, keyed by identifier + IP.
 *
 * This is process-local and resets on redeploy, which is fine for a single
 * server instance. For a multi-instance production deployment, swap this
 * for a shared store (e.g. Upstash Redis / Vercel KV) behind the same
 * `checkRateLimit` signature.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - existing.count };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
