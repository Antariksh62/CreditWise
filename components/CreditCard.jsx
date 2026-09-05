import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import CreditCardVisual from "./CreditCardVisual";
import SaveCardButton from "./SaveCardButton";

/**
 * CreditCard (tile)
 * ------------------------------------------------------------
 * The catalogue tile. Structure, top to bottom:
 *   card visual → bank + name → key figures → two actions
 *
 * The save action is a small bookmark icon in the header row,
 * NOT a third button — the two primary actions stay unambiguous.
 */

/** Each card category gets a consistent tint across the whole site. */
export const TINT_BY_CATEGORY = {
  cashback: "emerald",
  travel: "ink",
  rewards: "graphite",
  fuel: "sand",
  "lifetime-free": "emerald",
};

function formatFee(fee) {
  return fee === 0 ? "Lifetime free" : `₹${fee.toLocaleString("en-IN")}`;
}

/** Headline earn figure — cashback if the card has one, else points. */
function headlineRate(card) {
  if (card.cashbackRate > 0) return { value: `${card.cashbackRate}%`, label: "Top cashback" };
  if (card.rewardRate > 0)
    return { value: `${card.rewardRate}x`, label: "Reward points" };
  return { value: "—", label: "Earn rate" };
}

export default function CreditCard({ card, matchScore = null }) {
  const rate = headlineRate(card);

  return (
    <article className="cw-card-interactive flex flex-col overflow-hidden">
      {/* Visual band */}
      <div className="flex justify-center border-b border-border bg-subtle px-6 py-7">
        <CreditCardVisual
          tint={TINT_BY_CATEGORY[card.category] || "emerald"}
          issuer={card.bank}
          name={card.name}
          size="sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Title row + save action */}
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.8125rem] text-muted">{card.bank}</p>
            <h3 className="cw-h3 mt-0.5">
              <Link
                href={`/cards/${card.slug}`}
                className="transition-colors duration-200 hover:text-accent"
              >
                {card.name}
              </Link>
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {matchScore !== null && (
              <span className="cw-badge-accent cw-numeric">{matchScore}% match</span>
            )}
            <SaveCardButton slug={card.slug} name={card.name} />
          </div>
        </div>

        <p className="mb-5 line-clamp-2 text-[0.875rem] leading-relaxed text-muted">
          {card.description}
        </p>

        {/* Key figures — a three-cell hairline grid */}
        <dl className="mb-5 mt-auto grid grid-cols-3 gap-px overflow-hidden rounded border border-border bg-border">
          <div className="bg-surface p-3">
            <dt className="text-[0.6875rem] uppercase tracking-wider text-muted">
              {rate.label}
            </dt>
            <dd className="cw-numeric mt-0.5 text-[0.9375rem] font-semibold">
              {rate.value}
            </dd>
          </div>
          <div className="bg-surface p-3">
            <dt className="text-[0.6875rem] uppercase tracking-wider text-muted">
              Annual fee
            </dt>
            <dd className="cw-numeric mt-0.5 text-[0.9375rem] font-semibold">
              {formatFee(card.annualFee)}
            </dd>
          </div>
          <div className="bg-surface p-3">
            <dt className="text-[0.6875rem] uppercase tracking-wider text-muted">
              Lounge
            </dt>
            <dd className="cw-numeric mt-0.5 text-[0.9375rem] font-semibold">
              {card.loungeAccess > 0 ? `${card.loungeAccess}/yr` : "None"}
            </dd>
          </div>
        </dl>

        {/* Two actions only. */}
        <div className="flex gap-2">
          <Link href={`/cards/${card.slug}`} className="cw-btn-primary flex-1">
            View details
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <Link
            href={`/compare?cards=${card.slug}`}
            className="cw-btn-secondary"
            aria-label={`Compare ${card.name}`}
          >
            <Scale className="h-4 w-4" strokeWidth={1.75} />
            Compare
          </Link>
        </div>
      </div>
    </article>
  );
}
