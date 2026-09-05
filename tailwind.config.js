/** CardWise — Tailwind CSS v3 configuration
 *  Design system: Ramp-inspired visual discipline (Black + White + Acid Lime Yellow + Dotted Grids)
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
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        subtle: "hsl(var(--subtle))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        accent: {
          DEFAULT: "hsl(var(--accent))", // Ramp Lime Yellow (#DDF247)
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          soft: "hsl(var(--accent-soft))",
        },
        dark: {
          DEFAULT: "#0D0D0D",
          surface: "#141414",
          border: "#262626",
          muted: "#8E8E93",
        },
        border: "hsl(var(--border))",
        card: {
          emerald: "hsl(var(--card-emerald))",
          graphite: "hsl(var(--card-graphite))",
          sand: "hsl(var(--card-sand))",
          ink: "hsl(var(--card-ink))",
          lime: "#DDF247",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.08em" }],
        body: ["1rem", { lineHeight: "1.6" }],
        lead: ["1.125rem", { lineHeight: "1.6" }],
        h3: ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        h2: ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        display: ["3.75rem", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
        hero: ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        btn: "0.375rem", // Rectangular Ramp button style
        card: "0.75rem",
      },
      spacing: {
        section: "6.5rem",
        "section-sm": "4.5rem",
      },
      boxShadow: {
        hairline: "0 0 0 1px hsl(var(--border))",
        lift: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        ramp: "0 12px 32px -4px rgba(0, 0, 0, 0.08)",
      },
      transitionTimingFunction: {
        cardwise: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "cw-rise": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "cw-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "cw-rise": "cw-rise 400ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "cw-fade": "cw-fade 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
        ticker: "ticker 35s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

