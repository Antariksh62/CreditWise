import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 lg:py-36 bg-white border-t border-neutral-200">
      <div className="cw-container">
        <div className="relative overflow-hidden rounded-3xl bg-[#0D0D0D] p-10 sm:p-16 lg:p-20 text-white bg-dotted-dark border border-neutral-800">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-[#DDF247]">
              <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
              3. FINAL RECOMMENDATION CTA
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-white tracking-tight">
              Find the card that rewards your life.
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              Answer a few simple questions and discover cards matched to how you already spend.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#DDF247] px-8 py-4 text-base font-bold text-black hover:bg-[#cee723] transition-all shadow-sm"
              >
                Find your card →
              </Link>
              <Link
                href="/cards"
                className="inline-flex items-center gap-2 rounded-[6px] border border-neutral-700 bg-neutral-900 px-8 py-4 text-base font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Browse all cards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

