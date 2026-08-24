# CardWise — Design System + Homepage (Phase 1 & 2)

## Reference analysis

**Stripe (primary, ~75%)**
- Tight, confident grotesk type. Huge hero headline, second line in a muted tone — hierarchy through color, not size.
- Generous whitespace with a hard left content rail; visible vertical grid lines framing the page.
- Small, dense, high-contrast nav — 5 text links, one ghost button, one solid button. No clutter.
- Product UI shown as real interface panels inside marketing sections, not decorative art.
- Restrained motion: fast entrances, hover states, no ambient movement.

**Ramp (secondary, ~25%)**
- Neutral near-white canvas, sharp black CTA, small icon-led menu rows with label + one-line descriptor.
- Product artifact (the card) centered as hero object with a real data widget attached — spend / limit bar.
- Very quiet color: one accent, everything else grayscale.

**CardWise originality**: warm-neutral canvas instead of Stripe's cool white, emerald accent instead of indigo/blurple, a proprietary card visual built from layered flat panels and fine engraved line work (no iridescent gradient mesh), left-aligned editorial rhythm with numbered section markers, and its own copy and structure.

## Design system

**Type** — Inter (single family, loaded via `<link>` in the root route).
- Display 60/64px, -0.03em tracking, weight 600
- H2 36px, H3 20px, body 16px, meta/label 13px uppercase 0.08em
- Muted second-line headline treatment in the hero

**Color** (oklch tokens in `src/styles.css`)
- background warm white `#FBFAF8`, surface `#FFFFFF`, subtle section `#F4F3F0`
- foreground near-black `#111211`, muted gray `#6B6F6C`
- accent deep emerald `#0F5741`, accent-soft wash for badges only
- border hairline `#E5E3DE`
- Accent used only on: primary button, active states, match scores, links.

**Spacing / grid** — 8px base; 1200px max container; sections 96px desktop / 64px mobile; a full-height hairline rail on both container edges (Stripe cue). 12-col grid, 24px gutters.

**Buttons** — 8px radius. Primary: emerald fill, white text. Secondary: white with hairline border. Tertiary: text link with arrow that nudges 3px on hover. No pills, no shadows beyond a 1px hairline + tiny lift.

**Card style** — 12px radius, white surface, hairline border, no drop shadow at rest; on hover the border darkens and the card lifts 2px over 150ms. The credit-card graphic itself: 16:10 flat panel, engraved arc lines, bank wordmark, chip, category tint (emerald / graphite / sand / ink).

**Motion** — CSS + a small `useInView` hook; 150–350ms, `cubic-bezier(.2,.6,.2,1)`, 8–16px translate max. Hero staggers once on load; sections reveal once on scroll; everything else is interaction-driven (hover, filter reflow, counter tweens). Full `prefers-reduced-motion` bypass.

## Homepage build (`src/routes/index.tsx`)

Sections, in order:
1. **Navbar** — CARDWISE / Cards / Compare / Learn, then Find My Card (primary), Log in, Sign up. Sheet-based mobile menu. Links point to routes built in Phase 4 (placeholders stubbed so nothing 404s).
2. **Hero** — headline + support copy + two CTAs on the left rail; CardWise card visual on the right with a small attached "rewards this year" data widget (Ramp cue).
3. **Popular cards** — 4 real `CreditCard` components fed from `src/data/cards.json`, each with View card / Add to compare.
4. **How CardWise works** — 01/02/03, three columns, type-only.
5. **Find your card** — live preview of the recommend UI: the "What matters most to you?" question with selectable chips and a progress bar; selecting a chip animates the bar.
6. **Compare** — miniature comparison table (real semantic `<table>`), two cards side by side.
7. **Reward calculator** — monthly spend slider with a smoothly tweened annual-rewards figure.
8. **Explore by what matters** — six category tiles.
9. **Learn** — three article cards from `src/data/blogs.json`.
10. **Disclaimer** band, then a minimal 3-column footer.

## Technical notes

- Stack is **TanStack Start (React + Vite)**, not Next.js — routes live in `src/routes/`, dynamic routes are `cards.$slug.tsx` / `blog.$slug.tsx`, and the API endpoint is a server route at `src/routes/api/check-username.ts`. This satisfies the Assignment 4 requirements (file-based routing, dynamic routes, JSON data, API route, reusable components) on the framework this project runs on.
- Data files created now: `src/data/cards.json` (10 cards, full field set from the spec), `src/data/blogs.json` (5 articles), `src/data/users.json` (demo users for the availability check).
- Components created now: `Navbar`, `Footer`, `CreditCardVisual`, `CreditCard`, `SectionHeading`, `Button` variants, plus the homepage section components.
- Assignment 1 CSS spread is handled deliberately: Tailwind + tokens as the external stylesheet, one scoped `<style>` block (internal CSS) on the Learn/disclaimer area, and a couple of genuine inline `style` uses where a computed value is required (e.g. the calculator bar width). No CSS demo page.
- No Cloud/Supabase, no ML, no chatbot. Auth in Phase 4 will be localStorage-based demo auth with the jQuery+AJAX username check kept intact.
- SEO head metadata on the index route.

## Scope of this phase

Homepage + design system + data files only. After it renders I will walk through the design decisions and stop for your approval before building the Card Explorer, details, recommendation flow, comparison, calculator, blog, and auth.
