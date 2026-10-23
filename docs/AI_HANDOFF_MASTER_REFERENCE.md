# CreditWise — Master AI Handoff & Architectural Audit Reference
**Document Version**: 2.1 (Comprehensive Repository Audit Verified)  
**Date**: October 2026  
**Status**: Academic & Engineering Source of Truth  

---

## 1. Executive Summary
CreditWise (historically referenced as CardWise in earlier assignments) is an educational, privacy-focused Next.js 15 financial web application designed to help Indian consumers optimize their **existing natural spending** across credit cards. It explicitly rejects the lead-generation affiliate marketplace model. It enforces strict data verification, zero fake metrics, zero arbitrary match scores, explainable rule-based recommendations, and a high-end Ramp-inspired editorial aesthetic.

---

## 2. Technical Stack & Governance
- **Core Framework**: Next.js 15.5.25 (App Router), React 19.0.0, Node.js.
- **Language**: JavaScript / JSX (`jsconfig.json` path aliasing `@/*` to root). *Strictly NO TypeScript*.
- **Styling**: Tailwind CSS 3.4.17 with CSS custom properties, `tailwindcss-animate`, Vanilla CSS tokens in `styles/globals.css`.
- **Icons**: `lucide-react` (0.475.0). *No emoji icons in user interface*.
- **Academic Requirement Package**: `jquery` (3.7.1) in `package.json` intended for live AJAX registration username validation. *(Note: Backend route exists, but frontend integration in `SignupForm.jsx` is currently missing/pending).*
- **State Management**: Client React State (`useState`, `useRef`), `localStorage` persistence layer (`cardwise:user`, `cardwise:profile`, `cardwise:saved`, `cardwise:answers`), and Next.js server components with `searchParams`.

---

## 3. Verified Route Inventory & Current Implementation Status
| Route | Type | Purpose | Primary Component / Module | Verified Status |
|---|---|---|---|---|
| `/` | Static (SSG) | Editorial landing page with interactive canvas, dual story, curation standards, and personal story scroll | `app/page.jsx`, `components/Hero.jsx`, `components/HeroDotCanvas.jsx`, `components/DualStorySection.jsx`, `components/CurationStandards.jsx`, `components/PersonalStorySection.jsx`, `components/LearnPreview.jsx` | **IMPLEMENTED AND VERIFIED** (Build passes; internal blog link resolved to `/blog/credit-score`) |
| `/cards` | Dynamic (SSR) | Complete catalog of 31 verified cards with category filter rail | `app/cards/page.jsx`, `components/CardGrid.jsx`, `components/CardFilters.jsx`, `lib/cardUtils.js` | **IMPLEMENTED AND VERIFIED** |
| `/cards/[slug]` | Static (SSG 31 paths) | Detailed card breakdown, verified fees, "Why it fits you", "What to watch for", and official issuer link | `app/cards/[slug]/page.jsx`, `components/CreditCardVisual.jsx`, `components/CardTechnicalDetails.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/compare` | Dynamic (SSR) | Multi-card side-by-side comparison table (rewards, fees, lounges, forex) & reward calculator | `app/compare/page.jsx`, `components/ComparisonTable.jsx`, `components/RewardCalculator.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/onboarding` | Static (SSG) | 7-step comprehensive personalization flow (demographics, spending, priorities, fees, wallet) | `app/onboarding/page.jsx`, `components/OnboardingFlow.jsx` | **IMPLEMENTED AND VERIFIED** (Saves to `cardwise:profile` and routes to `/results`) |
| `/recommend` | Static (SSG) | Standalone 5-question quick recommendation quiz | `app/recommend/page.jsx`, `components/RecommendationQuiz.jsx`, `lib/recommendation.js` | **IMPLEMENTED AND VERIFIED** (Saves to `cardwise:answers` and cleanly renders via `/results?source=quiz`) |
| `/results` | Static (SSG/Client) | Tailored recommendation feed with explainable fit bullets and "What to watch for" | `app/results/page.jsx`, `lib/recommendation.js` | **IMPLEMENTED AND VERIFIED** (Supports both onboarding profile and standalone quick quiz answers) |
| `/profile` | Static (SSG/Client) | Personal profile settings, spending editor, portfolio manager, and data deletion | `app/profile/page.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/login` | Static (SSG) | Demo authentication login form with mock user support and local user fallback | `app/login/page.jsx`, `components/LoginForm.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/signup` | Static (SSG) | User registration form | `app/signup/page.jsx`, `components/SignupForm.jsx` | **PARTIALLY IMPLEMENTED** (Client validation works, but username field & jQuery AJAX call to `/api/check-username` are missing) |
| `/blog` | Static (SSG) | Educational credit guides and financial literacy index | `app/blog/page.jsx`, `data/blogs.json` | **IMPLEMENTED AND VERIFIED** (Icon map slug mismatch for first post) |
| `/blog/[slug]` | Static (SSG 5 paths) | Full editorial articles with reading time, embedded video explainer, and structured takeaways | `app/blog/[slug]/page.jsx`, `data/blogs.json` | **IMPLEMENTED AND VERIFIED** |
| `/privacy` | Static (SSG) | Transparent privacy policy and data minimization charter | `app/privacy/page.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/terms` | Static (SSG) | Non-commercial educational terms of service | `app/terms/page.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/cookies` | Static (SSG) | Minimal cookie and local storage disclosure | `app/cookies/page.jsx` | **IMPLEMENTED AND VERIFIED** |
| `/api/check-username` | Route Handler (GET) | Server-side validation handler returning `{ available, reason }` | `app/api/check-username/route.js`, `data/users.json` | **IMPLEMENTED AND VERIFIED** (Route works, but client invocation is missing) |

