import Link from "next/link";
import cards from "../data/cards.json";
import { calculateRewards, formatRupees } from "../lib/rewardCalculator";

const EXAMPLE_SPEND = {
  online: 12000,
  dining: 6000,
  travel: 8000,
  fuel: 4000,
  other: 10000,
};

export default function RewardCalculatorPreview() {
  const card = cards.find((c) => c.slug === "hdfc-millennia-cashback");
  const result = calculateRewards(card, EXAMPLE_SPEND);
  const maxCategory = Math.max(...result.perCategory.map((c) => c.rewards), 1);

  return (
    <section id="reward-calculator" className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            NET YIELD CALCULATOR
          </div>
          <h2 className="cw-h2">
            Know your exact return{" "}
            <span className="text-neutral-400">before you apply.</span>
          </h2>
          <p className="cw-body">
            CardWise calculates your net annual rupee returns across categories after deducting annual fee charges.
          </p>
          <div>
            <Link href="/recommend" className="inline-flex items-center gap-2 rounded-[6px] bg-[#DDF247] px-6 py-3 text-sm font-bold text-black hover:bg-[#cee723] transition-all">
              Calculate your wallet returns →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl border border-neutral-200 bg-white p-7 sm:p-8 shadow-lift">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  LIVE ESTIMATE • {card.name}
                </p>
                <p className="cw-numeric text-3xl sm:text-4xl font-bold leading-none text-black">
                  {formatRupees(result.annualRewards)}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  estimated net annual rewards on{" "}
                  <span className="font-semibold text-black">{formatRupees(result.annualSpend)}</span> yearly spend
                </p>
              </div>
              <span className="rounded bg-[#DDF247] px-2.5 py-1 text-xs font-bold text-black shrink-0">
                {result.effectiveRate}% EFFECTIVE RATE
              </span>
            </div>

            <ul className="space-y-4">
              {result.perCategory.map((row) => (
                <li key={row.key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    <span className="text-xs font-bold text-black">{row.label}</span>
                    <span className="cw-numeric text-xs font-bold text-black">
                      {formatRupees(row.rewards)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    {/* INLINE CSS (Assignment 1 requirement): computed width */}
                    <div
                      className="h-full rounded-full bg-[#DDF247] transition-all duration-500"
                      style={{ width: `${(row.rewards / maxCategory) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
              Estimates include reward points, cashback caps, and fee deduction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


