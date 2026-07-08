const DEFAULT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 60 * 1000;

type RateLimitBucket = {
    count: number;
    windowStartedAt: number;
};

// In-memory fixed-window limiter. Per server instance only: on serverless,
// each instance has its own counters, so this is a first barrier against
// bursts and naive spam, not a distributed quota.
const buckets = new Map<string, RateLimitBucket>();

let lastCleanupAt = 0;

export function checkRateLimit({
    key,
    maxRequests = DEFAULT_MAX_REQUESTS,
    windowMs = DEFAULT_WINDOW_MS,
}: {
    key: string;
    maxRequests?: number;
    windowMs?: number;
}) {
    const now = Date.now();

    cleanupExpiredBuckets(now, windowMs);

    const bucket = buckets.get(key);

    if (!bucket || now - bucket.windowStartedAt >= windowMs) {
        buckets.set(key, {
            count: 1,
            windowStartedAt: now,
        });

        return {
            ok: true as const,
            retryAfterSeconds: 0,
        };
    }

    bucket.count += 1;

    if (bucket.count <= maxRequests) {
        return {
            ok: true as const,
            retryAfterSeconds: 0,
        };
    }

    return {
        ok: false as const,
        retryAfterSeconds: Math.max(
            1,
            Math.ceil((bucket.windowStartedAt + windowMs - now) / 1000),
        ),
    };
}

export function getClientIp(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
        const [firstIp] = forwardedFor.split(",");

        if (firstIp?.trim()) {
            return firstIp.trim();
        }
    }

    return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function cleanupExpiredBuckets(now: number, windowMs: number) {
    if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;

    lastCleanupAt = now;

    for (const [key, bucket] of buckets) {
        if (now - bucket.windowStartedAt >= windowMs) {
            buckets.delete(key);
        }
    }
}
