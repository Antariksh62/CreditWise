import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Database } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — CreditWise",
  description: "Understand CreditWise local storage usage and our zero third-party advertising tracking policy.",
};

export default function CookiesPage() {
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to Home
        </Link>

        <article className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-12 shadow-sm space-y-8 text-neutral-700 leading-relaxed text-sm">
          <header className="border-b border-neutral-100 pb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">
              Cookie & Storage Disclosure
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black mt-3">
              CreditWise Cookie &amp; Storage Policy
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Last Updated: September 2026 · Transparent Client Storage
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              1. Zero Third-Party Advertising Cookies
            </h2>
            <p>
              CreditWise does not set third-party marketing cookies, cross-site behavioral beacons, or advertising pixels on your device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Database className="h-5 w-5 text-black" />
              2. Local Browser Storage Keys
            </h2>
            <p>
              We use standard HTML5 browser Local Storage strictly for core client state:
            </p>
            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 space-y-3 text-xs">
              <div>
                <code className="font-bold text-black bg-white px-2 py-0.5 rounded border border-neutral-200">cardwise:user</code>
                <p className="text-neutral-600 mt-1">Maintains your client session name and email address across page reloads.</p>
              </div>
              <div>
                <code className="font-bold text-black bg-white px-2 py-0.5 rounded border border-neutral-200">cardwise:profile</code>
                <p className="text-neutral-600 mt-1">Stores your monthly spending ranges and benefit preferences to generate personalized recommendations.</p>
              </div>
              <div>
                <code className="font-bold text-black bg-white px-2 py-0.5 rounded border border-neutral-200">cardwise:saved</code>
                <p className="text-neutral-600 mt-1">Stores card slugs bookmarked by you for side-by-side comparison.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black">3. How to Clear Stored Data</h2>
            <p>
              You can clear all stored records at any moment by visiting your <Link href="/profile" className="font-bold text-black underline">Profile page</Link> and selecting &quot;Delete Account &amp; Clear Local Data&quot;, or via your browser&apos;s clear cache options.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}