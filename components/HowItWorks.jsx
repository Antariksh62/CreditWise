import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * Discover Section — How CardWise Works (Stripe Art Direction Pass)
 * ------------------------------------------------------------
 * Clean open 3-column editorial layout.
 * No nested card boxes, no shadows, no unnecessary badges —
 * hairline borders, large numbers, and generous whitespace carry the structure.
 */

const STEPS = [
  {
    num: "01",
    title: "Answer five spend questions",
    body: "Tell us where your money goes — online shopping, travel, dining, or fuel. No login, personal tracking, or sign-up required.",
  },
  {
    num: "02",
    title: "Rule-based matrix scoring",
    body: "Every card is evaluated across five dimensions using transparent rules. A 92% score means 92 of 100 available points earned.",
  },
  {
    num: "03",
    title: "Net reward value calculation",
    body: "We subtract the annual fee from your gross rewards so you see exact net profit in Rupees before applying.",
  },
];

export default function HowItWorks() {
  return (
    <section className="cw-rail cw-section border-b border-border/80 bg-subtle/30">
      <div className="cw-container">
        <SectionHeading
          eyebrow="02 — DISCOVER"
          title="Engineered around how you actually spend"
          description="Most credit card comparison sites promote whoever pays them the highest affiliate commission. CardWise uses open rule-based scoring."
          actionHref="/recommend"
          actionLabel="Try the recommendation quiz"
        />

        {/* Clean open hairline column grid */}
        <div className="grid gap-8 border-t border-border/80 pt-8 md:grid-cols-3 md:gap-12">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <div>
                <span className="cw-numeric text-[2.25rem] font-bold text-accent block mb-3 leading-none">
                  {step.num}
                </span>
                <h3 className="text-[1.25rem] font-bold text-foreground mb-2 tracking-[-0.015em]">
                  {step.title}
                </h3>
                <p className="text-[0.9375rem] leading-[1.65] text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


