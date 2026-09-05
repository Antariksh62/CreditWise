import Hero from "../components/Hero";
import IssuerNetwork from "../components/IssuerNetwork";
import FeatureGrid from "../components/FeatureGrid";
import ComparePreview from "../components/ComparePreview";
import RewardCalculatorPreview from "../components/RewardCalculatorPreview";
import EditorialBanner from "../components/EditorialBanner";
import PopularCards from "../components/PopularCards";
import LearnPreview from "../components/LearnPreview";
import FinalCTA from "../components/FinalCTA";
import Disclaimer from "../components/Disclaimer";
import ActivityTicker from "../components/ActivityTicker";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IssuerNetwork />
      <FeatureGrid />
      <ComparePreview />
      <RewardCalculatorPreview />
      <EditorialBanner />
      <PopularCards />
      <LearnPreview />
      <FinalCTA />
      <Disclaimer />
      <ActivityTicker />
    </>
  );
}
