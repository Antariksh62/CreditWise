import { NextResponse } from "next/server";
import { saveConsentRecord } from "../../../lib/feedbackService.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, consentFeedbackCollection, consentExternalAIProcessing } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const res = await saveConsentRecord({
      sessionId,
      consentFeedbackCollection,
      consentExternalAIProcessing,
    });

    return NextResponse.json(res);
  } catch (err) {
    console.error("Error in /api/consent:", err);
    return NextResponse.json(
      { error: "Failed to record consent.", details: err.message },
      { status: 500 }
    );
  }
}

