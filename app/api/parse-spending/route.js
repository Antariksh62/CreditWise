import { NextResponse } from "next/server";
import { parseSpendingWithGemini, ERROR_TYPES } from "../../../lib/geminiClient.js";

/**
 * Server-side rate limiter to prevent API abuse.
 * Sliding window: max 15 requests per minute per IP.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  // Reset window if expired
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, entry);
    return false;
  }

  // Increment and check limit
  entry.count += 1;
  rateLimitMap.set(ip, entry);

  // Clean up stale entries periodically
  if (rateLimitMap.size > 2000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function parseNum(rawStr) {
  if (!rawStr) return 0;
  let s = String(rawStr).replace(/,/g, "").trim().toLowerCase();
  let mult = 1;
  if (s.endsWith("k")) {
    mult = 1000;
    s = s.slice(0, -1).trim();
  } else if (s.endsWith("l") || s.endsWith("lakh") || s.endsWith("lakhs")) {
    mult = 100000;
    s = s.replace(/lakhs?|l/, "").trim();
  }
  const n = parseFloat(s);
  return isNaN(n) ? 0 : Math.round(n * mult);
}

/**
 * Deterministic natural-language spending parser (reliable manual/local fallback).
 * Never invents amounts.
 */
function parseNaturalLanguageSpending(text) {
  const clean = text.toLowerCase().trim();
  const spending = {
    groceries: 0,
    dining: 0,
    fuel: 0,
    shopping: 0,
    travel: 0,
    utilities: 0,
    other: 0,
  };

  const flags = [];
  const missingCategories = [];

  const CAT_REGEXES = {
    groceries: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:grocer(?:y|ies)|blinkit|zepto|dmart|instamart|bigbasket|supermarket)/i,
      /(?:grocer(?:y|ies)|blinkit|zepto|dmart|instamart|bigbasket|supermarket)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
    dining: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:dining|restaurant|food|eating\s*out|delivery|zomato|swiggy)/i,
      /(?:dining|restaurant|food|eating\s*out|delivery|zomato|swiggy)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
    fuel: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:fuel|petrol|diesel|cng|hpcl|bpcl|iocl|charging|ev)/i,
      /(?:fuel|petrol|diesel|cng|hpcl|bpcl|iocl|charging|ev)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
    shopping: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:shopping|amazon|flipkart|myntra|e-commerce|online|retail)/i,
      /(?:shopping|amazon|flipkart|myntra|e-commerce|online|retail)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
    travel: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:travel|flights?|hotels?|air|vacation|trips?|makemytrip|cleartrip|yatra)/i,
      /(?:travel|flights?|hotels?|air|vacation|trips?|makemytrip|cleartrip|yatra)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
    utilities: [
      /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|in|towards|at)?\s*(?:utilities|electricity|bills|broadband|wifi|mobile|recharge)/i,
      /(?:utilities|electricity|bills|broadband|wifi|mobile|recharge)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i,
    ],
  };

  const merchants = {};
  const MERCHANT_REGEXES = {
    amazon: [/(?:amazon|amzn)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:amazon|amzn)/i],
    flipkart: [/(?:flipkart)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:flipkart)/i],
    bigbasket: [/(?:bigbasket|bb)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:bigbasket|bb)/i],
    croma: [/(?:croma)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:croma)/i],
    tatacliq: [/(?:tata\s*cliq|cliq)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:tata\s*cliq|cliq)/i],
    swiggy: [/(?:swiggy)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:swiggy)/i],
    zomato: [/(?:zomato)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:zomato)/i],
    blinkit: [/(?:blinkit)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:blinkit)/i],
    zepto: [/(?:zepto)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:zepto)/i],
    dmart: [/(?:dmart)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:dmart)/i],
    bpcl: [/(?:bpcl|bharat\s*petroleum)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:bpcl|bharat\s*petroleum)/i],
    iocl: [/(?:iocl|indian\s*oil)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:iocl|indian\s*oil)/i],
    hpcl: [/(?:hpcl|hindustan\s*petroleum)\s*(?:around|of|approx|is|about|roughly|expense|spend)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)/i, /(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*l)?)\s*(?:on|for|at)?\s*(?:hpcl|hindustan\s*petroleum)/i],
  };

  Object.entries(MERCHANT_REGEXES).forEach(([mId, patterns]) => {
    for (const p of patterns) {
      const m = clean.match(p);
      if (m && m[1]) {
        const val = parseNum(m[1]);
        if (val > 0) {
          merchants[mId] = val;
          break;
        }
      }
    }
  });

  let anyCategoryMatched = false;
  Object.entries(CAT_REGEXES).forEach(([catKey, patterns]) => {
    for (const pattern of patterns) {
      const m = clean.match(pattern);
      if (m && m[1]) {
        const val = parseNum(m[1]);
        if (val > 0) {
          spending[catKey] = val;
          anyCategoryMatched = true;
          break;
        }
      }
    }
  });

  let totalMonthlySpend = 0;
  const totalMatch = clean.match(/(?:spend|spending|budget|expenses?)\s*(?:of|around|approx|roughly)?\s*(?:₹|rs\.?)?\s*(\d+(?:,\d+)*(?:\s*k|\s*lakhs?)?)\s*(?:monthly|per\s*month|\/mo)/i)
    || clean.match(/(\d+(?:,\d+)*(?:\s*k|\s*lakhs?)?)\s*(?:monthly|per\s*month|\/mo)\s*(?:spend|expenses?)/i);

  if (totalMatch) {
    totalMonthlySpend = parseNum(totalMatch[1]);
  }

  // Preference heuristics for fallback
  let preferredRewardType = "No Preference";
  if (/cashback|statement\s*credit/i.test(clean)) {
    preferredRewardType = "Cashback";
  } else if (/miles|flights?|hotels?|travel\s*points/i.test(clean)) {
    preferredRewardType = "Travel Benefits";
  } else if (/points|reward\s*points/i.test(clean)) {
    preferredRewardType = "Reward Points";
  }

  let preferredCardCharacteristics = "Simplicity";
  if (/lifetime\s*free|zero\s*fee|no\s*fee|ltf|low\s*fee/i.test(clean)) {
    preferredCardCharacteristics = "Low Annual Fee";
  } else if (/premium|luxury|lounge|metal/i.test(clean)) {
    preferredCardCharacteristics = "Premium Benefits";
  } else if (/maximum\s*returns|highest\s*rewards|optimize/i.test(clean)) {
    preferredCardCharacteristics = "Maximum Rewards";
  }

  const extractedTotal = Object.values(spending).reduce((a, b) => a + b, 0);

  return {
    spending,
    categories: spending,
    merchants,
    extractedTotal,
    totalMonthlySpend: totalMonthlySpend || extractedTotal,
    preferences: {
      preferredRewardType,
      preferredCardCharacteristics,
    },
    flags,
    missingCategories,
  };
}

