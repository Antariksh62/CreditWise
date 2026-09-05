# CardWise — Next.js handoff bundle

Everything in this folder is real, working application code for **CardWise**, a
credit-card recommendation and comparison site. It targets **Next.js (App
Router) + React + JavaScript + Tailwind CSS + shadcn/ui + Lucide React + jQuery
(AJAX) + JSON data files**.

This bundle was produced outside a Next.js runtime, so nothing here has been
executed. Follow the setup below and it drops into a fresh `create-next-app`
project as-is.

---

## 1. Create the Next.js project

```bash
npx create-next-app@latest cardwise
```

Answer the prompts exactly like this:

| Prompt | Answer |
| --- | --- |
| TypeScript? | **No** (the bundle is JavaScript/JSX) |
| ESLint? | Yes |
| Tailwind CSS? | **Yes** |
| `src/` directory? | **No** (paths below assume `app/` at the root) |
| App Router? | **Yes** |
| Turbopack? | Yes |
| Import alias? | No (the bundle uses relative imports) |

Then install the remaining dependencies:

```bash
cd cardwise
npm install jquery lucide-react
npm install -D tailwindcss-animate
npx shadcn@latest init      # accept the defaults; needed for the shadcn/ui requirement
```

`create-next-app` may scaffold Tailwind v4. This bundle is written for
**Tailwind v3**, which is what `tailwind.config.js` expects. If you get v4,
pin v3:

```bash
npm install -D tailwindcss@^3 postcss autoprefixer
```

---

## 2. Copy the files

Copy each file from this bundle to the matching path in the new project,
overwriting whatever `create-next-app` generated.

| Bundle file | Destination in the Next.js project |
| --- | --- |
| `README.md` | `README.md` |
| `tailwind.config.js` | `tailwind.config.js` |
| `styles/globals.css` | `styles/globals.css` (delete `app/globals.css`) |
| `styles/learn.css` | `styles/learn.css` |
| `data/cards.json` | `data/cards.json` |
| `data/blogs.json` | `data/blogs.json` |
| `data/users.json` | `data/users.json` |
| `lib/recommendation.js` | `lib/recommendation.js` |
| `lib/rewardCalculator.js` | `lib/rewardCalculator.js` |
| `components/*.jsx` | `components/*.jsx` |
| `app/**` | `app/**` |

Then:

```bash
npm run dev
```

Open <http://localhost:3000>.

> **Note on card and blog images.** `data/cards.json` and `data/blogs.json`
> carry `image` paths such as `/cards/hdfc-millennia.png`. The UI never loads
> them — every card is drawn by the CSS/SVG `CreditCardVisual` component and
> every article uses a CSS abstract panel. The fields are there so you can wire
> up real artwork later without touching the components.

---

## 3. What is in the bundle

### Design system

- `tailwind.config.js` — semantic colour tokens, the type scale, the 8px
  spacing rhythm, the 1200px container and the motion easing curve.
- `styles/globals.css` — CSS custom properties for every token, base element
  styling, the reusable `.cw-*` component classes (buttons, cards, inputs,
  badges), the scroll-reveal motion system and a full
  `prefers-reduced-motion` bypass.
- `styles/learn.css` — a second, route-scoped stylesheet for article typography
  and the responsive video embed.

Direction: roughly **75% Stripe** (hairline rails, oversized tight-tracked
display type, asymmetric splits, restraint) and **25% Ramp** (the concrete card
artifact, the spend-limit data widget, the mega-menu icon grid), over an
original CardWise identity — warm white `#FBFAF8`, near-black `#111211`, deep
emerald `#0F5741`. No gradient mesh, no glow, no floating animation.

### Data

| File | Contents |
| --- | --- |
| `data/cards.json` | 10 Indian credit cards with fees, rates, lounge access, benefits, eligibility and tags |
| `data/blogs.json` | 5 educational articles, each with a body and a YouTube embed URL |
| `data/users.json` | 6 demo users for sign-in and the username availability check |

### Logic

- `lib/recommendation.js` — the rule-based scoring engine. Five questions award
  points across five dimensions (priority 30, spend area 25, fees 20, travel 15,
  earn rate 10 — 100 total). Every rule is an explicit, commented function and
  the engine returns a per-dimension breakdown plus a plain-English explanation.
  **No machine learning is involved** and you can walk a marker through it line
  by line.
- `lib/rewardCalculator.js` — converts a monthly spending profile into estimated
  annual rewards for a card, net of the annual fee, using a documented
  category-multiplier table.

### Components

