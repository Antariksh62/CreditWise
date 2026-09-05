import Link from "next/link";
import CreditCardVisual from "./CreditCardVisual";
import SaveCardButton from "./SaveCardButton";

export const TINT_BY_CATEGORY = {
  cashback: "purple",
  travel: "graphite",
  rewards: "emerald",
  fuel: "sand",
  "lifetime-free": "purple",
};

function formatFee(fee) {
  return fee === 0 ? "Lifetime free" : `₹${fee.toLocaleString("en-IN")}`;
}

function headlineRate(card) {
  if (card.cashbackRate > 0) return { value: `${card.cashbackRate}%`, label: "Top cashback" };
  if (card.rewardRate > 0)
    return { value: `${card.rewardRate}x`, label: "Reward points" };
  return { value: "—", label: "Earn rate" };
}

export default function CreditCard({ card, matchScore = null }) {
  const rate = headlineRate(card);

  return (
    <article className="rounded-xl border border-neutral-200 bg-white shadow-none transition-all duration-200 hover:border-neutral-400 hover:shadow-lift flex flex-col overflow-hidden">
      {/* Visual band */}
      <div className="flex justify-center border-b border-neutral-200 bg-neutral-50 px-6 py-7">
        <CreditCardVisual
          tint={TINT_BY_CATEGORY[card.category] || "emerald"}
          issuer={card.bank}
          name={card.name}
          size="sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Title row + save action */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{card.bank}</p>
            <h3 className="text-lg font-bold text-black mt-0.5 leading-snug">
              <Link
                href={`/cards/${card.slug}`}
                className="hover:underline"
              >
                {card.name}
              </Link>
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {matchScore !== null && (
              <span className="rounded bg-[#DDF247] px-2 py-0.5 text-[11px] font-bold text-black">
                {matchScore}% match
              </span>
            )}
            <SaveCardButton slug={card.slug} name={card.name} />
          </div>
        </div>

        <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-neutral-600">
          {card.description}
        </p>

        {/* Key figures */}
        <dl className="mb-6 mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-[6px] border border-neutral-200 bg-neutral-200">
          <div className="bg-white p-3">
            <dt className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              {rate.label}
            </dt>
            <dd className="cw-numeric mt-0.5 text-xs font-bold text-black">
              {rate.value}
            </dd>
          </div>
          <div className="bg-white p-3">
            <dt className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Annual fee
            </dt>
            <dd className="cw-numeric mt-0.5 text-xs font-bold text-black">
              {formatFee(card.annualFee)}
            </dd>
          </div>
          <div className="bg-white p-3">
            <dt className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Lounge
            </dt>
            <dd className="cw-numeric mt-0.5 text-xs font-bold text-black">
              {card.loungeAccess > 0 ? `${card.loungeAccess}/yr` : "None"}
            </dd>
          </div>
        </dl>

        {/* Two actions only. */}
        <div className="flex gap-2">
          <Link
            href={`/cards/${card.slug}`}
            className="flex-1 rounded-[6px] bg-black text-white text-center text-xs font-bold py-2.5 hover:bg-neutral-800 transition-colors"
          >
            View details →
          </Link>
          <Link
            href={`/compare?cards=${card.slug}`}
            className="rounded-[6px] border border-neutral-300 bg-white text-black text-center text-xs font-semibold px-4 py-2.5 hover:bg-neutral-50 transition-colors"
            aria-label={`Compare ${card.name}`}
          >
            Compare
          </Link>
        </div>
      </div>
    </article>
  );
}

