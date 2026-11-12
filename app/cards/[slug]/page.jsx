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
import SaveCardButton from "../../../components/SaveCardButton";
import CardTechnicalDetails from "../../../components/CardTechnicalDetails";
import CardInteractiveInsights from "../../../components/CardInteractiveInsights";

export function generateStaticParams() {
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);
  if (!card) return { title: "Card not found" };

  const title = `${card.name} — Verified Rewards, Fees & Gotchas | CreditWise`;
  const description =
    card.shortDescription ||
    card.description ||
    `Independent reward calculations and analysis for ${card.name}.`;
  const feeLabel =
    (card.annualFee ?? 0) === 0
      ? "Lifetime Free"
      : `₹${Math.round((card.annualFee || 0) * 1.18).toLocaleString("en-IN")}/yr total`;

  return {
    title,
    description,
    openGraph: {
      title,
      description: `${description} | Annual Fee: ${feeLabel}. Verified independent terms.`,
      url: `/cards/${card.slug}`,
      siteName: "CreditWise",
      images: [
        {
          url: card.image,
          width: 1200,
          height: 630,
          alt: `${card.issuer || card.bank} ${card.name} Credit Card`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${description} | Fee: ${feeLabel}.`,
      images: [card.image],
    },
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

  // Fee calculation numbers
  const baseFee = card.annualFee ?? 0;
  const joiningFee = card.joiningFee ?? card.annualFee ?? 0;
  const totalAnnualCost = Math.round(baseFee * 1.18);

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/cards"
          prefetch={true}
          className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to all cards
        </Link>

        {/* ==================================================
            SECTION A — TOP PRODUCT INTRODUCTION
            (Instant Clarity, Editorial Layout & Primary Apply CTA)
        ================================================== */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-8 md:p-10 shadow-xs">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center min-w-0">
            {/* Left Column: Card Name, Issuer, Good for, Annual fee, Key benefits */}
            <div className="min-w-0">
              {/* Issuer & Category Eyebrow */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {card.issuer || card.bank} {card.network ? `· ${card.network}` : ""}
                </span>
                <SaveCardButton slug={card.slug} name={card.name} />
              </div>

              {/* Full Card Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                {card.name}
              </h1>

              {/* Short, Human-Readable Value Proposition */}
              <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {card.shortDescription || card.description}
              </p>

              {/* Annual Fee Block */}
              <div className="mt-5 pt-4 border-t border-neutral-100">
                {baseFee === 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-neutral-900 font-mono">
                      Lifetime Free
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold">
                      ₹0 annual fee
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-extrabold text-neutral-900 font-mono">
                        ₹{totalAnnualCost.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        total customer cost / year
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                      ₹{baseFee.toLocaleString("en-IN")} base fee + ₹{Math.round(baseFee * 0.18).toLocaleString("en-IN")} (18% GST)
                    </p>
                  </div>
                )}

                {joiningFee > 0 && joiningFee !== baseFee && (
                  <p className="text-[11px] text-neutral-400 mt-1">
                    First-year joining fee: ₹{Math.round(joiningFee * 1.18).toLocaleString("en-IN")} (incl. GST)
                  </p>
                )}

                {card.feeWaiver && baseFee > 0 && (
                  <p className="text-xs text-neutral-600 mt-1.5 leading-snug">
                    <strong className="text-neutral-900">How to avoid the annual fee: </strong>
                    {card.feeWaiver}
                  </p>
                )}
              </div>

              {/* 2–3 Genuinely Important Benefits */}
              <div className="mt-5 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Key Highlights
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed font-medium">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions: Primary Apply CTA & Compare */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                {card.officialUrl ? (
                  <a
                    href={card.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
                  >
                    Apply for this card
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  </a>
                ) : (
                  <span className="text-xs text-neutral-400 font-medium">
                    Application link currently unavailable from issuer
                  </span>
                )}

                <Link
                  href={`/compare?cards=${card.slug}`}
                  prefetch={true}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-700 transition-colors hover:border-black hover:text-black"
                >
                  <Scale className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  Compare with other cards
                </Link>
              </div>
            </div>

            {/* Right Column: Real Card Image as Visual Focus */}
            <div className="flex justify-center items-center py-2 w-full min-w-0">
              <CreditCardVisual
                issuer={card.issuer || card.bank}
                name={card.name}
                image={card.image}
                orientation={card.orientation || "horizontal"}
                size="lg"
                priority={true}
                className="w-full max-w-[320px] sm:max-w-[360px]"
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            INTERACTIVE CARD INSIGHTS & REDEMPTION DISCOVERY
            (Explore This Card: Value Calculator, Overlooked Nuances, Gotchas)
        ================================================== */}
        <CardInteractiveInsights card={card} />

        {/* ==================================================
            SECTION B — DETAILED CARD INFORMATION
            (Progressive Disclosure: Sections 01 to 06)
        ================================================== */}
        <CardTechnicalDetails card={card} />

        {/* ==================================================
            SECTION C — BOTTOM APPLICATION OPPORTUNITY & SUMMARY
        ================================================== */}
        <div className="mt-10 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-9 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Final Assessment & Application
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                Ready to add {card.name} to your wallet?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                {card.goodFor ? `Best suited for ${card.goodFor}. ` : ""}
                Annual fee of {baseFee === 0 ? "₹0 (Lifetime Free)" : `₹${totalAnnualCost.toLocaleString("en-IN")}/yr (incl. 18% GST)`}
                {card.feeWaiver ? ` — easily waived if you meet the issuer's spend condition.` : "."}
              </p>
              {card.incomeRequirement && (
                <p className="text-[11px] text-neutral-400 mt-1">
                  Eligibility requirement: {card.incomeRequirement}. Final approval is determined solely by {card.issuer || card.bank}.
                </p>
              )}
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {card.officialUrl ? (
                <a
                  href={card.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-7 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
                >
                  Apply for this card
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                </a>
              ) : null}

              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-3.5 text-xs sm:text-sm font-semibold text-neutral-700 transition-colors hover:border-black hover:text-black"
              >
                Check portfolio fit
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            DISCLAIMER & SOURCE DISCLOSURE
        ================================================== */}
        <footer className="mt-12 border-t border-neutral-200/80 pt-8 text-xs text-neutral-500 leading-relaxed">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold uppercase tracking-wider text-[11px] mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            CreditWise Independent Disclosure & Verified Sources
          </div>
          <p className="mb-2">
            • <strong>Terms are subject to change:</strong> Card fees, reward structures, spend-based lounge criteria, and benefits are verified from {card.officialSource || card.issuer} as of {card.lastVerified || "September 2026"}. Issuing banks may revise terms without prior notice.
          </p>
          <p className="mb-2">
            • <strong>Issuer determines final approval:</strong> The issuing bank retains sole authority over credit card approvals, credit limits, interest rates (APR), and verification checks. CreditWise provides independent analysis and does not guarantee approval.
          </p>
          <p>
            • <strong>Zero affiliate bias:</strong> CreditWise does not operate paid affiliate funnels or push cards for referral commissions. Recommendations are calculated strictly from verified reward terms.
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
                    prefetch={true}
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
