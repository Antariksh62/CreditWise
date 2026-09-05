"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import cards from "../../data/cards.json";
import { getRecommendations } from "../../lib/recommendation";
import { ANSWERS_KEY } from "../../components/RecommendationQuiz";
import CreditCardVisual from "../../components/CreditCardVisual";
import { TINT_BY_CATEGORY } from "../../components/CreditCard";
import MatchScore from "../../components/MatchScore";
import SaveCardButton from "../../components/SaveCardButton";

/**
 * /results — ranked matches
 * ------------------------------------------------------------
 * Reads the questionnaire answers back out of localStorage and
 * runs getRecommendations() against the full catalogue.
 *
 * A client component, because the answers only exist in the
 * browser. Three states are handled: loading, no answers yet, and
 * results.
 */
export default function ResultsPage() {
  const [answers, setAnswers] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ANSWERS_KEY);
      setAnswers(raw ? JSON.parse(raw) : null);
    } catch {
      setAnswers(null);
    }
    setReady(true);
  }, []);

  const results = answers ? getRecommendations(cards, answers, 3) : [];

  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[52ch]">
            <p className="cw-eyebrow mb-3">Your matches</p>
            <h1 className="cw-h2">
              {results.length > 0
                ? "Three cards ranked against your answers"
                : "Your recommendations"}
            </h1>
            <p className="cw-body mt-3 text-lead">
              Each score is the percentage of available points the card earned across
              five scoring dimensions.
            </p>
          </div>
          <Link href="/recommend" className="cw-btn-secondary">
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Retake the questionnaire
          </Link>
        </header>

        {/* ---------- Empty / loading states ---------- */}
        {!ready && <div className="cw-card px-6 py-16 text-center cw-body">Loading…</div>}

        {ready && results.length === 0 && (
          <div className="cw-card px-6 py-16 text-center">
            <h2 className="cw-h3 mb-2">No answers yet</h2>
            <p className="cw-body mx-auto mb-6 max-w-[46ch]">
              Answer the five questions and CardWise will rank the catalogue for you.
            </p>
            <Link href="/recommend" className="cw-btn-primary">
              Start the questionnaire
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        )}

        {/* ---------- Results ---------- */}
        <ol className="space-y-6">
          {results.map((result, index) => (
            <li key={result.card.slug}>
              <article className="cw-card overflow-hidden">
                <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-8">
                  {/* Visual + rank */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="cw-eyebrow">
                      {index === 0 ? "Best match" : `Match ${index + 1}`}
                    </span>
                    <CreditCardVisual
                      tint={TINT_BY_CATEGORY[result.card.category] || "emerald"}
                      issuer={result.card.bank}
                      name={result.card.name}
                      size="sm"
                    />
                  </div>

                  <div>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.875rem] text-muted">{result.card.bank}</p>
                        <h2 className="cw-h3 mt-0.5">
                          <Link
                            href={`/cards/${result.card.slug}`}
                            className="transition-colors duration-200 hover:text-accent"
                          >
                            {result.card.name}
                          </Link>
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <SaveCardButton
                          slug={result.card.slug}
                          name={result.card.name}
                        />
                        <MatchScore score={result.matchScore} />
                      </div>
                    </div>

                    {/* Plain-English explanation */}
                    <p className="mb-6 max-w-[64ch] text-[0.9375rem] leading-relaxed">
                      {result.why}
                    </p>

                    {/* Per-dimension breakdown */}
                    <dl className="mb-6 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-5">
                      {result.breakdown.map((dimension) => (
                        <div key={dimension.key} className="bg-surface p-3">
                          <dt className="text-[0.6875rem] uppercase tracking-wider text-muted">
                            {dimension.label}
                          </dt>
                          <dd className="mt-1 text-[0.875rem] font-medium">
                            {dimension.rating}
                          </dd>
                          <dd className="cw-numeric text-[0.75rem] text-muted">
                            {dimension.score}/{dimension.max} pts
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/cards/${result.card.slug}`}
                        className="cw-btn-primary"
                      >
                        View details
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <Link
                        href={`/compare?cards=${results
                          .map((r) => r.card.slug)
                          .join(",")}`}
                        className="cw-btn-secondary"
                      >
                        Compare all three
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        {results.length > 0 && (
          <p className="mt-8 text-[0.8125rem] text-muted">
            Scores come from the rules in lib/recommendation.js. Demo data — always check
            the issuer&apos;s current terms before applying.
          </p>
        )}
      </div>
    </div>
  );
}
