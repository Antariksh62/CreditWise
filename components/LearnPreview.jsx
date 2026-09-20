"use client";

import Link from "next/link";
import { BookOpen, Award, Percent, DollarSign, ShieldCheck, CreditCard, Plane, Compass } from "lucide-react";
import Reveal from "./Reveal";

const ROW_1_CARDS = [
  {
    id: "cs",
    title: "Understanding your credit score",
    subtitle: "Credit scores • 4 min read",
    category: "Score",
    iconName: "ShieldCheck",
    badgeText: "780+",
    slug: "understanding-credit-scores",
    quote: "Payment history carries the most weight: a single 30-day late payment can stay on your report for years, while keeping an old zero-fee card quietly protects your credit age.",
  },
  {
    id: "cb",
    title: "Cashback vs reward points",
    subtitle: "Comparison • 5 min read",
    category: "Rewards",
    iconName: "Percent",
    badgeText: "5%",
    slug: "cashback-vs-rewards",
    quote: "Cashback has a guaranteed floor with direct statement credit. Reward points offer higher upside only if you actively find airline and hotel transfer sweet spots.",
  },
  {
    id: "af",
    title: "Understanding annual fees",
    subtitle: "Fees & Waivers • 5 min read",
    category: "Fees",
    iconName: "DollarSign",
    badgeText: "₹0",
    slug: "understanding-annual-fees",
    quote: "An annual fee isn't automatically bad. Calculate your break-even spend: a ₹2,500 fee card with 1.5% net yield requires ₹1.67L spend before beating a zero-fee card.",
  },
  {
    id: "cu",
    title: "Credit utilisation explained",
    subtitle: "Optimization • 4 min read",
    category: "Basics",
    iconName: "Award",
    badgeText: "30%",
    slug: "credit-utilisation",
    quote: "Spending 80% of your limit can hurt your credit score even when paid in full every month, because bureaus only see the snapshot taken on your statement date.",
  },
];

const ROW_2_CARDS = [
  {
    id: "fc",
    title: "How to choose your first card",
    subtitle: "Beginner's guide • 7 min read",
    category: "Guides",
    iconName: "CreditCard",
    badgeText: "1ST",
    slug: "choosing-your-first-card",
    quote: "Start from a month of your bank statements, not flashy marketing tables. Match the card to your two largest recurring expense categories for maximum net yield.",
  },
  {
    id: "la",
    title: "Airport lounge spend criteria",
    subtitle: "Travel perks • 4 min read",
    category: "Travel",
    iconName: "Plane",
    badgeText: "AIR",
    slug: "understanding-annual-fees",
    quote: "Indian banks recently shifted lounge access from complimentary to spend-linked. Learn which cards still offer unconditional domestic and international access.",
  },
  {
    id: "mb",
    title: "The math behind milestone bonuses",
    subtitle: "Spend strategy • 6 min read",
    category: "Strategy",
    iconName: "Compass",
    badgeText: "10X",
    slug: "cashback-vs-rewards",
    quote: "Quarterly vouchers and annual milestone bonuses can double your net reward rate—provided your genuine monthly spend hits the threshold without manufactured purchases.",
  },
  {
    id: "fx",
    title: "Zero forex markup vs rewards",
    subtitle: "International • 5 min read",
    category: "Forex",
    iconName: "BookOpen",
    badgeText: "0%",
    slug: "choosing-your-first-card",
    quote: "Standard cards charge 3.5% + GST on foreign transactions. Cards with zero forex markup save you ₹4,130 on every ₹1,00,000 spent overseas immediately.",
  },
];

const ICON_MAP = {
  ShieldCheck,
  Percent,
  DollarSign,
  Award,
  CreditCard,
  Plane,
  Compass,
  BookOpen,
};

function ArticleCard({ item }) {
  const IconComponent = ICON_MAP[item.iconName] || BookOpen;
  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group block w-[290px] sm:w-[340px] lg:w-[360px] shrink-0 bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-center gap-3.5 mb-3.5">
        <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center shrink-0 text-neutral-800 group-hover:bg-neutral-100 transition-colors">
          <IconComponent className="w-5 h-5 text-neutral-700" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-neutral-950 leading-snug truncate group-hover:text-black">
            {item.title}
          </h3>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {item.subtitle}
          </p>
        </div>
      </div>
      <p className="text-[13px] text-neutral-600 leading-relaxed font-normal line-clamp-3">
        {item.quote}
      </p>
    </Link>
  );
}

export default function LearnPreview() {
  const row1 = [...ROW_1_CARDS, ...ROW_1_CARDS, ...ROW_1_CARDS];
  const row2 = [...ROW_2_CARDS, ...ROW_2_CARDS, ...ROW_2_CARDS];

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-t border-neutral-200/80 overflow-hidden relative">
      {/* HEADER SECTION (SUBTLE VIEWPORT-BASED REVEAL) */}
      <Reveal>
        <div className="cw-container text-center max-w-4xl mx-auto mb-12 sm:mb-16 px-4 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm font-normal text-neutral-500 tracking-normal">
            5 in-depth guides and counting
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.1] sm:leading-[1.08]">
            Guides and Credit Card Insights.
          </h2>

          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-[6px] bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-5 py-2.5 text-sm font-medium transition-colors border border-neutral-200/80"
            >
              View all guides
            </Link>
          </div>
        </div>
      </Reveal>

      {/* TWO-ROW RAMP-STYLE HORIZONTAL MARQUEE WALL */}
      <Reveal delay={140} variant="visual" className="w-full">
        <div className="relative w-full space-y-3 sm:space-y-4">
          {/* LEFT & RIGHT SUBTLE EDGE FADES */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* ROW 1 (SLIDES LEFT) */}
          <div className="flex gap-3 sm:gap-4 overflow-x-hidden select-none py-1">
            <div className="flex gap-3 sm:gap-4 animate-marquee-left shrink-0 hover:[animation-play-state:paused]">
              {row1.map((item, idx) => (
                <ArticleCard key={`r1-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* ROW 2 (SLIDES RIGHT / OFFSET) */}
          <div className="flex gap-3 sm:gap-4 overflow-x-hidden select-none py-1">
            <div className="flex gap-3 sm:gap-4 animate-marquee-right shrink-0 hover:[animation-play-state:paused]">
              {row2.map((item, idx) => (
                <ArticleCard key={`r2-${idx}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* INLINE CSS FOR SILKY SMOOTH INFINITE MARQUEE */}
      <style jsx>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marqueeRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marqueeLeft 45s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 45s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
