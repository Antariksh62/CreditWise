import ComparisonTable from "../../components/ComparisonTable";
import RewardCalculator from "../../components/RewardCalculator";

/**
 * /compare — side-by-side comparison + the reward calculator
 * ------------------------------------------------------------
 * Accepts ?cards=slug-a,slug-b so card tiles and the results page
 * can deep-link a pre-filled comparison.
 *
 * The reward calculator lives on this page too, since "which of
 * these is worth more to me" is the natural next question after
 * comparing features.
 */

export const metadata = {
  title: "Compare Verified Credit Cards | CreditWise",
  description:
    "Compare verified credit cards side by side on fees, reward mechanics, airport lounge access, and major limitations without sponsored rankings.",
};

export default async function ComparePage({ searchParams }) {
  const resolvedParams = await paramsOrSearchParams(searchParams);
  const raw = resolvedParams?.cards || "";
  const initialSlugs = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-18 max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-10 max-w-2xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
            Comparison Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Compare verified credit cards
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2.5 leading-relaxed">
            Inspect fees, reward models, and limitations side by side. We explain the functional differences so you can decide which option fits your everyday spending.
          </p>
        </header>

        <ComparisonTable initialSlugs={initialSlugs} />

        {/* Reward Calculator Section */}
        <section className="mt-16 border-t border-neutral-200/80 pt-14">
          <header className="mb-8 max-w-xl">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1.5">
              Net Value Calculation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Estimate rewards for your spending
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
              Enter your estimated monthly category spending to compute approximate net returns after deducting annual fees.
            </p>
          </header>

          <RewardCalculator />
        </section>

        {/* Disclaimer Footer */}
        <footer className="mt-16 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500 leading-relaxed">
          <p className="mb-2">
            • <strong>Independent Editorial Comparison:</strong> CreditWise presents side-by-side data based exclusively on published schedules from verified bank sources. We do not accept fees for placement or declare arbitrary winners.
          </p>
          <p>
            • <strong>Underwriting Authority:</strong> Issuing banks retain sole discretion over card approval, credit limit assignment, interest rates (APR), and reward terms. Always verify the current canonical schedule on the official bank website before applying.
          </p>
        </footer>
      </div>
    </div>
  );
}

async function paramsOrSearchParams(sp) {
  if (!sp) return {};
  if (typeof sp.then === "function") return await sp;
  return sp;
}
