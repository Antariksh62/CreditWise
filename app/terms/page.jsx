import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service — CreditWise",
  description: "Terms governing use of CreditWise, independent informational matching, and issuer authority disclaimers.",
};

export default function TermsPage() {
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
              Terms & Conditions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black mt-3">
              CreditWise Terms of Service
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Last Updated: September 2026 · Plain Language Terms
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Scale className="h-5 w-5 text-black" />
              1. Informational Service Only
            </h2>
            <p>
              CreditWise is an independent educational tool designed to compare credit card products against self-reported spending habits. CreditWise is not a bank, lender, or credit card broker.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              2. No Approval Guarantees or Financial Promises
            </h2>
            <div className="rounded-xl bg-amber-50/50 border border-amber-200/60 p-4 text-xs space-y-2 text-amber-950 font-medium">
              <p>• <strong>No Guaranteed Approvals:</strong> Card approvals, credit limits, interest rates (APR), and fee waivers are solely at the discretion of the issuing bank.</p>
              <p>• <strong>Calculations are Estimates:</strong> Reward estimates are based on public bank terms and do not guarantee specific cash returns or points.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black">3. Free Platform & Refund Policy</h2>
            <p>
              CreditWise is 100% free to access. We do not charge subscription fees, consultation fees, or membership dues. Because CreditWise does not collect payments or sell financial products, paid transaction refund policies are not applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-black">4. Official Issuer Links</h2>
            <p>
              Every card on CreditWise links directly to the official issuer&apos;s product or application page. When navigating to an external bank website, you are subject to the bank&apos;s own terms and schedules.
            </p>
          </section>

          <section className="space-y-3 border-t border-neutral-100 pt-6 text-xs text-neutral-500">
            <h2 className="text-sm font-bold text-black">5. Disclaimer of Warranties</h2>
            <p>
              The platform is provided &quot;as is&quot;. Always review the canonical schedule on the official bank site before applying for any credit card.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}