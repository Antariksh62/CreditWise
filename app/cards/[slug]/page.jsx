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
  const total = Math.round(fee * 1.18);
  return `₹${total.toLocaleString("en-IN")} (₹${fee.toLocaleString("en-IN")} + 18% GST)`;
}

export default async function CardDetailPage({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);

  if (!card) notFound();

  const related = cards
    .filter((c) => c.slug !== card.slug && c.category === card.category)
    .slice(0, 3);

  // Key benefit highlights for above the fold (concise 3 verified bullets)
  const keyBenefits = (card.benefits || []).slice(0, 3);

  // Why it fits you items
  const whyItFitsItems = [];
  if (card.whyCreditWiseRecommends) {
    whyItFitsItems.push(card.whyCreditWiseRecommends);
  }
  if (card.whoItFits) {
    whyItFitsItems.push(`Suits everyday spenders: ${card.whoItFits}`);
  }
  if (card.annualFee === 0) {
    whyItFitsItems.push("Lifetime free — zero annual holding cost and no renewal spend targets required to keep the card active.");
  } else if (card.feeWaiver) {
    whyItFitsItems.push(`The annual fee of ${formatFee(card.annualFee)} is easily waived on normal spending: ${card.feeWaiver}`);
  }
  if (whyItFitsItems.length < 2) {
    whyItFitsItems.push("Rewards your natural recurring monthly expenses without requiring lifestyle changes or induced spending.");
  }

  // What to watch for items
  const watchForItems = [];
  if (card.whatToWatchOutFor) {
    if (Array.isArray(card.whatToWatchOutFor)) {
      watchForItems.push(...card.whatToWatchOutFor);
    } else {
      watchForItems.push(card.whatToWatchOutFor);
    }
  }
  if (card.rewardCaps && !card.rewardCaps.toLowerCase().includes("no maximum cap")) {
    watchForItems.push(`Monthly reward limits: ${card.rewardCaps}`);
  }
  if (card.exclusions) {
    watchForItems.push(`Common exclusions: ${card.exclusions}`);
  }
  if (card.annualFee > 0 && card.feeWaiver) {
    watchForItems.push(`Renewal condition: ${formatFee(card.annualFee)} annual fee applies unless you reach ${card.feeWaiver}`);
  }
  if (card.incomeRequirement) {
    watchForItems.push(`Eligibility baseline: Minimum income of ${card.incomeRequirement} required for bank underwriting.`);
  }

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/cards"
          className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to all cards
        </Link>

        {/* ==================================================
            ABOVE THE FOLD: Visual Focus & Immediate Clarity
        ================================================== */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-10 shadow-xs">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* Left Column: Card Name, Issuer, Good for, Annual fee, Key benefits */}
            <div>
              {/* Issuer & Category Eyebrow */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {card.issuer || card.bank} {card.network ? `· ${card.network}` : ""}
                </span>
                <SaveCardButton slug={card.slug} name={card.name} />
              </div>

              {/* Card Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                {card.name}
              </h1>

              {/* Short "Good for" Statement */}
              {card.goodFor && (
                <p className="mt-2 text-sm font-medium text-neutral-700">
                  Good for: {card.goodFor}
                </p>
              )}

              {/* Annual Fee Display with 18% GST Breakdown */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                {card.annualFee === 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-neutral-900">
                      Lifetime Free
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">
                      ₹0 annual fee
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-neutral-900">
                        ₹{Math.round(card.annualFee * 1.18).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        total customer cost / year
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 font-mono">
                      ₹{card.annualFee.toLocaleString("en-IN")} base fee + ₹{Math.round(card.annualFee * 0.18).toLocaleString("en-IN")} (18% GST)
                    </p>
                  </div>
                )}
                {card.feeWaiver && card.annualFee > 0 && (
                  <p className="text-xs text-neutral-500 mt-1.5">
                    <strong>Waiver:</strong> {card.feeWaiver}
                  </p>
                )}
              </div>

              {/* Key Benefits (Concise 2–3 bullets) */}
              <div className="mt-5 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Key benefits
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700">
                  {keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed font-medium">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions: View official issuer website & Compare */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                {card.officialUrl ? (
                  <a
                    href={card.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-neutral-800 shadow-xs"
                  >
                    View official issuer website
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  </a>
                ) : null}

                <Link
                  href={`/compare?cards=${card.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 transition-colors hover:border-black hover:text-black"
                >
                  <Scale className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  Compare
                </Link>
              </div>
            </div>

            {/* Right Column: Real Card Image as Visual Focus */}
            <div className="flex justify-center items-center py-2">
              <CreditCardVisual
                issuer={card.issuer || card.bank}
                name={card.name}
                image={card.image}
                orientation={card.orientation || "horizontal"}
                size="lg"
                priority={true}
                className="w-full max-w-[360px]"
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            WHY IT FITS YOU
        ================================================== */}
        <section className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
            Suitability Rationale
          </span>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-3">
            WHY IT FITS YOU
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
            {whyItFitsItems.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed font-medium">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ==================================================
            WHAT TO WATCH FOR
        ================================================== */}
        <section className="mt-8 rounded-2xl border border-amber-200/60 bg-amber-50/30 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-900">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
            <span>Limitations & Caveats</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-amber-950 mb-3">
            WHAT TO WATCH FOR
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-700 font-medium">
            {watchForItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ==================================================
            KEY DETAILS (Progressive Disclosure)
        ================================================== */}
        <CardTechnicalDetails card={card} />

        {/* ==================================================
            OFFICIAL SOURCE LINK BAR
        ================================================== */}
        {card.officialUrl && (
          <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <p className="text-xs font-bold text-neutral-900">
                Verified Official Source
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Data verified from {card.officialSource || card.issuer} as of {card.lastVerified || "September 2026"}. Zero affiliate links.
              </p>
            </div>
            <a
              href={card.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 shrink-0"
            >
              View official issuer website
              <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
            </a>
          </div>
        )}

        {/* ==================================================
            DISCLAIMER
        ================================================== */}
        <footer className="mt-10 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500 leading-relaxed">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold uppercase tracking-wider text-[11px] mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            CreditWise Independent Disclosure & Disclaimer
          </div>
          <p className="mb-2">
            • <strong>Terms are subject to change:</strong> Card fees, reward structures, spend-based lounge criteria, and benefits can be updated by issuing banks at any time. Always review the canonical schedule on the official issuer website.
          </p>
          <p className="mb-2">
            • <strong>Issuer determines final approval:</strong> The issuing bank retains sole discretion over credit card approvals, credit limits, interest rates (APR), and verification criteria. CreditWise does not guarantee approval.
          </p>
          <p>
            • <strong>Informational matching only:</strong> CreditWise provides independent comparison based on verified public bank terms. We do not operate an affiliate application funnel or earn commissions for pushed cards.
          </p>
        </footer>

        {/* Related Cards */}
        {related.length > 0 && (
          <section className="mt-12 border-t border-neutral-200/80 pt-10">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-5">
              Other {card.category ? card.category.replace("-", " ") : "recommended"} cards
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/cards/${other.slug}`}
                    className="group block rounded-xl border border-neutral-200/80 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-xs"
                  >
                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {other.issuer || other.bank}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-neutral-900 group-hover:underline">
                      {other.name}
                    </span>
                    {other.goodFor && (
                      <span className="mt-2 block text-xs text-neutral-500 line-clamp-1">
                        Good for: {other.goodFor}
                      </span>
                    )}
                    <span className="mt-3 block text-xs font-semibold text-neutral-900">
                      {formatFee(other.annualFee)}
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
