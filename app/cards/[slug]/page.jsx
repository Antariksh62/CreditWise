import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Scale,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";
import cards from "../../../data/cards.json";
import CreditCardVisual from "../../../components/CreditCardVisual";
import { TINT_BY_CATEGORY } from "../../../components/CreditCard";
import SaveCardButton from "../../../components/SaveCardButton";
import CardTechnicalDetails from "../../../components/CardTechnicalDetails";

export function generateStaticParams() {
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);
  if (!card) return { title: "Card not found" };

  return {
    title: `${card.name} — Review & Benefits | CreditWise`,
    description: card.goodFor
      ? `Good for ${card.goodFor}. ${card.shortDescription || card.description}`
      : card.shortDescription || card.description,
  };
}

function formatFee(fee) {
  if (fee === 0) return "Lifetime Free";
  return `₹${fee.toLocaleString("en-IN")}`;
}

export default async function CardDetailPage({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);

  if (!card) notFound();

  const related = cards
    .filter((c) => c.slug !== card.slug && c.category === card.category)
    .slice(0, 3);

  // Derive "Good For" categories based on verified card strengths
  const goodForCategories = [];
  if (card.goodFor) {
    goodForCategories.push(card.goodFor);
  }
  if (card.category === "dining" || card.diningBenefits?.includes("10%")) {
    goodForCategories.push("Dining & Food Delivery");
  }
  if (card.category === "travel" || card.loungeAccess >= 8 || card.forexBenefits?.includes("0%")) {
    goodForCategories.push("Travel & Airport Lounges");
  }
  if (card.category === "fuel" || card.slug.includes("octane") || card.slug.includes("power-plus")) {
    goodForCategories.push("Fuel & Commuting");
  }
  if (card.cashbackRate > 0) {
    goodForCategories.push("Simple Cashback");
  }
  if (card.annualFee === 0) {
    goodForCategories.push("Zero Fee Holding");
  }
  if (card.rewardRate >= 4 || card.slug.includes("amex") || card.slug.includes("horizon")) {
    goodForCategories.push("Reward Optimization");
  }
  const uniqueGoodFor = Array.from(new Set(goodForCategories)).slice(0, 4);

  // Key benefit highlights for above the fold (concise 3 bullets)
  const keyBenefits = (card.benefits || []).slice(0, 3);

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-10 md:py-14 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/cards"
          className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to all cards
        </Link>

        {/* ==================================================
            ABOVE THE FOLD
        ================================================== */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 items-center">
            {/* Left Column: Metadata, Title, Description, Benefit Summary & CTAs */}
            <div>
              {/* Issuer & Network Pills */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase bg-[#DDF247] text-black px-2.5 py-0.5 rounded-full">
                  {card.issuer || card.bank}
                </span>
                <span className="text-[11px] font-semibold tracking-wide uppercase bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">
                  {card.network}
                </span>
                {card.annualFee === 0 && (
                  <span className="text-[11px] font-semibold tracking-wide uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Lifetime Free
                  </span>
                )}
              </div>

              {/* Card Name + Save Bookmark */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black leading-tight">
                  {card.name}
                </h1>
                <SaveCardButton slug={card.slug} name={card.name} />
              </div>

              {/* One-line "Good for" Description */}
              {card.goodFor && (
                <p className="mt-2 text-sm font-semibold text-neutral-800">
                  Good for: {card.goodFor}
                </p>
              )}

              {/* Annual Fee Display */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-black cw-numeric">
                  {formatFee(card.annualFee)}
                </span>
                {card.annualFee > 0 ? (
                  <span className="text-xs text-neutral-500">
                    annual fee {card.feeWaiver ? `(Waived on ${card.feeWaiver})` : ""}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700 font-semibold">
                    No annual or renewal fees
                  </span>
                )}
              </div>

              {/* Simple Benefit Summary (Above the fold) */}
              <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
                {keyBenefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 font-medium">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {card.officialUrl ? (
                  <a
                    href={card.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
                  >
                    View on issuer website
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  </a>
                ) : null}

                <Link
                  href={`/compare?cards=${card.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  <Scale className="h-3.5 w-3.5 text-neutral-500" strokeWidth={2} />
                  Compare
                </Link>
              </div>
            </div>

            {/* Right Column: Card Visual */}
            <div className="flex justify-center items-center py-4">
              <CreditCardVisual
                tint={TINT_BY_CATEGORY[card.category] || "emerald"}
                issuer={card.issuer || card.bank}
                name={card.name}
                image={card.image}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            GOOD FOR SECTION
        ================================================== */}
        <section className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Target Alignment
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-black mb-4">
            GOOD FOR
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {uniqueGoodFor.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200/60 px-3.5 py-1.5 text-xs font-bold text-neutral-800"
              >
                <Sparkles className="h-3 w-3 text-black" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ==================================================
            WHY CREDITWISE MAY RECOMMEND IT
        ================================================== */}
        <section className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Objective Rationale
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-black mb-3">
            WHY CREDITWISE MAY RECOMMEND IT
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-neutral-700 font-medium max-w-3xl">
            {card.whyCreditWiseRecommends ||
              card.whoItFits ||
              `Useful if you already spend regularly on ${card.goodFor || "daily categories"} and want a competitive reward structure without altering your habits.`}
          </p>
          {card.whoItFits && card.whyCreditWiseRecommends && (
            <p className="mt-3 text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-3xl">
              <strong>Best suited for: </strong>{card.whoItFits}
            </p>
          )}
        </section>

        {/* ==================================================
            WATCH FOR
        ================================================== */}
        <section className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            WATCH FOR
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-amber-950 mb-3">
            Important Limitations & Conditions
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed max-w-3xl">
            <p>
              • {card.whatToWatchOutFor || "Standard category limits and exclusions apply on non-qualifying transactions."}
            </p>
            {card.rewardCaps && (
              <p>
                • <strong>Reward Cap: </strong>{card.rewardCaps}
              </p>
            )}
            {card.exclusions && (
              <p>
                • <strong>Excluded Categories: </strong>{card.exclusions}
              </p>
            )}
            {card.annualFee > 0 && card.feeWaiver && (
              <p>
                • <strong>Renewal Fee: </strong>{formatFee(card.annualFee)} / year (Waived upon reaching {card.feeWaiver} annual spend).
              </p>
            )}
          </div>
        </section>

        {/* ==================================================
            TECHNICAL DETAILS (COLLAPSIBLE ACCORDION)
        ================================================== */}
        <CardTechnicalDetails card={card} />

        {/* ==================================================
            PRIMARY CANONICAL ISSUER CTA BAR
        ================================================== */}
        {card.officialUrl && (
          <div className="mt-10 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-center shadow-sm">
            <h3 className="text-base sm:text-lg font-extrabold text-black mb-1.5">
              Ready to verify current terms on the official bank site?
            </h3>
            <p className="text-xs text-neutral-500 mb-5 max-w-md mx-auto">
              CreditWise provides direct canonical links to official card issuer pages. We never redirect through affiliate networks.
            </p>
            <a
              href={card.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-7 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
            >
              View on issuer website
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        )}

        {/* ==================================================
            DISCLAIMER
        ================================================== */}
        <footer className="mt-12 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500 leading-relaxed">
          <div className="flex items-center gap-2 text-neutral-800 font-bold uppercase tracking-wider text-[11px] mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            CreditWise Independent Disclosure & Disclaimer
          </div>
          <p className="mb-2">
            • <strong>Terms are subject to change:</strong> Card fees, reward structures, spend-based lounge criteria, and benefits can be updated by issuing banks at any time.
          </p>
          <p className="mb-2">
            • <strong>Issuer determines approval:</strong> The issuing bank retains sole discretion over credit card approvals, credit limits, interest rates (APR), and verification requirements.
          </p>
          <p>
            • <strong>Informational matching only:</strong> CreditWise provides independent comparison and matching based on verified public bank terms. CreditWise does not guarantee approval, savings, or rewards.
          </p>
        </footer>

        {/* Related Cards */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-neutral-200/80 pt-10">
            <h2 className="text-lg font-bold text-black mb-6">
              Other {card.category ? card.category.replace("-", " ") : "recommended"} cards
            </h2>
            <ul className="grid gap-5 sm:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/cards/${other.slug}`}
                    className="group block rounded-xl border border-neutral-200/80 bg-white p-5 transition-all hover:border-neutral-400 hover:shadow-sm"
                  >
                    <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      {other.issuer || other.bank}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-black group-hover:underline">
                      {other.name}
                    </span>
                    {other.goodFor && (
                      <span className="mt-2 block text-xs text-neutral-500 line-clamp-1">
                        Good for: {other.goodFor}
                      </span>
                    )}
                    <span className="mt-3 block text-xs font-bold text-neutral-800 cw-numeric">
                      {formatFee(other.annualFee)} / year
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
