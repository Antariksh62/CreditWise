import { getDatabase } from "./mongodb.js";
import fs from "fs";
import path from "path";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "feedback_store.json");

function readLocalStore() {
  try {
    if (!fs.existsSync(LOCAL_FALLBACK_FILE)) {
      return {
        recommendation_feedback: [],
        user_consents: [],
        reward_outcomes: [],
        recommendation_sessions: [],
      };
    }
    const data = fs.readFileSync(LOCAL_FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return {
      recommendation_feedback: [],
      user_consents: [],
      reward_outcomes: [],
      recommendation_sessions: [],
    };
  }
}

function writeLocalStore(store) {
  try {
    const dir = path.dirname(LOCAL_FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write to local feedback store fallback:", e.message);
  }
}

/**
 * Save user consent record.
 * Separates feedback collection consent from external AI processing consent.
 */
export async function saveConsentRecord({
  sessionId,
  consentFeedbackCollection = false,
  consentExternalAIProcessing = false,
}) {
  if (!sessionId) throw new Error("Missing sessionId for consent tracking");

  const record = {
    sessionId: String(sessionId).slice(0, 64),
    consentFeedbackCollection: Boolean(consentFeedbackCollection),
    consentExternalAIProcessing: Boolean(consentExternalAIProcessing),
    policyVersion: "2026-03-transunion-cibil",
    updatedAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    try {
      await db.collection("user_consents").updateOne(
        { sessionId: record.sessionId },
        { $set: record },
        { upsert: true }
      );
      return { success: true, storage: "mongodb", record };
    } catch (err) {
      console.warn("MongoDB error saving consent:", err.message);
    }
  }

  // Graceful local fallback if MongoDB is not reachable
  const store = readLocalStore();
  const existingIdx = store.user_consents.findIndex((c) => c.sessionId === record.sessionId);
  if (existingIdx >= 0) {
    store.user_consents[existingIdx] = record;
  } else {
    store.user_consents.push(record);
  }
  writeLocalStore(store);
  return { success: true, storage: "local_store", record };
}

/**
 * Record a pseudonymous recommendation session
 */
export async function saveRecommendationSession({
  sessionId,
  cardCountSelected,
  spendingSummary,
  recommendedCardSlugs = [],
  totalGrossRewards = 0,
  totalAnnualFees = 0,
  netMonetaryValue = 0,
}) {
  if (!sessionId) return { success: false, reason: "Missing sessionId" };

  const session = {
    sessionId: String(sessionId).slice(0, 64),
    cardCountSelected: Number(cardCountSelected) || 1,
    spendingSummary: {
      groceries: Number(spendingSummary?.groceries || 0),
      dining: Number(spendingSummary?.dining || 0),
      shopping: Number(spendingSummary?.shopping || 0),
      travel: Number(spendingSummary?.travel || 0),
      fuel: Number(spendingSummary?.fuel || 0),
      utilities: Number(spendingSummary?.utilities || 0),
      totalMonthly: Number(spendingSummary?.totalMonthly || 0),
    },
    recommendedCardSlugs: Array.isArray(recommendedCardSlugs) ? recommendedCardSlugs.slice(0, 5) : [],
    totalGrossRewards: Math.round(Number(totalGrossRewards) || 0),
    totalAnnualFees: Math.round(Number(totalAnnualFees) || 0),
    netMonetaryValue: Math.round(Number(netMonetaryValue) || 0),
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    try {
      await db.collection("recommendation_sessions").updateOne(
        { sessionId: session.sessionId },
        { $set: session },
        { upsert: true }
      );
      return { success: true, storage: "mongodb" };
    } catch (err) {
      console.warn("MongoDB error saving recommendation session:", err.message);
    }
  }

  const store = readLocalStore();
  const existingIdx = store.recommendation_sessions.findIndex((s) => s.sessionId === session.sessionId);
  if (existingIdx >= 0) {
    store.recommendation_sessions[existingIdx] = session;
  } else {
    store.recommendation_sessions.push(session);
  }
  writeLocalStore(store);
  return { success: true, storage: "local_store" };
}

/**
 * Save user feedback on recommendations
 */
export async function saveFeedback({
  sessionId,
  satisfaction,
  dissatisfactionReasons = [],
  consideredOrApplied = [],
  userNotes = "",
  consentGranted = true,
}) {
  if (!consentGranted) {
    return { success: false, reason: "Consent required to store feedback." };
  }

  const feedbackRecord = {
    sessionId: String(sessionId || "anonymous").slice(0, 64),
    satisfaction: ["satisfied", "neutral", "dissatisfied"].includes(satisfaction)
      ? satisfaction
      : "neutral",
    dissatisfactionReasons: Array.isArray(dissatisfactionReasons)
      ? dissatisfactionReasons.map((r) => String(r).slice(0, 100)).slice(0, 10)
      : [],
    consideredOrApplied: Array.isArray(consideredOrApplied)
      ? consideredOrApplied.map((c) => String(c).slice(0, 50)).slice(0, 5)
      : [],
    userNotes: String(userNotes || "").trim().slice(0, 280),
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    try {
      await db.collection("recommendation_feedback").updateOne(
        { sessionId: feedbackRecord.sessionId },
        { $set: feedbackRecord },
        { upsert: true }
      );
      return { success: true, storage: "mongodb", feedbackRecord };
    } catch (err) {
      console.warn("MongoDB error saving feedback:", err.message);
    }
  }

  const store = readLocalStore();
  const existingIdx = store.recommendation_feedback.findIndex((f) => f.sessionId === feedbackRecord.sessionId);
  if (existingIdx >= 0) {
    store.recommendation_feedback[existingIdx] = feedbackRecord;
  } else {
    store.recommendation_feedback.push(feedbackRecord);
  }
  writeLocalStore(store);
  return { success: true, storage: "local_store", feedbackRecord };
}

/**
 * Record optional, voluntarily submitted actual reward outcomes for ML calibration
 */
export async function saveRewardOutcome({
  sessionId,
  cardSlug,
  actualMonthlySpend,
  actualRewardsEarned,
  period,
}) {
  if (!cardSlug) return { success: false, reason: "Missing cardSlug" };

  const outcome = {
    sessionId: String(sessionId || "anonymous").slice(0, 64),
    cardSlug: String(cardSlug).slice(0, 50),
    actualMonthlySpend: Math.max(0, Number(actualMonthlySpend) || 0),
    actualRewardsEarned: Math.max(0, Number(actualRewardsEarned) || 0),
    period: String(period || new Date().toISOString().slice(0, 7)),
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    try {
      await db.collection("reward_outcomes").insertOne(outcome);
      return { success: true, storage: "mongodb" };
    } catch (err) {
      console.warn("MongoDB error saving outcome:", err.message);
    }
  }

  const store = readLocalStore();
  store.reward_outcomes.push(outcome);
  writeLocalStore(store);
  return { success: true, storage: "local_store" };
}

