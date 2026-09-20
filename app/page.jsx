import Hero from "../components/Hero";
import DualStorySection from "../components/DualStorySection";
import CurationStandards from "../components/CurationStandards";
import PersonalStorySection from "../components/PersonalStorySection";
import LearnPreview from "../components/LearnPreview";

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: HERO (FIRST SECTION - DECIDED & UNTOUCHED) */}
      <Hero />

      {/* SECTION 2: DUAL STORY CARDS (RAMP 2-COLUMN STORYTELLING) */}
      <DualStorySection />

      {/* SECTION 3: 3-PILLAR CURATION STANDARDS (RAMP 3-COLUMN RHYTHM) */}
      <CurationStandards />

      {/* SECTION 4: PERSONAL STORY (RAMP ASYMMETRIC TEXT + LARGE VISUAL) */}
      <PersonalStorySection />

      {/* LAST SECTION: GUIDES & CREDIT CARD INSIGHTS (LAST SECTION - DECIDED & UNTOUCHED) */}
      <LearnPreview />
    </>
  );
}
