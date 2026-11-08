import { NextResponse } from "next/server";
import { saveRewardOutcome } from "../../../lib/feedbackService.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, cardSlug, actualMonthlySpend, actualRewardsEarned, period } = body;

    if (!cardSlug) {
      return NextResponse.json({ error: "Missing cardSlug" }, { status: 400 });
    }

    const res = await saveRewardOutcome({
      sessionId,
      cardSlug,
      actualMonthlySpend,
      actualRewardsEarned,
      period,
    });

    return NextResponse.json(res);
  } catch (err) {
    console.error("Error in /api/outcomes:", err);
    return NextResponse.json(
      { error: "Failed to record outcome.", details: err.message },
      { status: 500 }
    );
  }
}

