import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { QUESTIONS } from "../lib/recommendation";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * FindYourCardPreview — Stripe Art Direction Pass
 * ------------------------------------------------------------
 * Asymmetric editorial composition:
 * - Left: "03 — FIND YOUR MATCH" title, short explanation, CTA link
 * - Right: Single clean, embedded questionnaire UI mockup
 */
export default function FindYourCardPreview() {
  const firstQuestion = QUESTIONS[0];

  return (
    <section className="cw-rail cw-section border-b border-border/80 bg-background">
      <div className="cw-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="03 — FIND YOUR MATCH"
            title="Five questions, then a ranked shortlist"
            description="The questionnaire takes under a minute. Your answers stay in your browser — nothing is sent to a tracking server."
          />

          <div className="mb-8">
            <Link href="/recommend" className="cw-btn-primary group">
              Start the questionnaire
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </div>

          <ul className="space-y-3 border-t border-border/80 pt-6">
            {QUESTIONS.map((q, i) => (
              <li key={q.id} className="flex items-center gap-3 text-[0.9375rem] text-muted font-medium">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.75rem] font-bold text-accent">
                  {i + 1}
                </span>
                {q.question}
              </li>
            ))}
          </ul>
        </div>

        {/* Clean, open Product UI Demonstration Panel */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-7 sm:p-8 shadow-[0_16px_36px_-8px_rgba(10,37,64,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[0.75rem] font-bold uppercase tracking-wider text-accent">
                Question 1 of {QUESTIONS.length}
              </span>
              <span className="cw-numeric text-[0.8125rem] text-muted font-semibold">
                Step 1
              </span>
            </div>

            {/* Progress track */}
            <div className="mb-7 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${100 / QUESTIONS.length}%` }}
              />
            </div>

            <h3 className="text-[1.25rem] font-bold text-foreground mb-1">{firstQuestion.question}</h3>
            <p className="mb-6 text-[0.875rem] text-muted">{firstQuestion.help}</p>

            <div className="grid gap-2" aria-hidden="true">
              {firstQuestion.options.map((option, i) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-[0.9375rem] transition-all ${
                    i === 0
                      ? "border-accent/40 bg-accent-soft/70 font-semibold text-foreground"
                      : "border-border text-muted bg-surface"
                  }`}
                >
                  <span>{option.label}</span>
                  {i === 0 && <Check className="h-4 w-4 text-accent shrink-0" strokeWidth={2.5} />}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border/80 pt-4 flex items-center justify-between text-[0.8125rem] text-muted">
              <span>Interactive UI demo</span>
              <Link href="/recommend" className="font-semibold text-accent hover:underline">
                Answer live →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