export async function POST(request) {
  try {
    // 1. IP extraction and Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
                     request.headers.get("x-real-ip") ||
                     "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before trying again.",
          rateLimited: true,
        },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        }
      );
    }

    const testHeader = request.headers.get("x-test-gemini-status");
    const body = await request.json().catch(() => ({}));
    const { text, testOverride: bodyOverride } = body;

    const testOverride = testHeader || bodyOverride || null;

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid spending description." },
        { status: 400 }
      );
    }

    // Input length constraint to prevent token exhaustion and prompt injection abuse
    if (text.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: "Spending description must be under 1000 characters." },
        { status: 400 }
      );
    }

    // 2. Try Gemini AI parsing with failure detection and intelligent retries
    const aiResult = await parseSpendingWithGemini(text, { testOverride });

    if (aiResult.success) {
      return NextResponse.json({
        success: true,
        mode: "ai",
        categories: aiResult.categories,
        spending: aiResult.spending,
        extractedTotal: aiResult.extractedTotal,
        totalMonthlySpend: aiResult.totalMonthlySpend,
        preferences: aiResult.preferences,
        summaryNotes: aiResult.summaryNotes,
        aiUnavailable: false,
      });
    }

    // 2. Automatic graceful manual fallback:
    // If Gemini fails (rate limits, timeouts, 5xx, or config errors), run local deterministic parser
    // so user data is never lost, and flag aiUnavailable so the UI displays the friendly fallback message.
    const fallbackResult = parseNaturalLanguageSpending(text);

    return NextResponse.json({
      success: true,
      mode: "fallback",
      aiUnavailable: true,
      errorType: aiResult.errorType || ERROR_TYPES.SERVICE_UNAVAILABLE,
      retryCount: aiResult.retryCount || 0,
      message: "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
      categories: fallbackResult.categories,
      spending: fallbackResult.spending,
      extractedTotal: fallbackResult.extractedTotal,
      totalMonthlySpend: fallbackResult.totalMonthlySpend,
      preferences: fallbackResult.preferences,
    });
  } catch (err) {
    console.error("[parse-spending] Unhandled error:", err.message);
    // Even on server-level error, gracefully return deterministic fallback
    return NextResponse.json({
      success: true,
      mode: "fallback",
      aiUnavailable: true,
      errorType: ERROR_TYPES.TRANSIENT_SERVER_ERROR,
      message: "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
      categories: {
        groceries: 0,
        dining: 0,
        fuel: 0,
        shopping: 0,
        travel: 0,
        utilities: 0,
        other: 0,
      },
      spending: {
        groceries: 0,
        dining: 0,
        fuel: 0,
        shopping: 0,
        travel: 0,
        utilities: 0,
        other: 0,
      },
      preferences: {
        preferredRewardType: "No Preference",
        preferredCardCharacteristics: "Simplicity",
      },
    });
  }
}