---

## 4. Card Database Foundation (`data/cards.json`)
- **Total Cards**: 31 real, verified cards issued by Indian scheduled commercial banks (HDFC, ICICI, SBI Card, Axis, Amex India, BOBCARD, IDFC FIRST, IndusInd, HSBC India, RBL, YES BANK).
- **Images**: Located in `public/credit-card-imgs/`. All 31 image assets exist and match cards (verified on disk).
- **Dimensions & Orientation**: Documented in `data/cards-dimensions.json` and matched in `CreditCardVisual.jsx`.
- **Attributes per Card**: `slug`, `name`, `issuer`, `network`, `image`, `orientation` ("horizontal" or "vertical"), `annualFee`, `feeWaiver`, `cashbackRate`, `rewardRate`, `loungeAccess`, `rewardCaps`, `exclusions`, `benefits`, `eligibility`, `incomeRequirement`, `forexBenefits`, `officialUrl`.
- **Zero Sponsored Links**: All `officialUrl` entries point to verified, direct bank HTTPS product pages with no affiliate or referral tags.

---

## 5. Recommendation & Math Engine (`lib/recommendation.js`)
1. **Eligibility Gate (`checkEligibility`)**:
   - Minimum age 18 (21 for specific premium products).
   - Minimum income tiers (Infinia, Magnus, Diners Club Black Metal, HDFC BizBlack, HSBC Premier require ₹25L+ / invitation).
   - Commercial/Business check (HDFC BizBlack restricted to business owners / self-employed).
   - Student restrictions (locks high-salary cards, allows only entry cards like Amazon Pay ICICI, Scapia, Kiwi, IDFC Power+).
2. **Wallet Synergy & Anti-Duplication (`analyzeExistingWallet`)**:
   - Flags category overlaps (e.g., holding Amazon Pay ICICI reduces priority for Flipkart Axis).
   - Generates constructive "Wallet context" advice without pushing duplicate cards.
3. **Suitability Rationale (`evaluateFit`)**:
   - **`whyItFitsYou`**: 2–3 personalized, human second-person bullet points based on category monthly spend thresholds, reward style, and fee comfort.
   - **`whatToWatchFor`**: Verified annual renewal fees, waiver thresholds, monthly reward caps, and merchant exclusions.
   - **No Arbitrary Precision**: Prohibits fake numerical scores like "87% match".
4. **Integration Discrepancy**:
   - `getProfileRecommendations` takes full structured `profile` (produced by `/onboarding`).
   - `getRecommendations` takes 5-question `answers` (produced by `/recommend`), but `/results` currently only reads `cardwise:profile`, ignoring `cardwise:answers`.

---

