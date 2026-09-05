import { ClipboardList, SlidersHorizontal, ListChecks } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * HowItWorks
 * ------------------------------------------------------------
 * Three numbered steps in a hairline-separated row. No cards, no
 * shadows — the numerals and the rules carry the structure, which
 * is the Stripe treatment for a process section.
 */

const STEPS = [
  {
    icon: ClipboardList,
    title: "Answer five questions",
    body: "What you care about, where you spend, how much, how you feel about annual fees, and how often you travel. Nothing personal, no sign-up required.",
  },
  {
    icon: SlidersHorizontal,
    title: "Every card gets scored",
    body: "Each answer awards points across five dimensions. The totals are normalised to a percentage, so a 78% match means the card earned 78 of the 100 available points.",
  },
  {
    icon: ListChecks,
    title: "See why, not just what",
    body: "Each result shows its per-dimension breakdown and a plain-English explanation of the rules that fired. You can disagree with the reasoning because you can read it.",
  },
];

export default function HowItWorks() {
  return (
    <section className="cw-rail cw-section border-b border-border bg-subtle">
      <div className="cw-container">
        <SectionHeading
          eyebrow="How CardWise works"
          title="A scoring system you can read line by line"
          description="No machine learning and no affiliate weighting. Just explicit rules applied consistently to every card."
        />

        <ol className="grid gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="bg-surface">
                <Reveal delay={index * 80} className="h-full">
                  <div className="flex h-full flex-col p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="cw-numeric text-[0.8125rem] font-semibold text-accent">
                        0{index + 1}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                      <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                    </div>
                    <h3 className="cw-h3 mb-2">{step.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
