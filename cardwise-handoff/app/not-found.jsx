import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * 404 page
 * ------------------------------------------------------------
 * Rendered whenever notFound() is thrown — for example by
 * /cards/[slug] or /blog/[slug] when the slug does not exist.
 */
export default function NotFound() {
  return (
    <div className="cw-rail">
      <div className="cw-container py-24 text-center">
        <p className="cw-eyebrow mb-4">404</p>
        <h1 className="cw-h2 mb-3">We could not find that page</h1>
        <p className="cw-body mx-auto mb-8 max-w-[46ch] text-lead">
          The card or guide you were looking for does not exist in the CardWise
          catalogue.
        </p>
        <div className="flex justify-center gap-2">
          <Link href="/" className="cw-btn-primary">
            Back to the homepage
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <Link href="/cards" className="cw-btn-secondary">
            Browse all cards
          </Link>
        </div>
      </div>
    </div>
  );
}
