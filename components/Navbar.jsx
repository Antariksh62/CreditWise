"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'cards' | 'tools' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

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

  const handleSignOut = () => {
    try {
      window.localStorage.removeItem("cardwise:user");
    } catch {}
    setUser(null);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
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

  const handleNavClick = (href) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* RAMP-STYLE WIDE MAIN NAVIGATION RAIL */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24 flex h-16 items-center justify-between">
          
          {/* LEFT: LOGO + DESKTOP NAV ITEMS */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-black shrink-0 mr-1"
              onClick={() => setActiveMegaMenu(null)}
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
                onMouseEnter={() => setActiveMegaMenu("cards")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick("/cards")}
                  className={`group inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${
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
                onMouseEnter={() => setActiveMegaMenu("tools")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick("/compare")}
                  className={`group inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors ${
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
            {mounted && user ? (
              <>
                <Link
                  href="/profile"
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
                className="text-sm font-medium text-neutral-700 hover:text-black px-3 py-2 transition-colors"
              >
                Sign in
              </Link>
            )}
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

      {/* MEGA MENU CONTAINER (MATCHING FULL-WIDTH PADDING) */}
      {activeMegaMenu && (
        <div
          className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg transition-all duration-200 z-50"
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24 py-8 grid grid-cols-12 gap-8">
            {activeMegaMenu === "cards" && (
              <>
                <div className="col-span-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      CASHBACK & DAILY SPEND
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/cards" className="group block">
                          <div className="font-semibold text-sm text-black group-hover:text-neutral-600 transition-colors">
                            Online Shopping Cards
                          </div>
                          <div className="text-xs text-neutral-500">
                            Up to 5% flat cashback on Amazon, Flipkart & Swiggy
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
                            Answer 5 quick questions to find your top 3 matching cards
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
                    Answer 5 quick questions to find cards that fit your everyday spending.
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
