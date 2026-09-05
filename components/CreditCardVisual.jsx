/**
 * CreditCardVisual
 * ------------------------------------------------------------
 * The signature CardWise artifact — an original credit-card
 * rendering built entirely from CSS and inline SVG. No stock
 * imagery, no gradient mesh, no glassmorphism.
 *
 * Construction:
 *   - 1.586:1 aspect ratio (real ISO/IEC 7810 ID-1 proportions)
 *   - a flat tinted face using the card-* design tokens
 *   - three engraved arcs, drawn as SVG strokes at low opacity
 *   - a machined chip built from nested rectangles
 *   - the issuer name set in the same Inter face as the site
 *
 * Renders on the server. No client JavaScript required.
 *
 * @param {string} tint     emerald | graphite | sand | ink
 * @param {string} issuer   bank name printed top-left
 * @param {string} name     card name printed bottom-left
 * @param {string} size     "sm" | "md" | "lg"
 */

const TINTS = {
  purple: {
    face: "bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#0A0A0A]",
    text: "text-white",
    dim: "text-white/60",
    stroke: "rgba(221,242,71,0.3)",
    chip: "bg-[#DDF247]",
  },
  emerald: {
    face: "bg-gradient-to-br from-[#0D0D0D] via-[#171717] to-[#050505]",
    text: "text-white",
    dim: "text-white/60",
    stroke: "rgba(221,242,71,0.25)",
    chip: "bg-[#DDF247]",
  },
  graphite: {
    face: "bg-gradient-to-br from-[#141414] via-[#1F1F1F] to-[#0D0D0D]",
    text: "text-white",
    dim: "text-white/55",
    stroke: "rgba(255,255,255,0.2)",
    chip: "bg-[#E2E8F0]",
  },
  ink: {
    face: "bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#000000]",
    text: "text-white",
    dim: "text-white/55",
    stroke: "rgba(221,242,71,0.35)",
    chip: "bg-[#DDF247]",
  },
  sand: {
    face: "bg-gradient-to-br from-[#1A1A1A] via-[#262626] to-[#0F0F0F]",
    text: "text-white",
    dim: "text-white/60",
    stroke: "rgba(221,242,71,0.2)",
    chip: "bg-[#DDF247]",
  },
};


const SIZES = {
  sm: "w-[220px]",
  md: "w-[320px]",
  lg: "w-[420px]",
};

export default function CreditCardVisual({
  tint = "emerald",
  issuer = "CardWise",
  name = "Signature",
  size = "md",
  className = "",
}) {
  const t = TINTS[tint] || TINTS.emerald;

  return (
    <div
      className={`relative ${SIZES[size] || SIZES.md} max-w-full ${className}`}
      aria-hidden="true"
    >
      <div
        className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-[14px] ${t.face} shadow-lift`}
      >
        {/* --- Engraved arcs -------------------------------------
            Three concentric strokes sweeping out of the bottom-right
            corner. Low opacity so they read as embossing, not decoration. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 317 200"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M317 8C230 34 168 96 142 200"
            stroke={t.stroke}
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M317 52C252 74 206 120 187 200"
            stroke={t.stroke}
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M317 96C274 112 244 144 232 200"
            stroke={t.stroke}
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* --- Face content --------------------------------------- */}
        <div className="relative flex h-full flex-col justify-between p-[7%]">
          {/* Issuer, top-left */}
          <div className="flex items-start justify-between">
            <span
              className={`text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${t.text}`}
            >
              {issuer}
            </span>
            {/* Contactless mark — four nested arcs */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {[3, 6, 9, 12].map((r, i) => (
                <path
                  key={r}
                  d={`M${4 + i} ${8 - r / 2}A${r / 2} ${r / 2} 0 0 1 ${4 + i} ${8 + r / 2}`}
                  stroke={t.stroke}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>

          {/* Chip — nested rectangles, machined look */}
          <div className={`h-[13%] w-[15%] rounded-[3px] ${t.chip} relative`}>
            <div className="absolute inset-[22%] rounded-[1px] border border-black/25" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-black/25" />
          </div>

          {/* Card name + fake number band, bottom */}
          <div>
            <div
              className={`mb-[3%] font-mono text-[0.625rem] tracking-[0.18em] ${t.dim}`}
            >
              •••• •••• •••• 4291
            </div>
            <div className={`text-[0.9375rem] font-semibold leading-tight ${t.text}`}>
              {name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
