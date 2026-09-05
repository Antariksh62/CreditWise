import Link from "next/link";
import { CreditCard } from "lucide-react";

/**
 * Footer
 * ------------------------------------------------------------
 * Four-column link rail over a legal strip. Server component —
 * no state, no client JS.
 *
 * Assignment 1: semantic <footer> landmark with nav lists.
 */

const COLUMNS = [
  {
    heading: "Cards",
    links: [
      { href: "/cards", label: "All cards" },
      { href: "/cards?category=cashback", label: "Cashback" },
      { href: "/cards?category=travel", label: "Travel" },
      { href: "/cards?category=rewards", label: "Rewards" },
      { href: "/cards?category=fuel", label: "Fuel" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { href: "/recommend", label: "Find your card" },
      { href: "/compare", label: "Compare cards" },
      { href: "/results", label: "Your matches" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/blog", label: "All guides" },
      { href: "/blog/credit-score", label: "Credit scores" },
      { href: "/blog/cashback-vs-rewards", label: "Cashback vs rewards" },
      { href: "/blog/choosing-your-first-card", label: "Your first card" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/profile", label: "Saved cards" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-subtle">
      <div className="cw-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded bg-accent">
                <CreditCard className="h-4 w-4 text-accent-foreground" strokeWidth={2} />
              </span>
              <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
                CardWise
              </span>
            </div>
            <p className="max-w-[26ch] text-[0.875rem] leading-relaxed text-muted">
              An educational tool for understanding credit cards. Built as a student
              project, not a financial service.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="cw-eyebrow mb-3">{col.heading}</h2>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.875rem] text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-border">
        <div className="cw-container flex flex-col gap-2 py-5 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CardWise. Demo data — not financial advice.</p>
          <p>Built with Next.js, React and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
