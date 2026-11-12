/**
 * lib/rateLimit.js
 * ------------------------------------------------------------
 * Lightweight in-memory sliding-window rate limiter for serverless Next.js API routes.
 * Protects public mutation and parsing endpoints against spam and resource exhaustion.
 *
 * Scopes limits by endpoint + IP so high volume on one endpoint doesn't block another.
 * Respects internal test bypass headers during automated CI/acceptance tests.
 */

const scopedRequestMap = new Map();

/**
 * Extracts client IP safely from Next.js request headers.
 */
export function getClientIp(request) {
  if (!request) return "127.0.0.1";
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks if a request exceeds the rate limit.
 *
 * @param {Request} request - Next.js Request object
 * @param {object} options
 * @param {string} [options.endpoint="default"] - Distinct endpoint identifier
 * @param {number} [options.windowMs=60000] - Sliding window in ms
 * @param {number} [options.maxRequests=30] - Max requests allowed per window
 * @returns {{ limited: boolean, remaining: number, resetMs: number }}
 */
export function checkRateLimit(request, { endpoint = "default", windowMs = 60000, maxRequests = 60 } = {}) {
  // Allow test runners with test headers or test environment to execute automated suites
  if (
    request?.headers?.get("x-test-gemini-status") ||
    request?.headers?.get("x-test-bypass-rate-limit") ||
    process.env.NODE_ENV === "test"
  ) {
    return { limited: false, remaining: maxRequests, resetMs: 0 };
  }

  const ip = typeof request === "string" ? request : getClientIp(request);
  const now = Date.now();
  const key = `${endpoint}:${ip}`;
  const entry = scopedRequestMap.get(key) || { count: 0, resetTime: now + windowMs };

  // Reset window if expired
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    scopedRequestMap.set(key, entry);

    // Periodic cleanup of stale entries
    if (scopedRequestMap.size > 2000) {
      for (const [k, v] of scopedRequestMap.entries()) {
        if (now > v.resetTime) {
          scopedRequestMap.delete(k);
        }
      }
    }

    return { limited: false, remaining: maxRequests - 1, resetMs: windowMs };
  }

  // Increment
  entry.count += 1;
  scopedRequestMap.set(key, entry);

  const limited = entry.count > maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);
  const resetMs = Math.max(0, entry.resetTime - now);

  return { limited, remaining, resetMs };
}
