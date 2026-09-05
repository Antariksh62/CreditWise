"use client";

import Link from "next/link";

export default function EditorialBanner() {
  return (
    <section className="py-24 bg-black text-white bg-dotted-dark">
      <div className="cw-container max-w-4xl text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
          Credit cards shouldn&apos;t{" "}
          <span className="text-neutral-500">require a spreadsheet.</span>
        </h2>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-normal">
          Compare rewards. Understand fees. Find the card that fits your actual monthly wallet.
        </p>
        <div className="pt-4">
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#DDF247] px-8 py-4 text-base font-bold text-black hover:bg-[#cee723] transition-all"
          >
            Find your matching card →
          </Link>
        </div>
      </div>
    </section>
  );
}
