"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'cards' | 'tools' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">


      {/* 2. RAMP-STYLE MAIN NAVIGATION RAIL */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="cw-container flex h-16 items-center justify-between">
          {/* LEFT: LOGO + DESKTOP NAV ITEMS PLACED CLOSE TO LOGO */}
          <div className="flex items-center gap-4 xl:gap-6">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-black shrink-0 mr-2"
              onClick={() => setActiveMegaMenu(null)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-[#e4f222] font-extrabold text-sm">
                cw
              </div>
              <span className="font-extrabold tracking-tighter text-black text-xl">
                cardwise
              </span>
            </Link>

            {/* DESKTOP NAV ITEMS — CLOSER TO LOGO WITH UNIFORM SPACING */}
            <nav className="hidden md:flex items-center gap-1 xl:gap-1.5">
              {/* CARDS DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("cards")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick("/cards")}
                  className={`group inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${activeMegaMenu === "cards"
                    ? "text-black bg-neutral-100"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100/60"
                    }`}
                >
                  Cards
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${activeMegaMenu === "cards" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* TOOLS DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setActiveMegaMenu("tools")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick("/compare")}
                  className={`group inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${activeMegaMenu === "tools"
                    ? "text-black bg-neutral-100"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100/60"
                    }`}
                >
                  Tools
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${activeMegaMenu === "tools" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <Link
                href="/compare"
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Compare
              </Link>

              <Link
                href="/recommend"
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Find your card
              </Link>

              <Link
                href="/blog"
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Guides
              </Link>
            </nav>
          </div>

          {/* RIGHT: ACTION BUTTONS MATCHING RAMP SPECS */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-700 hover:text-black px-3 py-2 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/compare"
              className="rounded-[6px] bg-[#e4f222] px-3.5 py-2 text-sm font-medium text-black hover:bg-[#cee723] transition-colors whitespace-nowrap"
            >
              Compare cards
            </Link>
            <Link
              href="/recommend"
              className="rounded-[6px] bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              Get started
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-black"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 3. MEGA MENU CONTAINER */}
      {activeMegaMenu && (
        <div
          className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg transition-all duration-200 z-50"
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="cw-container py-8 grid grid-cols-12 gap-8">
            {activeMegaMenu === "cards" && (
              <>
                <div className="col-span-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      CARD CATEGORIES
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/cards" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Cashback Cards
                          </div>
                          <div className="text-xs text-neutral-500">
                            Earn flat 5% on online & offline spending
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/cards" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Travel & Lounge Cards
                          </div>
                          <div className="text-xs text-neutral-500">
                            Complimentary flights, lounge access & zero forex
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      PREMIUM & ZERO FEE
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/cards" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Zero Annual Fee
                          </div>
                          <div className="text-xs text-neutral-500">
                            No joining fees or recurring renewal costs
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/cards" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Super Premium Cards
                          </div>
                          <div className="text-xs text-neutral-500">
                            Luxury privileges, concierge & metal card status
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-span-4 bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    FEATURED CARD
                  </div>
                  <div className="font-bold text-base text-black mb-1">
                    SBI Cashback Credit Card
                  </div>
                  <p className="text-xs text-neutral-600 mb-4">
                    India&apos;s highest flat cashback card. 5% back on all online merchant spending.
                  </p>
                  <Link
                    href="/cards/sbi-cashback"
                    className="inline-flex items-center text-xs font-bold text-black hover:underline"
                  >
                    View card details →
                  </Link>
                </div>
              </>
            )}

            {activeMegaMenu === "tools" && (
              <>
                <div className="col-span-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      INTELLIGENCE TOOLS
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/recommend" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Recommendation Quiz
                          </div>
                          <div className="text-xs text-neutral-500">
                            Answer 4 questions to find your top 3 matching cards
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/compare" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Side-by-Side Compare
                          </div>
                          <div className="text-xs text-neutral-500">
                            Compare rewards, annual fees and lounge privileges
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      CALCULATORS
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/#reward-calculator" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Reward Calculator
                          </div>
                          <div className="text-xs text-neutral-500">
                            See what you could get back based on your monthly spending
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-span-4 bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    FIND YOUR FIT
                  </div>
                  <div className="font-bold text-base text-black mb-1">
                    Find your exact match
                  </div>
                  <p className="text-xs text-neutral-600 mb-4">
                    Answer 4 simple questions to find cards that fit your everyday spending.
                  </p>
                  <Link
                    href="/recommend"
                    className="inline-flex items-center text-xs font-bold text-black hover:underline"
                  >
                    Find your card →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-6 py-6 space-y-4">
          <Link
            href="/cards"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-black"
          >
            Explore Cards
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-black"
          >
            Compare Cards
          </Link>
          <Link
            href="/recommend"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-black"
          >
            Find Your Card
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-black"
          >
            Guides & Articles
          </Link>
          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-semibold text-sm text-neutral-700 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-medium text-sm bg-[#e4f222] text-black py-2.5 rounded-[6px]"
            >
              Compare cards
            </Link>
            <Link
              href="/recommend"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-medium text-sm bg-black text-white py-2.5 rounded-[6px]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
