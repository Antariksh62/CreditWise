import { NextResponse } from "next/server";
import { saveRewardOutcome } from "../../../lib/feedbackService.js";
import { checkRateLimit } from "../../../lib/rateLimit.js";

export async function POST(request) {
  try {
    const limit = checkRateLimit(request, { endpoint: "outcomes", windowMs: 60000, maxRequests: 25 });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId, cardSlug, actualMonthlySpend, actualRewardsEarned, period } = body;

    if (!cardSlug || typeof cardSlug !== "string") {
      return NextResponse.json({ error: "Missing or invalid cardSlug" }, { status: 400 });
    }

    const res = await saveRewardOutcome({
      sessionId,
      cardSlug,
      actualMonthlySpend: Number(actualMonthlySpend) || 0,
      actualRewardsEarned: Number(actualRewardsEarned) || 0,
      period: period || "monthly",
    });

    return NextResponse.json(res);
  } catch (err) {
    console.error("Error in /api/outcomes:", err?.message || err);
    return NextResponse.json(
      {
        error: "Failed to record outcome.",
        ...(process.env.NODE_ENV !== "production" ? { details: err?.message } : {}),
      },
      { status: 500 }
    );
  }
}
