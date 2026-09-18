import Hero from "../components/Hero";
import VideoSection from "../components/VideoSection";
import DualStorySection from "../components/DualStorySection";
import CurationStandards from "../components/CurationStandards";
import PersonalStorySection from "../components/PersonalStorySection";
import LearnPreview from "../components/LearnPreview";

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: HERO (FIRST SECTION - DECIDED & UNTOUCHED) */}
      <Hero />

      {/* SECTION 2: VIDEO RESERVED VIEWPORT (16:9 CLEAN MEDIA PLACEHOLDER) */}
      <VideoSection />

      {/* SECTION 3: DUAL STORY CARDS (RAMP 2-COLUMN STORYTELLING) */}
      <DualStorySection />

      {/* SECTION 4: 3-PILLAR CURATION STANDARDS (RAMP 3-COLUMN RHYTHM) */}
      <CurationStandards />

      {/* SECTION 5: PERSONAL STORY (RAMP ASYMMETRIC TEXT + LARGE VISUAL) */}
      <PersonalStorySection />

      {/* LAST SECTION: GUIDES & CREDIT CARD INSIGHTS (LAST SECTION - DECIDED & UNTOUCHED) */}
      <LearnPreview />
    </>
  );
}
