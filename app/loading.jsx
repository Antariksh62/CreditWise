export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="cw-rail min-h-[60vh] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Loading CreditWise…
        </span>
      </div>
    </div>
  );
}

