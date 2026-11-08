import { NextResponse } from "next/server";
import { saveFeedback, saveRecommendationSession } from "../../../lib/feedbackService.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      action,
      satisfaction,
      dissatisfactionReasons,
      consideredOrApplied,
      userNotes,
      consentGranted,
      cardCountSelected,
      spendingSummary,
      recommendedCardSlugs,
      totalGrossRewards,
      totalAnnualFees,
      netMonetaryValue,
    } = body;

    // If recording a session
    if (action === "record_session") {
      const res = await saveRecommendationSession({
        sessionId,
        cardCountSelected,
        spendingSummary,
        recommendedCardSlugs,
        totalGrossRewards,
        totalAnnualFees,
        netMonetaryValue,
      });
      return NextResponse.json(res);
    }

    // Default: submit feedback
    if (!consentGranted) {
      return NextResponse.json(
        { error: "Explicit consent is required to submit feedback." },
        { status: 400 }
      );
    }

    const result = await saveFeedback({
      sessionId,
      satisfaction,
      dissatisfactionReasons,
      consideredOrApplied,
      userNotes,
      consentGranted,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in /api/feedback:", err);
    return NextResponse.json(
      { error: "Failed to process feedback.", details: err.message },
      { status: 500 }
    );
  }
}

