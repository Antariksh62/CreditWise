import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container">
        <div className="relative overflow-hidden rounded-2xl bg-[#0D0D0D] p-10 md:p-16 text-white bg-dotted-dark">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-neutral-800 px-3 py-1 text-xs font-mono font-bold text-[#DDF247]">
              <span>GET STARTED WITH CARDWISE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold leading-[1.08] text-white tracking-tight">
              Ready to find the card built for your wallet?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-neutral-400">
              Answer 4 simple questions to receive personalized card matches with calculated annual yields.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/recommend"
                className="rounded-[6px] bg-[#DDF247] px-7 py-3.5 text-base font-bold text-black hover:bg-[#cee723] transition-all"
              >
                Find your card →
              </Link>
              <Link
                href="/cards"
                className="rounded-[6px] border border-neutral-700 bg-neutral-900 px-7 py-3.5 text-base font-semibold text-white hover:bg-neutral-800 transition-colors"
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

