/**
 * MatchScore
 * ------------------------------------------------------------
 * The circular score indicator used on the results page.
 * Drawn as an SVG ring whose stroke-dashoffset is computed from
 * the score.
 *
 * Assignment 1: another genuine INLINE CSS use — the dash offset
 * depends on the score and cannot be expressed as a utility class.
 */
export default function MatchScore({ score, size = 72, label = "match" }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} percent ${label}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          /* INLINE CSS: computed from the score. */
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 500ms cubic-bezier(0.2,0.6,0.2,1)",
          }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="cw-numeric text-[0.9375rem] font-semibold">{score}%</span>
      </span>
    </div>
  );
}
