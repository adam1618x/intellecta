// src/lib/rate-limit.ts
// Simple in-memory rate limiter for the login route.
// For multi-instance / production deployments, swap the Map for a Redis store.

type RateLimitEntry = {
    count: number;
    resetAt: number; // epoch ms
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
    /** Max requests allowed in the window */
    limit?: number;
    /** Window duration in seconds */
    windowSecs?: number;
};

type RateLimitResult =
    | { success: true }
    | { success: false; retryAfterSecs: number };

/**
 * Check and increment the rate limit counter for a given key.
 *
 * @param key       Identifier — e.g. the requester's IP address
 * @param options   limit (default 5) and windowSecs (default 60)
 */
export function rateLimit(
    key: string,
    { limit = 50, windowSecs = 60 }: RateLimitOptions = {}
): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSecs * 1000;

    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        // First request in this window (or window has expired)
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true };
    }

    if (entry.count >= limit) {
        const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
        return { success: false, retryAfterSecs };
    }

    entry.count += 1;
    return { success: true };
}