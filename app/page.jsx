import Hero from "../components/Hero";
import PopularCards from "../components/PopularCards";
import HowItWorks from "../components/HowItWorks";
import FindYourCardPreview from "../components/FindYourCardPreview";
import ComparePreview from "../components/ComparePreview";
import RewardCalculatorPreview from "../components/RewardCalculatorPreview";
import ExploreCategories from "../components/ExploreCategories";
import LearnPreview from "../components/LearnPreview";
import Disclaimer from "../components/Disclaimer";

/**
 * Homepage
 * ------------------------------------------------------------
 * Section order is fixed by the approved design:
 *
 *   Navbar (layout)
 *   → Hero
 *   → Popular Cards
 *   → How CardWise Works
 *   → Find Your Card preview
 *   → Compare preview
 *   → Reward Calculator preview
 *   → Explore by What Matters
 *   → Learn
 *   → Disclaimer
 *   → Footer (layout)
 *
 * Navbar and Footer live in app/layout.jsx because every route
 * needs them; everything between is this page.
 *
 * This is a server component. The only client JavaScript on the
 * homepage is the scroll-reveal observer and the save buttons.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCards />
      <HowItWorks />
      <FindYourCardPreview />
      <ComparePreview />
      <RewardCalculatorPreview />
      <ExploreCategories />
      <LearnPreview />
      <Disclaimer />
    </>
  );
}
