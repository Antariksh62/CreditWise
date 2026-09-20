import SignupForm from "../../components/SignupForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Create Account — CreditWise",
  description:
    "Create your CreditWise account and discover how your existing expenses can earn more value through smart card matching.",
};

export default function SignupPage() {
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-20 max-w-xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="cw-link-arrow mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to Home
        </Link>

        <SignupForm />
      </div>
    </div>
  );
}
