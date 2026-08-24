# CardWise — Next.js Handoff Bundle

Next.js cannot run in this environment, so instead of building the app here I'll produce a complete reference bundle you copy into a local Next.js project. Everything framework-agnostic (design tokens, data, component code, business logic) is written as real, working files — not prose descriptions.

## What gets produced

All output lands in a `cardwise-handoff/` folder at the project root.

### 1. Setup guide — `README.md`

- Exact commands: `npx create-next-app@latest cardwise` (App Router, JavaScript, Tailwind), `npx shadcn@latest init`, plus `lucide-react` and `jquery`.
- File-by-file map: which bundle file goes to which path in the Next.js project.
- Assignment 1–5 traceability table: each requirement, the file that satisfies it, and the line to say in your viva.

### 2. Design system — `styles/globals.css` + `tailwind.config.js`

Ready to paste over the create-next-app defaults.

- Tokens: background `#FBFAF8`, surface `#FFFFFF`, subtle `#F4F3F0`, foreground `#111211`, muted `#6B6F6C`, accent emerald `#0F5741`, border `#E5E3DE`.
- Inter via `next/font`, with the type scale (display 60px/-0.03em, H2 36px, H3 20px, body 16px, label 13px uppercase).
- 8px spacing scale, 1200px container, 12-col grid.
- Button (8px radius) and card (12px radius, hairline border, 2px hover lift) base classes.
- Keyframes for the reveal/entrance motion, all wrapped in a `prefers-reduced-motion` bypass.

### 3. Data — `data/cards.json`, `data/blogs.json`, `data/users.json`

- 10 credit cards with the full field set you specified (id, slug, name, bank, image, category, annualFee, joiningFee, cashbackRate, rewardRate, loungeAccess, fuelBenefits, diningBenefits, onlineShoppingBenefits, eligibility, incomeRequirement, benefits, tags, description). Realistic Indian-market demo data, clearly labelled as demo.
- 5 blog articles with title, slug, summary, category, image, readTime, and body content.
- 6 demo users for the username-availability check.

### 4. Logic — `lib/recommendation.js`, `lib/rewardCalculator.js`

- Transparent rule-based scoring: weighted points per answer across cashback / travel / rewards / fee-sensitivity / spend-band / travel-frequency, normalised to a 0–100 match percentage, returning a per-dimension breakdown and a plain-English "why this matches" string. Written to be explainable in a viva — no ML, heavily commented.
- Reward calculator: per-category monthly spend in, annual spend and estimated annual rewards out.

### 5. Components — `components/*.jsx`

Real JSX files, Next.js App Router compatible (`"use client"` where state is used):

`Navbar`, `Footer`, `Hero`, `CreditCardVisual`, `CreditCard`, `CardGrid`, `SectionHeading`, `Button`, plus the homepage sections: `PopularCards`, `HowItWorks`, `FindYourCardPreview`, `ComparePreview`, `RewardCalculatorPreview`, `ExploreCategories`, `LearnPreview`, `Disclaimer`.

The credit-card visual is original: a 16:10 flat panel with fine engraved arc line work, chip, bank wordmark, and a per-category tint (emerald / graphite / sand / ink). No gradient mesh, no glow.

### 6. Homepage — `app/page.jsx` + `app/layout.jsx`

The full approved section order: Navbar → Hero → Popular Cards → How CardWise Works → Find Your Card preview → Compare preview → Reward Calculator preview → Explore by What Matters → Learn → Disclaimer → Footer.

Incorporating your refinements:
- Save action on card tiles is a subtle bookmark icon, not a third button.
- Category tiles link to `/cards?category=travel` etc.
- Compare preview is a real semantic `<table>` with card names linking to `/cards/[slug]`.
- Calculator preview is display-only with a tweened number and a `Calculate your rewards →` CTA.

### 7. Route stubs — `app/**`

Empty-but-wired files so the routing structure exists from day one and Phase 4 is pure fill-in:

```text
app/page.jsx
app/cards/page.jsx
app/cards/[slug]/page.jsx
app/recommend/page.jsx
app/results/page.jsx
app/compare/page.jsx
app/blog/page.jsx
app/blog/[slug]/page.jsx
app/login/page.jsx
app/signup/page.jsx
app/profile/page.jsx
app/api/check-username/route.js
```

`app/api/check-username/route.js` is written in full — it reads `data/users.json` and returns `{ available: boolean }`, ready for the jQuery AJAX call.

### 8. Assignment CSS examples — documented placements

The three CSS types, placed naturally rather than in a demo page:
- **External** — `globals.css` plus a dedicated `styles/learn.css` imported by the Learn page.
- **Internal** — a scoped `<style jsx>` block on the disclaimer band.
- **Inline** — genuine computed-value uses (calculator bar width, match-score ring).

Each is flagged with a short comment naming the assignment requirement it satisfies.

## Scope

Handoff bundle only — no app code runs in this project, and `src/routes/index.tsx` stays as-is. Phase 4 features are stubbed, not implemented; you build those in your local Next.js project (I can write those specs too on request).
