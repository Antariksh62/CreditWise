"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CreditCard,
  Scale,
  Calculator,
  Sparkles,
  BookOpen,
  Fuel,
  Plane,
  ShoppingBag,
  BadgeIndianRupee,
  Menu,
  X,
} from "lucide-react";

/**
 * Navbar
 * ------------------------------------------------------------
 * Stripe-style navigation: a hairline-bordered bar, a single
 * mega-menu panel under "Cards", and a quiet auth cluster on the
 * right. The mega menu is a Ramp-style icon grid — the clearest
 * borrowing from that reference.
 *
 * Assignment 1: semantic <header> / <nav> landmarks with an
 * accessible skip target and aria-expanded on the trigger.
 */

const MEGA_MENU = [
  {
    heading: "By category",
    links: [
      { href: "/cards?category=cashback", label: "Cashback cards", icon: BadgeIndianRupee, desc: "Direct money back" },
      { href: "/cards?category=travel", label: "Travel cards", icon: Plane, desc: "Miles and lounges" },
      { href: "/cards?category=rewards", label: "Rewards cards", icon: Sparkles, desc: "Flexible points" },
      { href: "/cards?category=fuel", label: "Fuel cards", icon: Fuel, desc: "Savings at the pump" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { href: "/recommend", label: "Find your card", icon: Sparkles, desc: "Five questions" },
      { href: "/compare", label: "Compare cards", icon: Scale, desc: "Side by side" },
      { href: "/cards", label: "All cards", icon: CreditCard, desc: "Browse the catalogue" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/blog", label: "Guides", icon: BookOpen, desc: "Plain-English basics" },
      { href: "/blog/credit-score", label: "Credit scores", icon: BookOpen, desc: "How scoring works" },
      { href: "/blog/understanding-annual-fees", label: "Annual fees", icon: Calculator, desc: "When a fee pays off" },
    ],
  },
];

const PRIMARY_LINKS = [
  { href: "/recommend", label: "Find your card" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Learn" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close every panel on navigation.
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the mega menu.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="cw-container" aria-label="Primary">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* ---------- Wordmark ---------- */}
          <Link href="/" className="flex items-center gap-2" aria-label="CardWise home">
            <span className="grid h-7 w-7 place-items-center rounded bg-accent">
              <CreditCard className="h-4 w-4 text-accent-foreground" strokeWidth={2} />
            </span>
            <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">CardWise</span>
          </Link>

          {/* ---------- Desktop links ---------- */}
          <div className="hidden items-center gap-1 md:flex">
            {/* Mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="cw-btn-ghost text-foreground"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => setMegaOpen((v) => !v)}
              >
                Cards
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ease-cardwise ${
                    megaOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {megaOpen && (
                <div className="absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-2 animate-cw-fade">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-2 rounded-card border border-border bg-surface p-6 shadow-lift">
                    {MEGA_MENU.map((col) => (
                      <div key={col.heading}>
                        <div className="cw-eyebrow mb-3">{col.heading}</div>
                        <ul className="space-y-0.5">
                          {col.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="group flex gap-3 rounded p-2 transition-colors duration-200 hover:bg-subtle"
                                >
                                  <Icon
                                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                                    strokeWidth={1.75}
                                  />
                                  <span>
                                    <span className="block text-[0.875rem] font-medium">
                                      {link.label}
                                    </span>
                                    <span className="block text-[0.8125rem] text-muted">
                                      {link.desc}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`cw-btn-ghost ${
                  pathname === link.href ? "text-foreground" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ---------- Auth cluster ---------- */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" className="cw-btn-ghost">
              Sign in
            </Link>
            <Link href="/signup" className="cw-btn-primary">
              Create account
            </Link>
          </div>

          {/* ---------- Mobile toggle ---------- */}
          <button
            type="button"
            className="cw-btn-ghost md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ---------- Mobile panel ---------- */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface md:hidden animate-cw-fade">
          <div className="cw-container space-y-6 py-6">
            {MEGA_MENU.map((col) => (
              <div key={col.heading}>
                <div className="cw-eyebrow mb-2">{col.heading}</div>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="block py-1.5 text-[0.9375rem]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex gap-2 border-t border-border pt-4">
              <Link href="/login" className="cw-btn-secondary flex-1">
                Sign in
              </Link>
              <Link href="/signup" className="cw-btn-primary flex-1">
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
