import { NextResponse } from "next/server";
import { saveConsentRecord } from "../../../lib/feedbackService.js";
import { checkRateLimit } from "../../../lib/rateLimit.js";

export async function POST(request) {
  try {
    const limit = checkRateLimit(request, { endpoint: "consent", windowMs: 60000, maxRequests: 30 });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId, consentFeedbackCollection, consentExternalAIProcessing } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing or invalid sessionId" }, { status: 400 });
    }

    const res = await saveConsentRecord({
      sessionId,
      consentFeedbackCollection: Boolean(consentFeedbackCollection),
      consentExternalAIProcessing: Boolean(consentExternalAIProcessing),
    });

    return NextResponse.json(res);
  } catch (err) {
    console.error("Error in /api/consent:", err?.message || err);
    return NextResponse.json(
      {
        error: "Failed to record consent.",
        ...(process.env.NODE_ENV !== "production" ? { details: err?.message } : {}),
      },
      { status: 500 }
    );
  }
}
