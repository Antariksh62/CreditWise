/**
 * lib/geminiClient.js
 * ------------------------------------------------------------
 * Robust Google Gemini API client with intelligent retry,
 * comprehensive failure classification, and graceful deterministic fallback.
 *
 * Security:
 * - API Key is kept strictly server-side in process.env.GEMINI_API_KEY.
 * - Never log or expose API keys, internal stack traces, or raw sensitive user data.
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 8000;
const MAX_TRANSIENT_RETRIES = 2; // Up to 2 retries (3 total attempts)

export const ERROR_TYPES = {
  RATE_LIMIT_OR_QUOTA: "RATE_LIMIT_OR_QUOTA", // HTTP 429
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE", // HTTP 503
  TRANSIENT_SERVER_ERROR: "TRANSIENT_SERVER_ERROR", // HTTP 500, 502, 504
  NETWORK_ERROR: "NETWORK_ERROR", // Fetch failed, DNS, connection reset
  TIMEOUT: "TIMEOUT", // AbortController timeout exceeded
  INVALID_RESPONSE: "INVALID_RESPONSE", // Missing parts or unparseable JSON
  AUTH_OR_CONFIG_ERROR: "AUTH_OR_CONFIG_ERROR", // HTTP 400, 401, 403 or missing key
};

/**
 * Checks if an error type is eligible for intelligent retry.
 */
function isRetryableError(errorType) {
  return [
    ERROR_TYPES.RATE_LIMIT_OR_QUOTA,
    ERROR_TYPES.SERVICE_UNAVAILABLE,
    ERROR_TYPES.TRANSIENT_SERVER_ERROR,
    ERROR_TYPES.NETWORK_ERROR,
    ERROR_TYPES.TIMEOUT,
  ].includes(errorType);
}

/**
 * Sleep with jitter
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Computes exponential backoff delay with jitter.
 */
function computeBackoff(attempt, retryAfterHeader = null) {
  if (retryAfterHeader) {
    const parsed = parseInt(retryAfterHeader, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 5) {
      return parsed * 1000;
    }
  }
  const base = 400 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 250);
  return Math.min(2500, base + jitter);
}

/**
 * Calls Gemini API with structured spending parsing prompt.
 *
 * @param {string} userText - User's spending description
 * @param {object} options - Optional config (testOverride, etc.)
 * @returns {Promise<object>} Structured result or fallback indicator
 */
