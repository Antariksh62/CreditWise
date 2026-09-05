import Link from "next/link";
import { ArrowUpRight, BadgeIndianRupee, Plane, Sparkles, Fuel, Wallet } from "lucide-react";
import cards from "../data/cards.json";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * ExploreCategories
 * ------------------------------------------------------------
 * "Explore by what matters" — five tiles that link straight into
 * the filtered catalogue via a query string (/cards?category=travel).
 * The count on each tile is derived from the real data, so it can
 * never disagree with what the filtered page shows.
 */

const CATEGORIES = [
  {
    key: "cashback",
    label: "Cashback",
    icon: BadgeIndianRupee,
    blurb: "Money back on every statement, with nothing to redeem.",
  },
  {
    key: "travel",
    label: "Travel",
    icon: Plane,
    blurb: "Miles, lounge access and better rates on bookings.",
  },
  {
    key: "rewards",
    label: "Rewards",
    icon: Sparkles,
    blurb: "Flexible points you convert on your own terms.",
  },
  {
    key: "fuel",
    label: "Fuel",
    icon: Fuel,
    blurb: "Surcharge waivers and accelerated earning at the pump.",
  },
  {
    key: "lifetime-free",
    label: "Lifetime free",
    icon: Wallet,
    blurb: "No annual fee, ever — a sensible first card.",
  },
];

export default function ExploreCategories() {
  return (
    <section className="cw-rail cw-section border-b border-border bg-subtle">
      <div className="cw-container">
        <SectionHeading
          eyebrow="Explore"
          title="Start from what matters to you"
          description="Jump straight into a filtered view of the catalogue."
        />

        <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const count = cards.filter(
              (card) =>
                card.category === category.key ||
                (card.tags || []).includes(category.key),
            ).length;

            return (
              <Reveal key={category.key} delay={index * 50} className="bg-surface">
                <Link
                  href={`/cards?category=${category.key}`}
                  className="group flex h-full flex-col p-7 transition-colors duration-200 hover:bg-subtle"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                    <ArrowUpRight
                      className="h-4 w-4 text-muted transition-transform duration-200 ease-cardwise group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="cw-h3 mb-1.5">{category.label}</h3>
                  <p className="mb-5 text-[0.9375rem] leading-relaxed text-muted">
                    {category.blurb}
                  </p>
                  <span className="cw-numeric mt-auto text-[0.8125rem] text-muted">
                    {count} {count === 1 ? "card" : "cards"}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
