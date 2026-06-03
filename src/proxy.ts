import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory store — resets on cold start (acceptable for Edge without Redis)
// Each entry: [count, windowEndMs]
const store = new Map<string, [number, number]>();
const WINDOW_MS = 60_000; // 1 minute
const LIMITS: Record<string, number> = {
  "/api/checkout": 5,    // strict: 5 per minute
  "/api/newsletter": 10, // moderate: 10 per minute
  "/api/": 30,           // default for all other /api routes
};

function getLimit(pathname: string): number {
  for (const [prefix, limit] of Object.entries(LIMITS)) {
    if (pathname.startsWith(prefix)) return limit;
  }
  return 60;
}

function checkRate(key: string, limit: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry[1]) {
    store.set(key, [1, now + WINDOW_MS]);
    return { ok: true, remaining: limit - 1 };
  }
  if (entry[0] >= limit) return { ok: false, remaining: 0 };
  entry[0]++;
  return { ok: true, remaining: limit - entry[0] };
}

// Evict stale entries periodically (every 100 requests)
let sweepCounter = 0;
function maybeSweep() {
  if (++sweepCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [k, [, exp]] of store) {
    if (now > exp) store.delete(k);
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only rate-limit API routes
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const limit = getLimit(pathname);
    const key = `${ip}:${pathname}`;
    maybeSweep();
    const { ok, remaining } = checkRate(key, limit);

    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", String(limit));
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
