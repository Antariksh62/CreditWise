import { Info } from "lucide-react";

/**
 * Disclaimer
 * ------------------------------------------------------------
 * The honesty band that closes the homepage.
 *
 * Assignment 1: INTERNAL CSS. This component carries a scoped
 * <style jsx> block — styles written inside the component rather
 * than in an external stylesheet or on the element's style
 * attribute. That is the "internal CSS" example for the project,
 * placed somewhere it is genuinely useful (a one-off band that
 * nothing else on the site shares).
 *
 * Note: <style jsx> requires styled-jsx, which ships with Next.js
 * by default — no extra install needed.
 */
export default function Disclaimer() {
  return (
    <section className="cw-rail border-b border-border bg-background">
      <div className="cw-container py-12">
        <div className="disclaimer-band">
          <Info className="disclaimer-icon" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <h2 className="disclaimer-title">This is a student project, not a financial service</h2>
            <p className="disclaimer-text">
              CardWise is an educational demonstration. The ten cards, their fees and
              their benefits are realistic sample data assembled for coursework — they
              are not live offers and may not match any bank&apos;s current terms.
              CardWise earns nothing from any card shown, holds no affiliate
              relationships, and does not process applications. Always read the
              issuer&apos;s own terms before applying.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- INTERNAL CSS (Assignment 1) ---------- */}
      <style jsx>{`
        .disclaimer-band {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1.5rem;
          border: 1px solid hsl(var(--border));
          border-left: 2px solid hsl(var(--accent));
          border-radius: 0.75rem;
          background: hsl(var(--subtle));
        }

        .disclaimer-icon {
          width: 1.125rem;
          height: 1.125rem;
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: hsl(var(--accent));
        }

        .disclaimer-title {
          margin: 0 0 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .disclaimer-text {
          margin: 0;
          max-width: 78ch;
          font-size: 0.875rem;
          line-height: 1.65;
          color: hsl(var(--muted));
        }
      `}</style>
    </section>
  );
}
