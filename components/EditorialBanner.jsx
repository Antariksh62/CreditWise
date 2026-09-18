"use client";

export default function EditorialBanner() {
  return (
    <section className="py-28 lg:py-36 bg-black text-white bg-dotted-dark border-t border-neutral-900">
      <div className="cw-container max-w-5xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 text-xs font-mono font-bold tracking-wider uppercase text-[#DDF247]">
          <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
          BRAND PHILOSOPHY STATEMENT
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
          Credit cards shouldn&apos;t<br />
          <span className="text-neutral-500">require a spreadsheet.</span>
        </h2>

        <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Compare rewards. Understand fees. Find the card that fits the way you actually spend.
        </p>
      </div>
    </section>
  );
}