## 6. Academic Assignment Compliance Status
- **Assignment 1 (Semantic HTML & CSS Architecture)**: **IMPLEMENTED AND VERIFIED**.
  - HTML5 landmarks (`<main id="main">`, `<header>`, `<nav>`, `<footer>`, `<article>`, `<dl>`, `<table>`, `<iframe>`).
  - External stylesheets (`styles/globals.css`, `styles/learn.css`).
  - Scoped internal CSS (`<style jsx>` in `components/LearnPreview.jsx`).
  - Dynamic inline CSS (`style={{ width: ... }}` in progress bars and scroll effects).
- **Assignment 2 (Form Validation & jQuery AJAX)**: **PARTIALLY IMPLEMENTED / BROKEN**.
  - Client-side validation in `components/SignupForm.jsx` validates full name, email regex, age (18+), password complexity, and confirm password matching with accessible DOM error focus.
  - **DEFECT**: `SignupForm.jsx` lacks a username input field and does not make the required jQuery `$.ajax()` request to `/api/check-username`. The backend route `/api/check-username/route.js` is fully implemented and tested, but orphaned on the client.
- **Assignment 3 (React Functional Architecture)**: **IMPLEMENTED AND VERIFIED**.
  - React functional components throughout, structured hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`), and list rendering (`.map`).
- **Assignment 4 (Next.js App Router & SSG)**: **IMPLEMENTED AND VERIFIED**.
  - Next.js 15 App Router, dynamic routes with `generateStaticParams()` (`/cards/[slug]`, `/blog/[slug]`), static JSON datasets (`cards.json`, `blogs.json`, `users.json`), server route handler (`/api/check-username/route.js`).
- **Assignment 5 (Complete Mini-Project Integration)**: **PARTIALLY IMPLEMENTED**.
  - Discovery, catalog, detail, comparison, onboarding, and profile are functional.
  - User journey breaks between `/recommend` and `/results`.
  - Navbar does not reflect authenticated session.

---

## 7. Component Map & Orphan Analysis
- **Active Core Components (24)**:
  `Hero`, `HeroDotCanvas`, `DualStorySection`, `CurationStandards`, `PersonalStorySection`, `LearnPreview`, `Navbar`, `Footer`, `CookieBanner`, `CardGrid`, `CardFilters`, `CreditCard`, `CreditCardVisual`, `CardTechnicalDetails`, `ComparisonTable`, `RewardCalculator`, `SaveCardButton`, `OnboardingFlow`, `RecommendationQuiz`, `LoginForm`, `SignupForm`, `Reveal`, `VisualCard`, `VisualGrid`.
- **Active Visual Sub-Components (6)**:
  `CurationFilterVisual`, `ExpenseStreamVisual`, `FeeBreakEvenVisual`, `PointsConverterVisual`, `PerksMosaicVisual`, `ArrowButton`.
- **Orphaned / Unused Components (21)**:
  `ActivityTicker.jsx`, `Card31Sequence.jsx`, `ComparePreview.jsx`, `DualWorkflow.jsx`, `EditorialBanner.jsx`, `ExploreCategories.jsx`, `FeatureGrid.jsx`, `FinalCTA.jsx`, `FindYourCardPreview.jsx`, `HowItWorks.jsx`, `InteractiveSpendMatch.jsx`, `IssuerNetwork.jsx`, `MatchScore.jsx` (displays fake % score), `PersonalFit.jsx`, `PopularCards.jsx`, `ProductVideoDemo.jsx`, `RewardCalculatorPreview.jsx`, `SpendLimitWidget.jsx`, `StandardsGrid.jsx`, `VerticalCardStream.jsx`, `VideoSection.jsx` (and visual sub-components `PersonalMatchingVisual.jsx`, `MediaContainer.jsx`, `VideoVisual.jsx`).
- **Duplicate Utility**:
  `lib/filterCards.js` is an unreferenced duplicate of `lib/cardUtils.js`.

---

## 8. Verified Invariants & Rules
1. **Never convert to TypeScript**: Maintain pure JavaScript (`.js`, `.jsx`).
2. **Restore jQuery AJAX in SignupForm**: Connect `SignupForm.jsx` username field via jQuery `$.ajax()` to `/api/check-username` for Assignment 2 compliance.
3. **Never introduce fake cards or affiliate links**: All 31 cards exist in `data/cards.json` and point directly to verified bank HTTPS links.
4. **Never show arbitrary match scores**: Prohibit fake match percentages (retire or update `MatchScore.jsx`).
5. **Zero Sensitive Financial Data**: No collection of PAN, Aadhaar, CVV, OTP, or netbanking credentials.