| Component | Role |
| --- | --- |
| `Navbar.jsx` | Sticky header, mega menu, mobile panel |
| `Footer.jsx` | Four-column link rail and legal strip |
| `Hero.jsx` | Homepage hero with the card artifact |
| `CreditCardVisual.jsx` | The original CSS/SVG credit card (engraved arcs, chip, four tints) |
| `SpendLimitWidget.jsx` | The Ramp-style data widget attached to the hero card |
| `CreditCard.jsx` | Catalogue tile — visual, figures, two actions, bookmark |
| `CardGrid.jsx` | Responsive grid with staggered reveal |
| `SaveCardButton.jsx` | Subtle bookmark toggle, persists to localStorage |
| `SectionHeading.jsx` | The single heading treatment used by every section |
| `Reveal.jsx` | IntersectionObserver scroll-reveal wrapper |
| `PopularCards.jsx` | Homepage: three featured cards |
| `HowItWorks.jsx` | Homepage: three numbered steps |
| `FindYourCardPreview.jsx` | Homepage: static preview of the real quiz |
| `ComparePreview.jsx` | Homepage: semantic comparison `<table>` |
| `RewardCalculatorPreview.jsx` | Homepage: display-only calculation |
| `ExploreCategories.jsx` | Homepage: five category-filter tiles |
| `LearnPreview.jsx` | Homepage: three article cards |
| `Disclaimer.jsx` | Homepage: honesty band (carries the internal CSS) |
| `CardFilters.jsx` | `?category=` filter rail for `/cards` |
| `RecommendationQuiz.jsx` | The working five-step questionnaire |
| `RewardCalculator.jsx` | The working interactive calculator |
| `ComparisonTable.jsx` | Pick up to three cards, compare every field |
| `SignupForm.jsx` | Validation + the jQuery AJAX username check |
| `LoginForm.jsx` | Demo sign-in against `users.json` |
| `MatchScore.jsx` | SVG score ring for the results page |

### Routes

```text
app/layout.jsx                    Root layout: Inter, skip link, Navbar, Footer
app/page.jsx                      Homepage
app/not-found.jsx                 404
app/cards/page.jsx                Catalogue, filtered by ?category=
app/cards/[slug]/page.jsx         Card detail — DYNAMIC ROUTE
app/recommend/page.jsx            The questionnaire
app/results/page.jsx              Ranked matches with explanations
app/compare/page.jsx              Comparison table + reward calculator
app/blog/page.jsx                 Learn index (5 articles)
app/blog/[slug]/page.jsx          Article — DYNAMIC ROUTE + embedded media
app/login/page.jsx                Demo sign-in
app/signup/page.jsx               Demo registration
app/profile/page.jsx              Saved cards
app/api/check-username/route.js   API ROUTE consumed by jQuery AJAX
```

Homepage section order, as approved:

```text
Navbar → Hero → Popular Cards → How CardWise Works → Find Your Card preview
→ Compare preview → Reward Calculator preview → Explore by What Matters
→ Learn → Disclaimer → Footer
```

---

## 4. Assignment 1–5 traceability

Every requirement, the file that satisfies it, and the sentence to say in the
viva.

### Assignment 1 — HTML5 semantics, the three CSS types, embedded media

| Requirement | File | What to say |
| --- | --- | --- |
| Semantic HTML5 landmarks | `app/layout.jsx`, `components/Navbar.jsx`, `components/Footer.jsx` | "`<header>`, `<nav>`, `<main>`, `<footer>` are real landmarks, plus a skip link to `#main`." |
| Semantic sectioning and headings | `app/page.jsx` and every section component | "Each homepage band is a `<section>` with exactly one `<h2>`; the page has a single `<h1>` in the hero." |
| Semantic table | `components/ComparePreview.jsx`, `components/ComparisonTable.jsx` | "A real `<table>` with `<caption>`, `<thead>`, `<tbody>` and `scope` on every header cell — not a grid of divs." |
| Lists and definition lists | `components/CreditCard.jsx` (`<dl>`), `app/cards/[slug]/page.jsx` | "Key figures are a description list, because they are name/value pairs." |
| **External CSS** | `styles/globals.css`, `styles/learn.css` | "Two external stylesheets: the global design system, and a route-scoped one imported only by the article page." |
| **Internal CSS** | `components/Disclaimer.jsx` | "A scoped `<style jsx>` block for a one-off band nothing else shares." |
| **Inline CSS** | `components/RewardCalculatorPreview.jsx`, `RewardCalculator.jsx`, `RecommendationQuiz.jsx`, `MatchScore.jsx` | "Inline styles only where the value is computed at runtime — bar widths, progress width, the SVG dash offset." |
| Embedded media | `app/blog/[slug]/page.jsx` + `data/blogs.json` | "Each article embeds an educational video in a responsive 16:9 `<iframe>` wrapper." |
| Accessible forms | `components/SignupForm.jsx`, `LoginForm.jsx` | "Every input has a `<label htmlFor>`, errors use `role='alert'` and `aria-describedby`." |

### Assignment 2 — JavaScript, DOM and form validation

