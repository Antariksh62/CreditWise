import Link from "next/link";
import cards from "../data/cards.json";

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
    get: (c) => (c.loungeAccess > 0 ? `${c.loungeAccess} / year` : "None"),
  },
  { label: "Income required", get: (c) => c.incomeRequirement },
];

export default function ComparePreview() {
  const selected = PREVIEW_SLUGS.map((slug) => cards.find((c) => c.slug === slug)).filter(
    Boolean,
  );

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              TRANSPARENT COMPARISON
            </div>
            <h2 className="cw-h2">
              Compare fees, perks &amp; rewards{" "}
              <span className="text-neutral-400">side-by-side.</span>
            </h2>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-black hover:underline"
          >
            Compare all 10 cards →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-lift">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              Comparison of three CardWise credit cards across fees, earn rates,
              lounge access and income requirements.
            </caption>

            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500"
                >
                  Metric
                </th>
                {selected.map((card) => (
                  <th key={card.slug} scope="col" className="px-6 py-4">
                    <Link
                      href={`/cards/${card.slug}`}
                      className="block text-base font-bold text-black hover:underline"
                    >
                      {card.name}
                    </Link>
                    <span className="block text-xs font-medium text-neutral-500">
                      {card.bank}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, idx) => (
                <tr
                  key={row.label}
                  className={`border-b border-border/80 transition-colors hover:bg-neutral-50 ${
                    idx % 2 === 1 ? "bg-neutral-50/50" : "bg-white"
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-bold text-black"
                  >
                    {row.label}
                  </th>
                  {selected.map((card) => (
                    <td
                      key={card.slug}
                      className="cw-numeric px-6 py-4 text-sm font-semibold text-neutral-800"
                    >
                      {row.get(card)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


