/** CardWise — Tailwind CSS v3 configuration
 *  Design system: Stripe-inspired discipline (~75%) + Ramp fintech character (~25%)
 *  Every colour below is a semantic token. Never hardcode hex values in components.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    // 1200px max content width, matching the Stripe-style centred rail.
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // --- CardWise palette -------------------------------------------
        background: "hsl(var(--background))", // warm white  #FBFAF8
        surface: "hsl(var(--surface))", // pure white  #FFFFFF
        subtle: "hsl(var(--subtle))", // section tint #F4F3F0
        foreground: "hsl(var(--foreground))", // near-black  #111211
        muted: "hsl(var(--muted))", // grey text   #6B6F6C
        accent: {
          DEFAULT: "hsl(var(--accent))", // emerald     #0F5741
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))", // badge wash
        },
        border: "hsl(var(--border))", // hairline    #E5E3DE
        // Credit-card visual tints (used by CreditCardVisual only).
        card: {
          emerald: "hsl(var(--card-emerald))",
          graphite: "hsl(var(--card-graphite))",
          sand: "hsl(var(--card-sand))",
          ink: "hsl(var(--card-ink))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Controlled type scale — do not invent sizes outside this list.
        label: ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.08em" }],
        body: ["1rem", { lineHeight: "1.6" }],
        lead: ["1.125rem", { lineHeight: "1.6" }],
        h3: ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        // 8px buttons / 12px cards. Nothing rounder — no pills.
        DEFAULT: "0.5rem",
        btn: "0.5rem",
        card: "0.75rem",
      },
      spacing: {
        // 8px base scale extensions for section rhythm.
        section: "6rem", // 96px desktop section padding
        "section-sm": "4rem", // 64px mobile
      },
      boxShadow: {
        // Deliberately minimal. No glow, no coloured shadows.
        hairline: "0 0 0 1px hsl(var(--border))",
        lift: "0 2px 8px -2px rgb(17 18 17 / 0.08)",
      },
      transitionTimingFunction: {
        cardwise: "cubic-bezier(0.2, 0.6, 0.2, 1)",
      },
      keyframes: {
        "cw-rise": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "cw-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "cw-rise": "cw-rise 350ms cubic-bezier(0.2,0.6,0.2,1) both",
        "cw-fade": "cw-fade 250ms cubic-bezier(0.2,0.6,0.2,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
