"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Award, Percent, DollarSign, ShieldCheck, CreditCard, Plane, Compass } from "lucide-react";
import blogs from "../../data/blogs.json";
import Reveal from "../../components/Reveal";

const ICON_MAP = {
  "understanding-credit-scores": ShieldCheck,
  "cashback-vs-rewards": Percent,
  "understanding-annual-fees": DollarSign,
  "credit-utilisation": Award,
  "choosing-your-first-card": CreditCard,
};

const BADGE_MAP = {
  "understanding-credit-scores": "780+",
  "cashback-vs-rewards": "5%",
  "understanding-annual-fees": "₹0",
  "credit-utilisation": "30%",
  "choosing-your-first-card": "1ST",
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-24">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        {/* RAMP-STYLE CENTERED HERO HEADER */}
        <header className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-sm font-normal text-neutral-500 tracking-normal">
            5 in-depth guides and counting
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
            Guides and Credit Card Insights.
          </h1>
          <p className="text-base text-neutral-600 font-normal max-w-xl mx-auto pt-1">
            Practical breakdowns on reward math, credit score rules, and fee waiver optimization.
          </p>
        </header>

        {/* ARTICLES GRID USING RAMP MINIMAL CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post, index) => {
            const IconComponent = ICON_MAP[post.slug] || BookOpen;
            const badge = BADGE_MAP[post.slug] || "GUIDE";

            return (
              <Reveal key={post.slug} delay={index * 50}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between h-full bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center shrink-0 text-neutral-800 group-hover:bg-neutral-100 transition-colors">
                        <IconComponent className="w-5 h-5 text-neutral-700" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-semibold text-neutral-950 leading-snug group-hover:text-black line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {post.category} • {post.readTime}
                        </p>
                      </div>
                    </div>

                    <p className="text-[13px] text-neutral-600 leading-relaxed font-normal">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-900 group-hover:text-black">
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
