/**
 * CreditCardVisual
 * ------------------------------------------------------------
 * Displays the verified credit card image if available,
 * or falls back to the CreditWise signature procedural canvas.
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
  sm: "w-[240px]",
  md: "w-[340px]",
  lg: "w-[440px]",
};

export default function CreditCardVisual({
  tint = "emerald",
  issuer = "CardWise",
  name = "Signature",
  size = "md",
  image = null,
  className = "",
}) {
  const t = TINTS[tint] || TINTS.emerald;

  if (image) {
    return (
      <div
        className={`relative ${SIZES[size] || SIZES.md} max-w-full flex items-center justify-center select-none ${className}`}
      >
        <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[16px] shadow-lift bg-neutral-950/40 p-1 flex items-center justify-center border border-neutral-200/40 dark:border-neutral-800">
          <img
            src={image}
            alt={`${issuer} ${name} Credit Card`}
            className="h-full w-full object-contain rounded-[14px] transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${SIZES[size] || SIZES.md} max-w-full ${className}`}
      aria-hidden="true"
    >
      <div
        className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-[14px] ${t.face} shadow-lift`}
      >
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

        <div className="relative flex h-full flex-col justify-between p-[7%]">
          <div className="flex items-start justify-between">
            <span
              className={`text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${t.text}`}
            >
              {issuer}
            </span>
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

          <div className={`h-[13%] w-[15%] rounded-[3px] ${t.chip} relative`}>
            <div className="absolute inset-[22%] rounded-[1px] border border-black/25" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-black/25" />
          </div>

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
