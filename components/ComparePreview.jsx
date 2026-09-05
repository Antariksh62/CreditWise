import Link from "next/link";
import cards from "../data/cards.json";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * ComparePreview
 * ------------------------------------------------------------
 * A real semantic HTML table — <table>, <caption>, <thead>,
 * <th scope>, <tbody> — not a grid of divs.
 *
 * Assignment 1: this is the site's table element, used for the
 * job tables actually exist for. Card names link through to their
 * dynamic detail routes.
 */

const PREVIEW_SLUGS = ["hdfc-millennia-cashback", "axis-atlas", "icici-amazon-pay"];

const ROWS = [
  {
    label: "Annual fee",
    get: (c) => (c.annualFee === 0 ? "Lifetime free" : `₹${c.annualFee.toLocaleString("en-IN")}`),
  },
  {
    label: "Top cashback",
    get: (c) => (c.cashbackRate > 0 ? `${c.cashbackRate}%` : "—"),
  },
  {
    label: "Reward points",
    get: (c) => (c.rewardRate > 0 ? `${c.rewardRate}x per ₹100` : "—"),
  },
  {
    label: "Lounge visits",
    get: (c) => (c.loungeAccess > 0 ? `${c.loungeAccess} per year` : "None"),
  },
  { label: "Income required", get: (c) => c.incomeRequirement },
];

export default function ComparePreview() {
  const selected = PREVIEW_SLUGS.map((slug) => cards.find((c) => c.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="cw-rail cw-section border-b border-border bg-subtle">
      <div className="cw-container">
        <SectionHeading
          eyebrow="Compare"
          title="The differences, side by side"
          description="Fees, earn rates and lounge access on one screen, so the trade-offs are obvious before you apply."
          actionHref="/compare"
          actionLabel="Compare any cards"
        />

        <Reveal>
          <div className="overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Comparison of three CardWise credit cards across fees, earn rates,
                lounge access and income requirements.
              </caption>

              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="cw-eyebrow px-5 py-4 font-medium"
                  >
                    Feature
                  </th>
                  {selected.map((card) => (
                    <th key={card.slug} scope="col" className="px-5 py-4">
                      <Link
                        href={`/cards/${card.slug}`}
                        className="block text-[0.9375rem] font-semibold transition-colors duration-200 hover:text-accent"
                      >
                        {card.name}
                      </Link>
                      <span className="block text-[0.8125rem] font-normal text-muted">
                        {card.bank}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="px-5 py-4 text-[0.875rem] font-medium text-muted"
                    >
                      {row.label}
                    </th>
                    {selected.map((card) => (
                      <td
                        key={card.slug}
                        className="cw-numeric px-5 py-4 text-[0.9375rem]"
                      >
                        {row.get(card)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
