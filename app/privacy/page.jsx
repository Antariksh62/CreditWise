import Link from "next/link";
import { ArrowLeft, ShieldCheck, Database, Lock, EyeOff, Trash2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — CreditWise",
  description: "Learn how CreditWise handles your data, respects your privacy, and stores information locally in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to Home
        </Link>

        <article className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-12 shadow-sm space-y-8 text-neutral-700 leading-relaxed text-sm">
          <header className="border-b border-neutral-100 pb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#DDF247] text-black px-2.5 py-0.5 rounded-full">
              Trust & Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black mt-3">
              CreditWise Privacy Policy
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Last Updated: September 2026 · Effective Immediately
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              1. Core Privacy Philosophy
            </h2>
            <p>
              CreditWise is designed from the ground up as a privacy-respecting credit card intelligence platform. You can explore and evaluate card recommendations without surrendering sensitive banking credentials or invasive personal identity documents.
            </p>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-4 text-xs space-y-1.5 font-medium text-neutral-800">
              <p>• We <strong>NEVER</strong> ask for or store credit card numbers, CVVs, expiry dates, or PINs.</p>
              <p>• We <strong>NEVER</strong> request online banking login credentials or passwords.</p>
              <p>• We <strong>NEVER</strong> pull unauthorized credit bureau reports or initiate hard inquiries.</p>
              <p>• We <strong>NEVER</strong> sell or rent your personal data to banks, advertisers, or lead brokers.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Database className="h-5 w-5 text-black" />
              2. Data We Collect & How It Is Used
            </h2>
            <p>
              Data collection is strictly limited to information you explicitly provide to generate tailored recommendations:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Credentials:</strong> Full name, email address, age, and demo password for local session management.</li>
              <li><strong>Spending Habits:</strong> Self-reported monthly expense approximations across categories (groceries, dining, fuel, travel, shopping, utilities).</li>
              <li><strong>Card & Benefit Preferences:</strong> Stated priorities (lounge access, cashback, 0% forex, low fees) and self-reported credit score range.</li>
              <li><strong>Existing Portfolio:</strong> Card names currently held, used strictly to prevent duplicate recommendations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Lock className="h-5 w-5 text-black" />
              3. Local Browser Storage Architecture
            </h2>
            <p>
              CreditWise operates using client-side HTML5 localStorage. Your profile and bookmarks stay on your personal device and are not transmitted to tracking networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-black" />
              4. Zero Third-Party Advertising Trackers
            </h2>
            <p>
              We embed no third-party marketing SDKs, Facebook tracking pixels, Google Tag Manager advertising tags, or Hotjar session recordings. Fonts and icons are self-hosted locally.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              5. User Data Deletion Rights
            </h2>
            <p>
              You can delete your stored profile and saved cards at any time via your <Link href="/profile" className="font-bold text-black underline">Profile page</Link> by clicking <strong>&quot;Delete Account &amp; Clear Local Data&quot;</strong>, or by clearing your browser cache.
            </p>
          </section>

          <section className="space-y-3 border-t border-neutral-100 pt-6 text-xs text-neutral-500">
            <h2 className="text-sm font-bold text-black">6. Operator Transparency</h2>
            <p>
              CreditWise is an independent educational credit card matching service. For questions or corrections, contact our editorial team via our project repository.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}