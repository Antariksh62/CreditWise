/**
 * SpendLimitWidget
 * ------------------------------------------------------------
 * The Ramp-inspired data artifact: a small floating panel that
 * attaches to the hero card visual and shows a spending figure
 * against a limit.
 *
 * This is the ~25% Ramp influence in the design — a concrete
 * fintech object rather than an abstract illustration. Rendered
 * server-side from static props; no animation loop, no client JS.
 *
 * @param {string} label   caption above the figure
 * @param {number} spent   amount spent this cycle
 * @param {number} limit   the cycle limit
 */

function formatRupees(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function SpendLimitWidget({
  label = "Monthly rewards earned",
  spent = 4820,
  limit = 6000,
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, (spent / limit) * 100));

  return (
    <div
      className={`w-[240px] rounded-card border border-border bg-surface p-4 shadow-lift ${className}`}
    >
      <div className="cw-eyebrow mb-2 text-[0.6875rem]">{label}</div>

      <div className="mb-3 flex items-baseline gap-1.5">
        <span className="cw-numeric text-[1.5rem] font-semibold leading-none tracking-[-0.02em]">
          {formatRupees(spent)}
        </span>
        <span className="cw-numeric text-[0.8125rem] text-muted">
          / {formatRupees(limit)}
        </span>
      </div>

      {/* Progress track. Width is set inline because the value is
          data-driven; the colours remain design tokens. */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-subtle"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-cardwise"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 text-[0.75rem] text-muted">
        {Math.round(pct)}% of your projected annual value
      </div>
    </div>
  );
}