export async function parseSpendingWithGemini(userText, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Handle missing or clearly invalid API key as configuration error
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
    console.warn("[GeminiClient] Configuration warning: GEMINI_API_KEY is not configured.");
    return {
      success: false,
      errorType: ERROR_TYPES.AUTH_OR_CONFIG_ERROR,
      message: "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
      retryCount: 0,
      fallbackToDeterministic: true,
    };
  }

  // Allow test overrides for automated browser & unit testing
  const testOverride = options.testOverride || null;

  let attempt = 0;
  let lastErrorType = null;
  let retryCount = 0;

  const systemInstruction = `You are a financial spending extraction engine for Indian credit card optimization.
Extract monthly spending amounts for these 7 categories from the user text:
- groceries (Groceries, supermarkets, DMart, Blinkit, Zepto, BigBasket)
- dining (Restaurants, cafes, Zomato, Swiggy, food delivery)
- fuel (Fuel, petrol, diesel, CNG, EV charging, HPCL, BPCL, IOCL)
- shopping (Online & offline shopping, Amazon, Flipkart, Myntra, electronics)
- travel (Flights, hotels, vacations, trains, MakeMyTrip)
- utilities (Electricity, bills, mobile recharge, broadband, piped gas)
- other (Other day-to-day general expenses)

Extract user preferences:
- preferredRewardType: "Cashback" | "Reward Points" | "Travel Benefits" | "No Preference"
- preferredCardCharacteristics: "Low Annual Fee" | "Premium Benefits" | "Simplicity" | "Maximum Rewards"

RULES:
1. NEVER invent spending amounts. If a category is not mentioned, assign 0.
2. Convert all amounts to monthly figures in Indian Rupees (INR numbers only, no commas or symbols).
3. If an overall monthly budget is stated without category breakdown, leave categories at 0 and note totalMonthlySpend.
4. Output strict JSON matching this exact structure:
{
  "groceries": number,
  "dining": number,
  "fuel": number,
  "shopping": number,
  "travel": number,
  "utilities": number,
  "other": number,
  "totalMonthlySpend": number,
  "preferredRewardType": string,
  "preferredCardCharacteristics": string,
  "summaryNotes": string
}`;

  while (attempt <= MAX_TRANSIENT_RETRIES) {
    let controller = null;
    let timeoutId = null;

    try {
      // 1. Check for test overrides
      if (testOverride) {
        if (testOverride === "429") {
          throw new GeminiError(ERROR_TYPES.RATE_LIMIT_OR_QUOTA, "Rate limit exceeded (simulated 429)");
        }
        if (testOverride === "503") {
          throw new GeminiError(ERROR_TYPES.SERVICE_UNAVAILABLE, "Service unavailable (simulated 503)");
        }
        if (testOverride === "500") {
          throw new GeminiError(ERROR_TYPES.TRANSIENT_SERVER_ERROR, "Server error (simulated 500)");
        }
        if (testOverride === "timeout") {
          throw new GeminiError(ERROR_TYPES.TIMEOUT, "Request timed out (simulated timeout)");
        }
        if (testOverride === "invalid_json") {
          throw new GeminiError(ERROR_TYPES.INVALID_RESPONSE, "Malformed JSON response (simulated)");
        }
        if (testOverride === "auth_error") {
          throw new GeminiError(ERROR_TYPES.AUTH_OR_CONFIG_ERROR, "Invalid API credentials (simulated 401)");
        }
      }

      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const endpoint = `${API_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

      const requestPayload = {
        contents: [
          {
            role: "user",
            parts: [{ text: userText }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-200 HTTP statuses
      if (!res.ok) {
        const status = res.status;
        const retryAfter = res.headers.get("retry-after");

        if (status === 429) {
          throw new GeminiError(ERROR_TYPES.RATE_LIMIT_OR_QUOTA, "Quota or rate limit exceeded", retryAfter);
        }
        if (status === 503) {
          throw new GeminiError(ERROR_TYPES.SERVICE_UNAVAILABLE, "Gemini service temporarily unavailable", retryAfter);
        }
        if (status >= 500) {
          throw new GeminiError(ERROR_TYPES.TRANSIENT_SERVER_ERROR, `Gemini transient server error ${status}`, retryAfter);
        }
        if (status === 400 || status === 401 || status === 403) {
          throw new GeminiError(ERROR_TYPES.AUTH_OR_CONFIG_ERROR, `Gemini authentication or client error ${status}`);
        }
        throw new GeminiError(ERROR_TYPES.TRANSIENT_SERVER_ERROR, `Unexpected Gemini HTTP status ${status}`);
      }

      // Parse JSON from response
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new GeminiError(ERROR_TYPES.INVALID_RESPONSE, "Gemini response contained no content");
      }

      let parsedJson = null;
      try {
        parsedJson = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new GeminiError(ERROR_TYPES.INVALID_RESPONSE, "Failed to parse JSON from Gemini response");
      }

      if (!parsedJson || typeof parsedJson !== "object") {
        throw new GeminiError(ERROR_TYPES.INVALID_RESPONSE, "Gemini JSON response is not an object");
      }

      // Sanitize spending amounts to non-negative numbers
      const sanitizedSpending = {
        groceries: Math.max(0, parseInt(parsedJson.groceries, 10) || 0),
        dining: Math.max(0, parseInt(parsedJson.dining, 10) || 0),
        fuel: Math.max(0, parseInt(parsedJson.fuel, 10) || 0),
        shopping: Math.max(0, parseInt(parsedJson.shopping, 10) || 0),
        travel: Math.max(0, parseInt(parsedJson.travel, 10) || 0),
        utilities: Math.max(0, parseInt(parsedJson.utilities, 10) || 0),
        other: Math.max(0, parseInt(parsedJson.other, 10) || 0),
      };

      const extractedTotal = Object.values(sanitizedSpending).reduce((a, b) => a + b, 0);

      // Validate preferred reward type and characteristics
      const validRewardTypes = ["Cashback", "Reward Points", "Travel Benefits", "No Preference"];
      const validCharacteristics = ["Low Annual Fee", "Premium Benefits", "Simplicity", "Maximum Rewards"];

      const preferredRewardType = validRewardTypes.includes(parsedJson.preferredRewardType)
        ? parsedJson.preferredRewardType
        : "No Preference";

      const preferredCardCharacteristics = validCharacteristics.includes(parsedJson.preferredCardCharacteristics)
        ? parsedJson.preferredCardCharacteristics
        : "Simplicity";

      return {
        success: true,
        mode: "ai",
        categories: sanitizedSpending,
        spending: sanitizedSpending,
        extractedTotal,
        totalMonthlySpend: Math.max(extractedTotal, parseInt(parsedJson.totalMonthlySpend, 10) || extractedTotal),
        preferences: {
          preferredRewardType,
          preferredCardCharacteristics,
        },
        summaryNotes: parsedJson.summaryNotes || "",
        retryCount,
      };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);

      let errorType = ERROR_TYPES.NETWORK_ERROR;
      if (err instanceof GeminiError) {
        errorType = err.errorType;
      } else if (err.name === "AbortError") {
        errorType = ERROR_TYPES.TIMEOUT;
      }

      lastErrorType = errorType;

      // Check if retryable
      if (isRetryableError(errorType) && attempt < MAX_TRANSIENT_RETRIES) {
        attempt++;
        retryCount++;
        const backoffDelay = computeBackoff(attempt, err.retryAfter);
        await sleep(backoffDelay);
        continue;
      }

      // Non-retryable error (e.g. AUTH_OR_CONFIG_ERROR) or exhausted retries
      break;
    }
  }

  // Graceful fallback response
  return {
    success: false,
    errorType: lastErrorType,
    fallbackToDeterministic: true,
    retryCount,
    message: "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
  };
}

class GeminiError extends Error {
  constructor(errorType, message, retryAfter = null) {
    super(message);
    this.name = "GeminiError";
    this.errorType = errorType;
    this.retryAfter = retryAfter;
  }
}

