import { NextResponse } from "next/server";
import { checkRateLimit } from "../../../lib/rateLimit.js";

export async function POST(request) {
  try {
    const limit = checkRateLimit(request, { endpoint: "explain", windowMs: 60000, maxRequests: 60 });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json().catch(() => ({}));
    let cards = [];
    let allocations = {};
    let grossRewards = 0;
    let totalFees = 0;
    let netValue = 0;
    let cardCount = 1;

    if (body.combination && Array.isArray(body.combination.cards)) {
      cards = body.combination.cards;
      allocations = body.combination.allocations || {};
      grossRewards = body.combination.grossRewards || 0;
      totalFees = body.combination.totalFees || 0;
      netValue = body.combination.netValue || 0;
      cardCount = body.cardCount || cards.length;
    } else if (Array.isArray(body.cards)) {
      cards = body.cards;
      allocations = body.allocations || {};
      grossRewards = body.grossRewards || 0;
      totalFees = body.totalFees || 0;
      netValue = body.netMonetaryValue || body.netValue || 0;
      cardCount = body.cardCount || cards.length;
    } else {
      return NextResponse.json(
        { error: "Invalid combination payload." },
        { status: 400 }
      );
    }

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "No cards provided in combination." },
        { status: 400 }
      );
    }

    // Build synthesized explanation based on deterministic optimizer data
    let synergySummary = "";
    let categoryAssignments = [];
    let limitationsToWatch = [];

    if (cards.length === 1) {
      const c = cards[0];
      synergySummary = `${c.name} delivers complete single-card convenience with estimated net value of ₹${netValue.toLocaleString("en-IN")}/yr across your core spending.`;
    } else if (cards.length === 2) {
      synergySummary = `This 2-card combination pairs ${cards[0].name} with ${cards[1].name} to achieve ₹${netValue.toLocaleString("en-IN")}/yr in net value without redundant category overlap.`;
    } else {
      synergySummary = `This 3-card portfolio forms a dedicated tier with ${cards[0].name}, ${cards[1].name}, and ${cards[2].name}, maximizing net rewards (₹${netValue.toLocaleString("en-IN")}/yr) across specialized categories.`;
    }

    // Category allocations
    if (allocations && typeof allocations === "object") {
      Object.entries(allocations).forEach(([catKey, alloc]) => {
        const spend = alloc.spend || alloc.monthlySpend || 0;
        if (spend > 0) {
          categoryAssignments.push({
            category: catKey,
            cardName: alloc.cardName,
            monthlySpend: spend,
            annualRewards: alloc.annualRewards || Math.round((alloc.monthlyEarn || 0) * 12),
            effectiveRate: alloc.rate ? (alloc.rate * 100).toFixed(1) : alloc.effectiveRate,
            reason: `Assigned to ${alloc.cardName} for higher return.`,
          });
        }
      });
    }

    // Limitations and conditions
    cards.forEach((card) => {
      const limitations = card.limitations || card.realWorldGotchas || [];
      if (limitations.length > 0) {
        limitationsToWatch.push({
          cardName: card.name,
          gotcha: limitations[0],
        });
      }
    });

    const explanation = {
      cardCount: cards.length,
      portfolioSummary: synergySummary,
      synergySummary,
      roles: cards.map((c) => ({
        cardName: c.name,
        role: c.tierLabel || "Primary Spend",
        bestCategories: c.goodFor || "Core spending",
      })),
      categoryAssignments,
      limitations: limitationsToWatch.map((l) => `${l.cardName}: ${l.gotcha}`).join("; ") || "Subject to standard merchant category exclusions.",
      limitationsToWatch,
      financialSummary: {
        annualGrossRewards: grossRewards,
        annualFees: totalFees,
        netMonetaryValue: netValue,
      },
    };

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch (err) {
    console.error("Error in /api/explain-recommendation:", err?.message || err);
    return NextResponse.json(
      {
        error: "Failed to generate explanation.",
        ...(process.env.NODE_ENV !== "production" ? { details: err?.message } : {}),
      },
      { status: 500 }
    );
  }
}
