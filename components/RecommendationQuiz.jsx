"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { QUESTIONS, isComplete } from "../lib/recommendation";

/**
 * RecommendationQuiz
 * ------------------------------------------------------------
 * One question per step, with a progress rail, back/next
 * navigation, and keyboard-accessible radio options.
 *
 * On submit the answers are written to localStorage and the user
 * is pushed to /results, which reads them back and runs the
 * scoring. Keeping the answers client-side means no account is
 * needed to use the tool.
 */

export const ANSWERS_KEY = "cardwise:answers";

export default function RecommendationQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + (answers[question.id] ? 1 : 0)) / QUESTIONS.length) * 100;

  function choose(value) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    // Advance automatically on every step except the last, where
    // the user gets an explicit "See my matches" button.
    if (!isLast) {
      window.setTimeout(() => setStep((s) => s + 1), 180);
    }
  }

  function submit() {
    if (!isComplete(answers)) return;
    window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    router.push("/results");
  }

  return (
    <div className="cw-card mx-auto max-w-[640px] p-7 md:p-9">
      {/* ---------- Progress ---------- */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="cw-eyebrow">
            Question {step + 1} of {QUESTIONS.length}
          </span>
          <span className="cw-numeric text-[0.8125rem] text-muted">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-subtle"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Questionnaire progress"
        >
          {/* INLINE CSS: computed progress width. */}
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-cardwise"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ---------- Question ---------- */}
      <fieldset key={question.id} className="animate-cw-fade">
        <legend className="cw-h3 mb-1">{question.question}</legend>
        <p className="mb-6 text-[0.875rem] text-muted">{question.help}</p>

        <div className="grid gap-2">
          {question.options.map((option) => {
            const selected = answers[question.id] === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between rounded-btn border px-4 py-3 text-[0.9375rem] transition-all duration-200 ease-cardwise ${
                  selected
                    ? "border-accent bg-accent-soft font-medium text-accent"
                    : "border-border hover:border-foreground/25 hover:bg-subtle"
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={selected}
                  onChange={() => choose(option.value)}
                  className="sr-only"
                />
                {selected && <Check className="h-4 w-4" strokeWidth={2} />}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ---------- Navigation ---------- */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          className="cw-btn-ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            className="cw-btn-primary"
            onClick={submit}
            disabled={!isComplete(answers)}
          >
            See my matches
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : (
          <button
            type="button"
            className="cw-btn-secondary"
            onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}
            disabled={!answers[question.id]}
          >
            Next
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
