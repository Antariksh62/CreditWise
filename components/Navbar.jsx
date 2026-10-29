"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import cards from "../data/cards.json";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'cards' | 'tools' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  const headerRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const LEAVE_DELAY = 1500; // Dropdown automatically closes 1.5 seconds after cursor leaves

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const closeMenuImmediately = useCallback(() => {
    clearCloseTimeout();
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
  }, [clearCloseTimeout]);

  const handleTriggerMouseEnter = (menu) => {
    clearCloseTimeout();
    setActiveMegaMenu(menu);
  };

  const handleTriggerClick = (e, menu) => {
    e.preventDefault();
    e.stopPropagation();
    clearCloseTimeout();
    setActiveMegaMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, LEAVE_DELAY);
  };

  const handleMegaMenuMouseEnter = () => {
    clearCloseTimeout();
  };

  useEffect(() => {
    setMounted(true);
    function readUser() {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem("cardwise:user");
        if (!raw) {
          setUser(null);
          return;
        }
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          (parsed.email || parsed.username || parsed.fullName)
        ) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    readUser();
    window.addEventListener("storage", readUser);
    return () => window.removeEventListener("storage", readUser);
  }, [pathname]);

  // Click outside and escape key handling to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeMenuImmediately();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMenuImmediately();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimeout();
    };
  }, [closeMenuImmediately, clearCloseTimeout]);

  // Close menus on route navigation
  useEffect(() => {
    closeMenuImmediately();
  }, [pathname, closeMenuImmediately]);

  const handleSignOut = () => {
    try {
      window.localStorage.removeItem("cardwise:user");
    } catch {}
    setUser(null);
    closeMenuImmediately();
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const displayName = user
    ? user.fullName
      ? user.fullName.split(" ")[0]
      : user.username || "Profile"
    : "";
  const initial = user
    ? (user.fullName || user.username || user.email || "U")[0].toUpperCase()
    : "U";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-white relative"
      onMouseEnter={clearCloseTimeout}
      onMouseLeave={handleMouseLeave}
    >
      {/* RAMP-STYLE WIDE MAIN NAVIGATION RAIL */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24 flex h-16 items-center justify-between">
          
          {/* LEFT: LOGO + DESKTOP NAV ITEMS */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-black shrink-0 mr-1"
              onClick={closeMenuImmediately}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-[#e4f222] font-extrabold text-sm">
                cw
              </div>
              <span className="font-extrabold tracking-tighter text-black text-xl">
                cardwise
              </span>
            </Link>

            {/* DESKTOP NAV ITEMS */}
            <nav className="hidden md:flex items-center gap-1 xl:gap-1.5">
              {/* CARDS DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => handleTriggerMouseEnter("cards")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={(e) => handleTriggerClick(e, "cards")}
                  aria-expanded={activeMegaMenu === "cards"}
                  aria-haspopup="true"
                  className={`group inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${
                    activeMegaMenu === "cards"
                      ? "text-black bg-neutral-100"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100/60"
                  }`}
                >
                  Cards
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${
                      activeMegaMenu === "cards" ? "rotate-180" : ""
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
                onMouseEnter={() => handleTriggerMouseEnter("tools")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={(e) => handleTriggerClick(e, "tools")}
                  aria-expanded={activeMegaMenu === "tools"}
                  aria-haspopup="true"
                  className={`group inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${
                    activeMegaMenu === "tools"
                      ? "text-black bg-neutral-100"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100/60"
                  }`}
                >
                  Tools
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-transform duration-200 ${
                      activeMegaMenu === "tools" ? "rotate-180" : ""
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
                onMouseEnter={handleMouseLeave}
                onClick={closeMenuImmediately}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Compare
              </Link>

              <Link
                href="/recommend"
                onMouseEnter={handleMouseLeave}
                onClick={closeMenuImmediately}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Find your card
              </Link>

              <Link
                href="/blog"
                onMouseEnter={handleMouseLeave}
                onClick={closeMenuImmediately}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-black hover:bg-neutral-100/60 rounded-[6px] transition-colors"
              >
                Guides
              </Link>
            </nav>
          </div>

          {/* RIGHT: ACTION BUTTONS MATCHING RAMP SPECS */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {mounted && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenuImmediately}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black px-2.5 py-1.5 transition-colors rounded-[6px] hover:bg-neutral-100"
                  title="View spending profile & wallet"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[#e4f222] text-[10px] font-bold shrink-0">
                    {initial}
                  </span>
                  <span className="max-w-[120px] truncate text-xs font-semibold text-neutral-900">
                    {displayName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs font-medium text-neutral-500 hover:text-black px-2.5 py-2 transition-colors"
                  title="Sign out of demo account"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenuImmediately}
                className="text-sm font-medium text-neutral-700 hover:text-black px-3 py-2 transition-colors"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/compare"
              onClick={closeMenuImmediately}
              className="rounded-[6px] bg-[#e4f222] px-3.5 py-2 text-sm font-medium text-black hover:bg-[#cee723] transition-colors whitespace-nowrap"
            >
              Compare cards
            </Link>
            <Link
              href="/recommend"
              onClick={closeMenuImmediately}
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

      {/* MEGA MENU CONTAINER */}
      {activeMegaMenu && (
        <div
          className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-xl transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-1"
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24 py-8">
            {activeMegaMenu === "cards" && (
              <div className="grid grid-cols-12 gap-8">
                {/* Column 1: Cashback & Everyday */}
                <div className="col-span-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
                    CASHBACK & EVERYDAY
                  </div>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=cashback"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Cashback & Shopping</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Up to 5% flat cashback on Amazon, Flipkart, Swiggy & daily spends
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=travel"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Travel & Lounge Access</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Airport lounge visits, zero forex markup & co-branded airline miles
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=dining"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Dining & Food Delivery</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          High returns on Zomato, Swiggy, and curated partner restaurants
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Zero Fee & Specialized */}
                <div className="col-span-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
                    ZERO FEE & SPECIALIZED
                  </div>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=lifetime-free"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Lifetime Free Cards</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Zero joining fees and no recurring annual renewal charges
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=rewards"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Reward Points & Miles</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Earn flexible points redeemable for flights, luxury stays & vouchers
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={true} href="/cards?category=fuel"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Fuel Surcharge Waiver</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Save on petrol, diesel, and EV charges at fuel stations nationwide
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Dedicated "Check Out All Credit Cards" Section */}
                <div className="col-span-4 flex flex-col justify-between bg-neutral-50 p-6 rounded-lg border border-neutral-200 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-white px-2.5 py-0.5 rounded border border-neutral-200">
                        Full Catalog
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        {cards.length} verified cards
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-neutral-900 mb-1.5">
                      Check Out All Credit Cards
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      Explore our complete directory of verified Indian cards. Filter by bank, annual fee, or reward type with 100% transparent fee math.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-neutral-200/80">
                    <Link
                      href="/cards" prefetch={true}
                      onClick={closeMenuImmediately}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold text-black bg-[#e4f222] hover:bg-[#cee723] rounded-[6px] transition-colors group shadow-sm"
                    >
                      <span>Browse all {cards.length} credit cards</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/cards/sbi-cashback"
                      onClick={closeMenuImmediately}
                      className="flex items-center justify-between text-xs text-neutral-600 hover:text-black py-1 px-1 transition-colors"
                    >
                      <span className="truncate">⭐ Featured: SBI Cashback Card (5% flat)</span>
                      <span className="text-neutral-400">Details →</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Strip: Full Directory Quick Link */}
                <div className="col-span-12 pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                    <span className="font-semibold text-neutral-800">100% Verified Terms:</span>
                    <span className="text-neutral-500">
                      Zero sponsored placements. Reward rates, caps, and fee waivers verified against official bank documents.
                    </span>
                  </div>
                  <Link
                    href="/cards" prefetch={true}
                    onClick={closeMenuImmediately}
                    className="font-bold text-black hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>View complete directory ({cards.length} cards)</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {activeMegaMenu === "tools" && (
              <div className="grid grid-cols-12 gap-8">
                {/* Column 1: Decision & Intelligence Tools */}
                <div className="col-span-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
                    DECISION & INTELLIGENCE
                  </div>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href="/recommend"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Recommendation Quiz</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Answer 5 quick spending questions to find cards that fit your actual budget
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/compare"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Side-by-Side Compare</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Compare up to 3 cards across annual fees, lounge access & real reward rates
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Calculators & Wallet */}
                <div className="col-span-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
                    CALCULATORS & WALLET
                  </div>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href="/compare#reward-calculator"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Reward Calculator</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Estimate net value return on your monthly category spends after deducting fees
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        onClick={closeMenuImmediately}
                        className="group block"
                      >
                        <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors flex items-center justify-between">
                          <span>Spending Profile & Wallet</span>
                          <span className="text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
                            →
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          Manage saved cards, track renewal waivers, and calibrate spending targets
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Featured Action Box */}
                <div className="col-span-4 flex flex-col justify-between bg-neutral-50 p-6 rounded-lg border border-neutral-200 shadow-sm">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-white px-2.5 py-0.5 rounded border border-neutral-200 inline-block mb-2.5">
                      Personalized Fit
                    </div>
                    <h3 className="font-bold text-base text-neutral-900 mb-1.5">
                      Unsure which card to choose?
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      Take our 1-minute personalized questionnaire. We analyze your existing spending to find cards that earn maximum rewards.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-neutral-200/80">
                    <Link
                      href="/recommend"
                      onClick={closeMenuImmediately}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold text-black bg-[#e4f222] hover:bg-[#cee723] rounded-[6px] transition-colors group shadow-sm"
                    >
                      <span>Take 1-minute quiz</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                    <Link
                      href="/compare"
                      onClick={closeMenuImmediately}
                      className="flex items-center justify-between text-xs text-neutral-600 hover:text-black py-1 px-1 transition-colors"
                    >
                      <span>Launch card comparison table</span>
                      <span className="text-neutral-400">Open →</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="col-span-12 pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cee723] inline-block shrink-0" />
                    <span className="font-semibold text-neutral-800">Spend Optimization:</span>
                    <span className="text-neutral-500">
                      Built to maximize returns on expenses you already have — never to encourage debt or impulse spending.
                    </span>
                  </div>
                  <Link
                    href="/compare"
                    onClick={closeMenuImmediately}
                    className="font-bold text-black hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>Compare cards side-by-side</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-6 py-6 space-y-4">
          {mounted && user && (
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-black text-[#e4f222] text-xs font-bold flex items-center justify-center shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.email || ""}
                  </p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-neutral-900 px-2.5 py-1 bg-neutral-100 rounded hover:bg-neutral-200 shrink-0"
              >
                Profile
              </Link>
            </div>
          )}
          <Link
            href="/cards" prefetch={true}
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
          {mounted && user && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-black"
            >
              Spending Profile & Wallet
            </Link>
          )}
          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3">
            {mounted && user ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-center font-semibold text-sm text-neutral-600 hover:text-black py-2"
                >
                  Sign out
                </button>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
