import Link from "next/link";

const COLUMNS = [
  {
    heading: "Cards",
    links: [
      { href: "/cards", label: "All cards" },
      { href: "/cards?category=cashback", label: "Cashback" },
      { href: "/cards?category=travel", label: "Travel" },
      { href: "/cards?category=dining", label: "Dining" },
      { href: "/cards?category=rewards", label: "Rewards" },
      { href: "/cards?category=fuel", label: "Fuel" },
      { href: "/cards?category=lifetime-free", label: "Lifetime free" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { href: "/onboarding", label: "Personalized onboarding" },
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
    heading: "Legal & Trust",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/profile", label: "Manage your data" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white pb-16">
      <div className="cw-container py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-[#DDF247] font-extrabold text-sm">
                cw
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-black">
                creditwise
              </span>
            </div>
            <p className="max-w-[28ch] text-xs leading-relaxed text-neutral-500 mb-3">
              An independent, privacy-first credit card intelligence platform. Matching verified cards to your existing spending habits.
            </p>
            <p className="text-[11px] text-neutral-400">
              Zero affiliate redirection traps. Zero invasive tracking.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                {col.heading}
              </h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-medium text-neutral-600 transition-colors duration-200 hover:text-black"
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

      <div className="border-t border-neutral-200 pt-6">
        <div className="cw-container flex flex-col gap-2 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CreditWise. Independent credit-card intelligence platform.</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <Link href="/cookies" className="hover:text-black">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}