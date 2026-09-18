"use client";

import Link from "next/link";
import cards from "../data/cards.json";

// Select 4 primary dataset cards covering different categories (Cashback, Travel, Premium, Lifetime Free)
const PREVIEW_SLUGS = [
  "hdfc-millennia-cashback",
  "sbi-cashback",
  "axis-atlas",
  "icici-amazon-pay",
];

const COMPARISON_ROWS = [
  {
    label: "Annual Fee",
    get: (c) => (c.annualFee === 0 ? "Lifetime Free (₹0)" : `₹${c.annualFee.toLocaleString("en-IN")} / year`),
  },
  {
    label: "Top Cashback & Earn Rate",
    get: (c) => (c.cashbackRate > 0 ? `${c.cashbackRate}% Cashback` : `${c.rewardRate} Reward Points / ₹100`),
  },
  {
    label: "Airport Lounge Access",
    get: (c) => (c.loungeAccess > 0 ? `${c.loungeAccess} visits / year` : "None included"),
  },
  {
    label: "Eligibility & Income Criteria",
    get: (c) => c.incomeRequirement,
  },
  {
    label: "Key Relevant Benefit",
    get: (c) => c.benefits[0] || c.onlineShoppingBenefits,
  },
];

export default function ComparePreview() {
  const selectedCards = PREVIEW_SLUGS.map((slug) => cards.find((c) => c.slug === slug)).filter(Boolean);

  return (
    <section className="py-24 lg:py-32 bg-white border-t border-neutral-200">
      <div className="cw-container space-y-12">
        
        {/* EDITORIAL HEADER STATEMENT */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-black" />
              1. CARD COMPARISON PROOF
            </div>
            <h2 className="cw-h2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black leading-[1.08]">
              Compare fees, perks &amp; rewards{" "}
              <span className="text-neutral-400">side-by-side.</span>
            </h2>
            <p className="text-sm text-neutral-600 font-normal">
              Evaluated directly against actual issuer data, fee waiver tiers, and income requirements.
            </p>
          </div>

          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-[6px] bg-black text-[#DDF247] px-6 py-3 text-xs font-mono font-bold hover:bg-neutral-800 transition-all shrink-0"
          >
            Compare all 10 cards →
          </Link>
        </div>

        {/* EDITORIAL SEMANTIC HTML TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-lift">
          <table className="w-full min-w-[768px] border-collapse text-left">
            <caption className="sr-only">
              CardWise side-by-side comparison matrix showing annual fees, cashback rates, lounge access, income requirements, and key benefits.
            </caption>

            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th
                  scope="col"
                  className="px-6 py-5 font-mono font-bold text-xs uppercase tracking-wider text-neutral-400 w-1/5"
                >
                  COMPARISON METRIC
                </th>
                {selectedCards.map((card) => (
                  <th key={card.slug} scope="col" className="px-6 py-5 w-1/5">
                    <Link
                      href={`/cards/${card.slug}`}
                      className="block text-base font-bold text-black hover:text-[#000000] hover:underline tracking-tight"
                    >
                      {card.name}
                    </Link>
                    <span className="block text-xs font-mono text-neutral-500 mt-0.5">
                      {card.bank}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={row.label}
                  className={`transition-colors hover:bg-neutral-50/80 ${
                    idx % 2 === 1 ? "bg-neutral-50/30" : "bg-white"
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-5 text-xs font-mono font-bold text-black uppercase tracking-wider"
                  >
                    {row.label}
                  </th>
                  {selectedCards.map((card) => (
                    <td
                      key={card.slug}
                      className="px-6 py-5 text-xs font-medium text-neutral-800 leading-relaxed"
                    >
                      {row.get(card)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-neutral-400 pt-2">
          <span>* All values extracted from verified issuer documentation</span>
          <span>Updated September 2026</span>
        </div>

      </div>
    </section>
  );
}
