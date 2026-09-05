import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Scale } from "lucide-react";
import cards from "../../../data/cards.json";
import CreditCardVisual from "../../../components/CreditCardVisual";
import { TINT_BY_CATEGORY } from "../../../components/CreditCard";
import SaveCardButton from "../../../components/SaveCardButton";

/**
 * /cards/[slug] — DYNAMIC ROUTE (Assignment 4)
 * ------------------------------------------------------------
 * One page per card, generated from the slug in the URL.
 *
 * generateStaticParams() pre-renders all ten pages at build time,
 * which is the App Router equivalent of static generation.
 * generateMetadata() gives each page its own title and description
 * for search results and link previews.
 */

export function generateStaticParams() {
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);
  if (!card) return { title: "Card not found" };

  return {
    title: `${card.name} — ${card.bank}`,
    description: card.description.slice(0, 155),
  };
}

function formatFee(fee) {
  return fee === 0 ? "Lifetime free" : `₹${fee.toLocaleString("en-IN")}`;
}

export default async function CardDetailPage({ params }) {
  const resolvedParams = await params;
  const card = cards.find((c) => c.slug === resolvedParams.slug);

  // A slug that does not exist renders the 404 page.
  if (!card) notFound();

  const related = cards
    .filter((c) => c.slug !== card.slug && c.category === card.category)
    .slice(0, 3);

  const FACTS = [
    { label: "Joining fee", value: formatFee(card.joiningFee) },
    { label: "Annual fee", value: formatFee(card.annualFee) },
    {
      label: "Cashback",
      value: card.cashbackRate > 0 ? `${card.cashbackRate}%` : "—",
    },
    {
      label: "Reward rate",
      value: card.rewardRate > 0 ? `${card.rewardRate} pts / ₹100` : "—",
    },
    {
      label: "Lounge access",
      value: card.loungeAccess > 0 ? `${card.loungeAccess} per year` : "None",
    },
    { label: "Income required", value: card.incomeRequirement },
  ];

  return (
    <div className="cw-rail">
      <div className="cw-container py-10 md:py-14">
        <Link href="/cards" className="cw-link-arrow mb-8 inline-flex text-muted">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          All cards
        </Link>

        {/* ---------------- Header ---------------- */}
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="cw-badge-accent capitalize">
                {card.category.replace("-", " ")}
              </span>
              {(card.tags || []).slice(0, 3).map((tag) => (
                <span key={tag} className="cw-badge-neutral">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[0.9375rem] text-muted">{card.bank}</p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="cw-h2 mt-1">{card.name}</h1>
              <SaveCardButton slug={card.slug} name={card.name} />
            </div>

            <p className="cw-body mt-4 max-w-[62ch] text-lead">{card.description}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/compare?cards=${card.slug}`} className="cw-btn-primary">
                <Scale className="h-4 w-4" strokeWidth={1.75} />
                Compare this card
              </Link>
              <Link href="/recommend" className="cw-btn-secondary">
                Is it right for me?
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CreditCardVisual
              tint={TINT_BY_CATEGORY[card.category] || "emerald"}
              issuer={card.bank}
              name={card.name}
              size="lg"
            />
          </div>
        </div>

        {/* ---------------- Key facts ---------------- */}
        <section className="mt-14">
          <h2 className="cw-eyebrow mb-4">At a glance</h2>
          <dl className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="bg-surface p-5">
                <dt className="text-[0.75rem] uppercase tracking-wider text-muted">
                  {fact.label}
                </dt>
                <dd className="cw-numeric mt-1 text-[1.0625rem] font-semibold">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------- Benefits + details ---------------- */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[7fr_5fr]">
          <section>
            <h2 className="cw-h3 mb-4">What you get</h2>
            <ul className="space-y-3">
              {card.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {benefit}
                </li>
              ))}
            </ul>

            <h2 className="cw-h3 mb-4 mt-10">Category benefits</h2>
            <dl className="divide-y divide-border border-y border-border">
              {[
                { label: "Fuel", value: card.fuelBenefits },
                { label: "Dining", value: card.diningBenefits },
                { label: "Online shopping", value: card.onlineShoppingBenefits },
              ].map((row) => (
                <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                  <dt className="text-[0.875rem] font-medium text-muted">{row.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside>
            <div className="cw-card p-6">
              <h2 className="cw-h3 mb-2">Eligibility</h2>
              <p className="text-[0.9375rem] leading-relaxed text-muted">
                {card.eligibility}
              </p>
              <p className="cw-numeric mt-4 border-t border-border pt-4 text-[0.9375rem]">
                Minimum income: <strong>{card.incomeRequirement}</strong>
              </p>
              <p className="mt-4 text-[0.8125rem] text-muted">
                Demo data for a student project. Confirm current terms with the issuer
                before applying.
              </p>
            </div>
          </aside>
        </div>

        {/* ---------------- Related ---------------- */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="cw-h3 mb-5">Other {card.category.replace("-", " ")} cards</h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/cards/${other.slug}`}
                    className="cw-card-interactive block p-5"
                  >
                    <span className="block text-[0.8125rem] text-muted">{other.bank}</span>
                    <span className="mt-0.5 block text-[0.9375rem] font-semibold">
                      {other.name}
                    </span>
                    <span className="cw-numeric mt-3 block text-[0.8125rem] text-muted">
                      {formatFee(other.annualFee)} per year
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
