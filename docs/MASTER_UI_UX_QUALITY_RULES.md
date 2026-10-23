# CreditWise — Master UI/UX Quality Rules

> **CRITICAL PERSISTENT RULE**: Treat everything in this document as persistent product and design rules for all CreditWise development.
> The goal is **NOT** to make CreditWise look like a generic AI-generated SaaS application.
> The goal is to create a polished, intentional, modern financial-product experience with excellent UI/UX.
> **DESIGN QUALITY IS A REQUIREMENT, NOT A POLISHING STEP.**

---

## 1. Core Aesthetic Philosophy

The application must feel:
- **Considered**: Every layout choice, metric, and element has a clear editorial purpose.
- **Restrained**: No decorative bloat; beauty emerges from proportion, typography, and whitespace.
- **Premium**: High-contrast, tactile, structured like a Swiss or Scandinavian architectural publication.
- **Editorial**: Grounded in clear typographic hierarchy, quiet confidence, and thoughtful narrative flow.
- **Trustworthy**: Honest financial advice, clear disclaimers, zero marketing hype.
- **Spacious**: Whitespace is deliberate breathing room, not wasted space to be filled.
- **Intentional**: Every interaction answers an explicit user need.
- **Easy to understand**: Plain language, digestible metrics in real rupees.

It must **NOT** feel:
- ❌ Vibe-coded
- ❌ Template-generated
- ❌ AI-generated
- ❌ Like a generic SaaS dashboard
- ❌ Like a hackathon landing-page template
- ❌ Overloaded with cards
- ❌ Overloaded with rounded containers
- ❌ Overloaded with gradients
- ❌ Overloaded with animations

---

## 2. Visual Rules & Prohibitions

### Prohibited Visual Elements (Zero Tolerance)
Do **NOT** use:
- ❌ Purple gradients or generic blue/purple AI gradients
- ❌ Excessive glassmorphism or excessive blur
- ❌ Pill-shaped UI everywhere
- ❌ Giant rounded cards containing smaller rounded cards
- ❌ Unnecessary heavy drop shadows
- ❌ Fake statistics, fake metrics, or fake user counters
- ❌ Fake testimonials, fake customer reviews, or fake star ratings
- ❌ Fake partner or bank logos
- ❌ Emoji icons in product UI
- ❌ Decorative UI that serves no informational or interactive purpose
- ❌ Excessive badges, excessive chips, or nested status pills
- ❌ Excessive floating elements or detached particles
- ❌ Huge wall-of-text blocks
- ❌ Vague marketing copy or meaningless section headings
- ❌ Unnecessary animations, bouncing, spinning, or floating
- ❌ Scroll-jacking (native browser scrolling must remain 100% intact)
- ❌ Excessive parallax or giant glowing effects

### Banned Anti-Pattern
**Avoid the classic AI-generated SaaS visual loop:**
```
big rounded container
  → smaller rounded container
    → smaller rounded container
      → pills
        → badges
          → icons
            → gradient
```
This is exactly the type of generic SaaS visual language CreditWise must avoid.

---

## 3. Typography Rules

Use typography deliberately.

### Guidelines:
- **Strong editorial hierarchy**: Large, controlled headlines balanced by quiet, readable body text.
- **Comfortable line lengths**: Never stretch prose across 100% of a wide screen; clamp to `60-72ch` max.
- **Restrained weights**: Do not make everything bold. Use standard regular/medium weights for body, reserve bold/semibold for structural headings.
- **Controlled headline scale**: Do not make every heading gigantic. Scale proportionally across viewports.
- **Clear contrast**: Crisp black (`#0D0D0D` / `neutral-950`) and dark text on clean white/light neutral surfaces; muted text (`#616161` / `neutral-500`) for secondary context with accessible contrast ratios.
- **Generous whitespace**: Let headings and body copy breathe with generous vertical margins.

---

## 4. Spacing & Composition

- **Whitespace is an active design element**: Do not fill empty space just because it exists.
- **No cosmetic filler**: Do not add elements simply to make a section look "complete."
- **Consistent grid & margins**: Respect the wide editorial rail (80–90px on desktop, 16–24px on mobile) with disciplined 2-column, 3-column, or asymmetrical layouts.

---

## 5. Content & Voice

### Editorial Voice:
- Use concise, human, grounded language.
- Every piece of copy should communicate something useful.
- The product optimizes **existing** spending. It should **never** encourage people to spend more.

### Banned Generic AI Copy:
- ❌ *"Unlock your financial potential."*
- ❌ *"Experience smarter financial freedom."*
- ❌ *"Revolutionize your spending."*
- ❌ *"Take control of your financial journey."*
- ❌ *"Maximize your purchasing power."*

### Approved Product Copy:
- ✔️ *"Don't spend more. Get more back."*
- ✔️ *"What if your expenses could earn too?"*
- ✔️ *"Don't change how you spend. Change how you're rewarded."*
- ✔️ *"Your spending is personal. Your card should be too."*
- ✔️ *"Find the card that rewards your life."*
- ✔️ *"We don't list every card. We list the cards worth considering."*

---

## 6. Interaction & Motion

Animations should always have an explicit functional reason.

### Preferred:
- Subtle opacity and translate transitions (8–16px travel, 200–400ms duration).
- Pointer-reactive details (subtle cursor resistance, crisp border hover states).
- Restrained viewport reveal animations (`cw-reveal`).
- Natural hover states with smooth transitions.
- Predictable, snappy state changes.

### Avoid:
- ❌ Dramatic entrance zooms, spins, or bounces.
- ❌ Floating or oscillating elements.
- ❌ Exaggerated scale effects.
- ❌ Animating every element independently.
- ❌ Scroll-jacking or hijacking the user's mouse wheel.

---

## 7. Accessibility (A11y)

Good UI/UX requires accessibility at every touchpoint:
- **Keyboard Navigation**: All interactive elements (links, buttons, disclosures, form inputs) must be focusable and operable via Tab, Enter, and Space.
- **Visible Focus States**: Unambiguous, high-contrast `:focus-visible` outlines.
- **Sufficient Contrast**: All text and critical UI elements must pass WCAG AA contrast (4.5:1 for normal text, 3:1 for large text).
- **Semantic HTML**: Proper `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, and `<input>` elements.
- **Meaningful Alt Text**: Descriptive `alt` attributes on all card images and visuals; empty `alt=""` or `aria-hidden="true"` only for purely decorative elements.
- **Reduced-Motion Support**: Respect `@media (prefers-reduced-motion: reduce)` by disabling transitions, translations, and non-essential movement.
- **Touch Targets**: Minimum 44×44px interactive touch targets on mobile viewports.

---

## 8. Responsiveness

Do not treat mobile as an afterthought:
- **Desktop composition is the primary reference**, but tablet and mobile layouts must be intentionally composed rather than simply stacked.
- **Preserve generous whitespace**: Maintain comfortable padding across all screen sizes.
- **Stack visual cards with intent**: Ensure card visual media and value breakdowns remain legible, un-clipped, and balanced.
- **Graceful degradation of cursor interactions**: Touch devices fall back seamlessly without layout shift or stuck hover states.

---

## 9. Decision Checklist

Before adding **any** component, ask:
> *"Does this improve the user's understanding or interaction?"*
> If not, **do not add it**.

Before adding **any** visual effect, ask:
> *"Would a strong product designer actually use this here?"*
> If not, **don't add it**.

**Core mandates:**
- Do not optimize for quantity of UI. Optimize for quality of UI.
- Do not change existing sections unnecessarily. Preserve strong existing work.
- CreditWise should feel like a real product designed by a strong product designer, not a website assembled by an AI.
