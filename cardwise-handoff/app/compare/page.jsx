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
  title: "Compare credit cards",
  description:
    "Compare CardWise credit cards side by side on fees, cashback, reward rates and lounge access, then estimate annual rewards for your own spending.",
};

export default function ComparePage({ searchParams }) {
  const raw = searchParams?.cards || "";
  const initialSlugs = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mb-10 max-w-[52ch]">
          <p className="cw-eyebrow mb-3">Compare</p>
          <h1 className="cw-h2">Put the cards next to each other</h1>
          <p className="cw-body mt-3 text-lead">
            Choose up to three cards and see every field side by side. Add a spending
            profile below to turn those features into rupees.
          </p>
        </header>

        <ComparisonTable initialSlugs={initialSlugs} />

        <section className="mt-16 border-t border-border pt-14">
          <header className="mb-8 max-w-[52ch]">
            <p className="cw-eyebrow mb-3">Reward calculator</p>
            <h2 className="cw-h2">What is a card actually worth to you?</h2>
            <p className="cw-body mt-3 text-lead">
              Enter your monthly spending and CardWise estimates the annual return, net
              of the annual fee.
            </p>
          </header>

          <RewardCalculator />
        </section>
      </div>
    </div>
  );
}
