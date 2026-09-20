import OnboardingFlow from "../../components/OnboardingFlow";

export const metadata = {
  title: "User Onboarding — CreditWise",
  description:
    "Tailor your credit card recommendations by sharing your natural spending habits and reward preferences.",
};

export default function OnboardingPage() {
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <OnboardingFlow />
      </div>
    </div>
  );
}
