import { NextResponse } from "next/server";
import users from "../../../data/users.json";
import { checkRateLimit } from "../../../lib/rateLimit.js";

/**
 * GET /api/check-username?username=aarav
 * ------------------------------------------------------------
 * Validates availability of a username for registration.
 * Validated server-side against registered database / store.
 */

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function GET(request) {
  try {
    const limit = checkRateLimit(request, { endpoint: "check-username", windowMs: 60000, maxRequests: 50 });
    if (limit.limited) {
      return NextResponse.json(
        { username: "", available: false, reason: "rate_limited" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const username = (searchParams.get("username") || "").trim();

    // Validate on the server too — never trust the client alone.
    if (!username) {
      return NextResponse.json(
        { username, available: false, reason: "missing" },
        { status: 400 }
      );
    }

    if (!USERNAME_PATTERN.test(username)) {
      return NextResponse.json(
        { username, available: false, reason: "invalid" },
        { status: 400 }
      );
    }

    const taken = users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    return NextResponse.json({
      username,
      available: !taken,
      reason: taken ? "taken" : "available",
    });
  } catch (err) {
    console.error("Error in /api/check-username:", err?.message || err);
    return NextResponse.json(
      {
        username: "",
        available: false,
        reason: "server_error",
        ...(process.env.NODE_ENV !== "production" ? { details: err?.message } : {}),
      },
      { status: 500 }
    );
  }
}