| Requirement | File | What to say |
| --- | --- | --- |
| Client-side form validation | `components/SignupForm.jsx` | "Six fields validated in plain JS: required, username pattern, email pattern, age 18–100, password length plus a digit, and a confirm match." |
| Error display and focus management | `components/SignupForm.jsx` | "Invalid fields get `.cw-input-invalid` and an inline message; focus jumps to the first invalid field on submit." |
| Event handling and state | `components/RecommendationQuiz.jsx` | "Step navigation, radio selection and a debounce timer are all handled with React state and events." |
| DOM/browser APIs | `components/Reveal.jsx`, `SaveCardButton.jsx` | "IntersectionObserver drives the scroll reveal; localStorage persists saved cards." |
| Computation | `lib/rewardCalculator.js` | "Live recalculation on every keystroke via `useMemo`." |

### Assignment 3 — jQuery and AJAX

| Requirement | File | What to say |
| --- | --- | --- |
| jQuery loaded correctly | `components/SignupForm.jsx` | "jQuery is imported dynamically inside `useEffect`, because it needs `window` and must not run during server rendering." |
| `$.ajax()` request | `components/SignupForm.jsx` → `checkUsername()` | "A GET through `$.ajax()` with `success` and `error` callbacks." |
| Live server response in the UI | `components/SignupForm.jsx` | "The result drives a spinner / tick / cross and an `aria-live` message; the call is debounced 400ms so it does not fire per keystroke." |
| Endpoint it talks to | `app/api/check-username/route.js` | "The route reads `users.json`, re-validates the input server-side, and returns `{ username, available, reason }`." |

### Assignment 4 — Next.js concepts

| Requirement | File | What to say |
| --- | --- | --- |
| File-based routing | `app/**` | "Every folder under `app/` with a `page.jsx` is a route; no route table to maintain." |
| Root layout and shared chrome | `app/layout.jsx` | "Navbar and Footer live in the layout, so they persist across navigation." |
| Dynamic routes | `app/cards/[slug]/page.jsx`, `app/blog/[slug]/page.jsx` | "`[slug]` gives one page per card and per article from the same component." |
| Static generation | `generateStaticParams()` in both dynamic routes | "All ten card pages and five article pages are pre-rendered at build time." |
| Metadata / SEO | `generateMetadata()` in both, plus `metadata` on every page | "Each route has its own title and description, with a template in the root layout." |
| Server vs client components | Homepage sections (server) vs `"use client"` files | "Most of the site ships zero JavaScript; only the quiz, calculator, forms and toggles are client components." |
| API route handler | `app/api/check-username/route.js` | "A GET handler under `app/api/`, which is the App Router's server endpoint convention." |
| Query-string state | `app/cards/page.jsx`, `app/compare/page.jsx` | "Filters and comparison selections live in the URL, so views are shareable and the back button works." |
| Font optimisation | `app/layout.jsx` | "Inter via `next/font/google` — self-hosted, no layout shift." |
| Not-found handling | `app/not-found.jsx` + `notFound()` | "An unknown slug renders the 404 page." |

### Assignment 5 — Integration, data and documentation

| Requirement | File | What to say |
| --- | --- | --- |
| JSON as the data layer | `data/cards.json`, `blogs.json`, `users.json` | "Three JSON files are the single source of truth; no component hardcodes card data." |
| Recommendation feature | `lib/recommendation.js` + `/recommend` + `/results` | "A transparent weighted scoring system, normalised to a 0–100 percentage, that explains every result." |
| Comparison feature | `components/ComparisonTable.jsx` + `/compare` | "Up to three cards across twelve fields, deep-linkable via `?cards=`." |
| Calculator feature | `lib/rewardCalculator.js` + `/compare` | "Monthly spend in, annual value out, net of the fee, plus a ranking of the whole catalogue." |
| Authentication | `LoginForm.jsx`, `SignupForm.jsx`, `/profile` | "Demo auth against `users.json` with localStorage persistence — clearly labelled as not real authentication." |
| Content section | `data/blogs.json` + `/blog` | "Five original educational articles with embedded video." |
| Accessibility | throughout | "Skip link, visible focus rings, labelled controls, `aria-live` on async results, and a complete `prefers-reduced-motion` bypass." |
| Honest scope statement | `components/Disclaimer.jsx` | "The homepage states plainly that this is a student project with sample data and no affiliate relationships." |

---

## 5. Known limitations (state these rather than hide them)

- **No real authentication.** Passwords are never checked or stored. A real
  build needs a backend, hashed credentials and server sessions.
- **Sample data.** The ten cards are realistic but not live offers.
- **Calculator is an estimate.** It ignores monthly caps, category exclusions
  and variable point valuations, and values a reward point at a flat ₹0.25.
- **Saved cards are per-browser.** They live in localStorage, not a database.
- **Nothing here has been executed.** This bundle was authored in an
  environment that cannot run Next.js. Run `npm run dev` after copying and fix
  any environment-specific issues (most likely a Tailwind v3 vs v4 mismatch).
