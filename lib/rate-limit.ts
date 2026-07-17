// Simple in-memory per-IP rate limit for the public lead endpoint
// (architecture.md §3.4). Note: this only works correctly on a single Node
// process/instance — if Hostinger ever runs multiple instances behind a
// load balancer, this needs a shared store (e.g. a Postgres table) instead.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
