"use client";

const REAL_DATASET_ISSUERS = [
  { id: "hdfc", name: "HDFC Bank", category: "Cashback & Premium", cardCount: "8 Cards" },
  { id: "sbi", name: "SBI Card", category: "Cashback & Utilities", cardCount: "4 Cards" },
  { id: "axis", name: "Axis Bank", category: "Travel & Rewards", cardCount: "4 Cards" },
  { id: "icici", name: "ICICI Bank", category: "E-Commerce & UPI", cardCount: "3 Cards" },
  { id: "amex", name: "American Express", category: "Membership Rewards", cardCount: "2 Cards" },
  { id: "idfc", name: "IDFC FIRST Bank", category: "Lifetime Free & Perks", cardCount: "2 Cards" },
  { id: "hsbc", name: "HSBC", category: "Dining & International", cardCount: "4 Cards" },
  { id: "sc", name: "Standard Chartered", category: "Rewards & Lounge", cardCount: "1 Card" },
  { id: "bob", name: "Bank of Baroda", category: "Aviation & Rewards", cardCount: "2 Cards" },
  { id: "indusind", name: "IndusInd Bank", category: "Dining & Zero Forex", cardCount: "2 Cards" },
];

export default function IssuerNetwork() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container space-y-12">
        {/* EDITORIAL SECTION HEADLINE */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            ISSUER & CURATION COVERAGE
          </div>
          <h2 className="cw-h2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.08]">
            Your spending is personal.<br />
            <span className="text-neutral-400">Your card should be too.</span>
          </h2>
          <p className="cw-body text-sm sm:text-base text-neutral-600 font-normal max-w-xl">
            We compare cards based on how they fit the way you already spend.
          </p>
        </div>

        {/* MONOCHROME ISSUER GRID WITH FINE HAIRLINE BORDERS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l border-neutral-200">
          {REAL_DATASET_ISSUERS.map((issuer) => (
            <div
              key={issuer.id}
              className="group relative border-r border-b border-neutral-200 p-6 sm:p-8 bg-white hover:bg-neutral-900 transition-colors duration-200 flex flex-col justify-between min-h-[140px]"
            >
              <div className="text-xs font-mono font-bold text-neutral-400 group-hover:text-neutral-400 transition-colors">
                {issuer.cardCount}
              </div>
              <div className="space-y-1 mt-4">
                <div className="text-base sm:text-lg font-bold text-black group-hover:text-[#DDF247] transition-colors tracking-tight">
                  {issuer.name}
                </div>
                <div className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors truncate">
                  {issuer.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3-PART CURATION PRINCIPLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-neutral-400">
              01 / BROAD COVERAGE
            </div>
            <h3 className="text-base font-bold text-black">Comprehensive Issuer Dataset</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Evaluating credit cards across India&apos;s primary banking institutions without excluding niche reward programs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-neutral-400">
              02 / CAREFUL EVALUATION
            </div>
            <h3 className="text-base font-bold text-black">Net Value Mathematics</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We calculate net returns after annual fees, spending threshold waivers, and category capping.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-neutral-400">
              03 / CLARITY OVER NOISE
            </div>
            <h3 className="text-base font-bold text-black">User-First Recommendations</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clean recommendations tailored to your existing monthly budget without marketplace clutter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

