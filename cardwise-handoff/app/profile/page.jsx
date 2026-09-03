"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import cards from "../../data/cards.json";
import CardGrid from "../../components/CardGrid";
import { readSaved } from "../../components/SaveCardButton";

/**
 * /profile — the demo account page
 * ------------------------------------------------------------
 * Reads the "signed in" user and the saved-card slugs out of
 * localStorage. Both are written by the demo auth forms and the
 * bookmark buttons; there is no backend behind either.
 */
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("cardwise:user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
    setSavedSlugs(readSaved());
    setReady(true);
  }, []);

  function signOut() {
    window.localStorage.removeItem("cardwise:user");
    router.push("/login");
  }

  const savedCards = cards.filter((card) => savedSlugs.includes(card.slug));

  if (!ready) {
    return (
      <div className="cw-container py-20">
        <p className="cw-body text-center">Loading…</p>
      </div>
    );
  }

  // ---------- Signed out ----------
  if (!user) {
    return (
      <div className="cw-rail">
        <div className="cw-container py-20">
          <div className="cw-card mx-auto max-w-[480px] px-6 py-14 text-center">
            <h1 className="cw-h3 mb-2">You are not signed in</h1>
            <p className="cw-body mx-auto mb-6 max-w-[38ch]">
              Sign in to a demo account to see the cards you have saved.
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/login" className="cw-btn-primary">
                Sign in
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
              <Link href="/signup" className="cw-btn-secondary">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Signed in ----------
  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="cw-eyebrow mb-3">Your account</p>
            <h1 className="cw-h2">{user.fullName}</h1>
            <p className="cw-body mt-2">
              @{user.username} · {user.email}
            </p>
          </div>
          <button type="button" onClick={signOut} className="cw-btn-secondary">
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </header>

        <section>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="cw-h3">Saved cards</h2>
              <p className="cw-body mt-1 text-[0.9375rem]">
                {savedCards.length === 0
                  ? "Nothing saved yet."
                  : `${savedCards.length} ${savedCards.length === 1 ? "card" : "cards"} bookmarked in this browser.`}
              </p>
            </div>
            <Link href="/cards" className="cw-link-arrow">
              Browse the catalogue
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          <CardGrid
            cards={savedCards}
            emptyMessage="Use the bookmark icon on any card to save it here."
          />
        </section>

        <p className="mt-10 text-[0.8125rem] text-muted">
          Demo account. Your details and saved cards are stored in this browser only and
          are cleared when you clear site data.
        </p>
      </div>
    </div>
  );
}
