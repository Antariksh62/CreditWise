import LoginForm from "../../components/LoginForm";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata = {
  title: "Sign in — CreditWise",
  description:
    "Sign in to your CreditWise account to see your personalized spending rewards and saved credit cards.",
};

export default function LoginPage() {
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
          {/* Left Column: Context & Trust Architecture */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
                CREDITWISE ACCESS
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2 leading-tight">
                Sign in to your card intelligence profile.
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600">
                Review your saved card recommendations, natural spending breakdown, and fee recovery comparisons.
              </p>
            </div>

            {/* Privacy & Product Assurances */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-2xs">
              <div className="flex items-start gap-3 text-xs text-neutral-700 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">Zero Sensitive Data: </strong>
                  CreditWise never collects PAN, bank passwords, OTPs, or credit card numbers.
                </span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-700 leading-relaxed">
                <Lock className="h-4 w-4 text-neutral-700 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">Local Demo Session: </strong>
                  Your credentials and spending profiles remain safely isolated in your browser storage.
                </span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-700 leading-relaxed">
                <EyeOff className="h-4 w-4 text-neutral-700 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <strong className="text-black font-semibold">No Commercial Push: </strong>
                  We optimize your existing expenses. We never push cards to induce unwanted spending.
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="font-semibold text-black underline underline-offset-2">
                Create an account
              </Link>{" "}
              in under one minute.
            </p>
          </div>

          {/* Right Column: Clean, Polished Form */}
          <div className="lg:col-span-7">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
