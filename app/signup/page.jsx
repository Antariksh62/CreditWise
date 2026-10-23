import SignupForm from "../../components/SignupForm";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export const metadata = {
  title: "Create Account — CreditWise",
  description:
    "Create your CreditWise account and discover how your existing expenses can earn more value through smart card matching.",
};

export default function SignupPage() {
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/"
          className="cw-link-arrow mb-10 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to Home
        </Link>

        {/* Editorial 2-Column Composition on Large Screens */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Context & The Two-Phase Journey */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                START WITH YOUR NATURAL SPENDING
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2 leading-tight">
                Create your CreditWise account.
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600">
                Setup takes less than a minute. We ask only for basic identity details to preserve your preferences.
              </p>
            </div>

            {/* Clear Separation of Steps */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[#DDF247] font-mono text-xs font-bold">
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Account Creation (Now)
                  </span>
                </div>
                <p className="text-xs text-neutral-500 pl-7 leading-relaxed">
                  Basic name, email, and age confirmation. No financial interrogation.
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 font-mono text-xs font-bold">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Personalized Onboarding (Next)
                  </span>
                </div>
                <p className="text-xs text-neutral-500 pl-7 leading-relaxed">
                  Everyday spending ranges (dining, travel, groceries) to match verified cards without altering how you spend.
                </p>
              </div>
            </div>

            {/* Privacy & Safety Bullet Points */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-3.5 shadow-2xs text-xs text-neutral-700">
              <div className="flex items-start gap-2.5 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">Zero Sensitive Data: </strong>
                  Never ask for PAN, Aadhaar, salary slips, or bank account numbers.
                </span>
              </div>
              <div className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-neutral-700 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">Adult Eligibility: </strong>
                  CreditWise is designed strictly for adults aged 18+ under Indian financial rules.
                </span>
              </div>
              <div className="flex items-start gap-2.5 leading-relaxed">
                <Lock className="h-4 w-4 text-neutral-700 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">Demo Architecture: </strong>
                  Sessions are stored locally in your browser with zero external tracking SDKs.
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-black underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Right Column: Clean, Polished Signup Form */}
          <div className="lg:col-span-7">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
