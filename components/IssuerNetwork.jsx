"use client";

export default function IssuerNetwork() {
  const issuers = [
    { name: "HDFC BANK", code: "hdfc" },
    { name: "SBI CARD", code: "sbi" },
    { name: "AXIS BANK", code: "axis" },
    { name: "ICICI BANK", code: "icici" },
    { name: "AMERICAN EXPRESS", code: "amex" },
    { name: "STANDARD CHARTERED", code: "sc" },
  ];

  return (
    <section className="border-t border-b border-neutral-200 bg-neutral-50 py-12">
      <div className="cw-container">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-neutral-400 mb-8">
          Scoring and comparing cards from India&apos;s leading issuers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center">
          {issuers.map((item) => (
            <div
              key={item.code}
              className="text-neutral-500 font-extrabold text-sm sm:text-base tracking-wider hover:text-black transition-colors"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
