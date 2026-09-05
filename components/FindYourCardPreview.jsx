import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUESTIONS } from "../lib/recommendation";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * FindYourCardPreview
 * ------------------------------------------------------------
 * A static, non-interactive preview of the recommendation flow.
 * It shows the real first question with its real options (imported
 * from lib/recommendation.js, so this can never drift from the
 * actual quiz) and sends the user to /recommend to answer.
 *
 * Deliberately not interactive: two competing quizzes on one page
 * would be a worse experience than one clear entry point.
 */
export default function FindYourCardPreview() {
  const firstQuestion = QUESTIONS[0];

  return (
    <section className="cw-rail cw-section border-b border-border">
      <div className="cw-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Find your card"
            title="Five questions, then a ranked shortlist"
            description="The questionnaire takes under a minute. Your answers stay in the browser — nothing is stored on a server."
          />
          <Link href="/recommend" className="cw-btn-primary">
            Start the questionnaire
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>

          <ul className="mt-8 space-y-2 border-t border-border pt-6">
            {QUESTIONS.map((q, i) => (
              <li key={q.id} className="flex gap-3 text-[0.9375rem] text-muted">
                <span className="cw-numeric w-5 shrink-0 text-[0.8125rem] text-accent">
                  {i + 1}.
                </span>
                {q.question}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview panel — looks like the real step, but inert. */}
        <Reveal>
          <div className="cw-card p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="cw-eyebrow">Question 1 of {QUESTIONS.length}</span>
              <span className="cw-numeric text-[0.8125rem] text-muted">20%</span>
            </div>

            {/* Progress track. Inline width is a genuine computed value. */}
            <div className="mb-7 h-1 w-full overflow-hidden rounded-full bg-subtle">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${100 / QUESTIONS.length}%` }}
              />
            </div>

            <h3 className="cw-h3 mb-1">{firstQuestion.question}</h3>
            <p className="mb-5 text-[0.875rem] text-muted">{firstQuestion.help}</p>

            <div className="grid gap-2" aria-hidden="true">
              {firstQuestion.options.map((option, i) => (
                <div
                  key={option.value}
                  className={`rounded-btn border px-4 py-3 text-[0.9375rem] ${
                    i === 0
                      ? "border-accent bg-accent-soft font-medium text-accent"
                      : "border-border text-muted"
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>

            <p className="mt-5 text-[0.8125rem] text-muted">
              Preview only — answer the real questionnaire on the Find your card page.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
