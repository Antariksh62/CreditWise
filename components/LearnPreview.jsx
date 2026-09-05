import Link from "next/link";
import { ArrowRight } from "lucide-react";
import blogs from "../data/blogs.json";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * LearnPreview
 * ------------------------------------------------------------
 * Three article cards in the Stripe editorial style: a tinted
 * abstract panel instead of stock photography, a category label,
 * a tight headline and a one-line summary.
 *
 * The abstract panels are pure CSS — two offset rounded rectangles
 * per tile, rotated slightly. No images to load, no AI-generated
 * artwork, and they stay on-brand because they use the card tints.
 */

const PANEL_TINTS = ["bg-card-emerald", "bg-card-graphite", "bg-card-sand"];

export default function LearnPreview() {
  const featured = blogs.slice(0, 3);

  return (
    <section className="cw-rail cw-section border-b border-border">
      <div className="cw-container">
        <SectionHeading
          eyebrow="Learn"
          title="Understand the product before you apply for it"
          description="Short, plain-English guides on scores, fees and how rewards actually convert into money."
          actionHref="/blog"
          actionLabel={`All ${blogs.length} guides`}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <article className="cw-card-interactive flex h-full flex-col overflow-hidden">
                {/* Abstract editorial panel */}
                <div
                  className={`relative h-36 overflow-hidden ${PANEL_TINTS[index % PANEL_TINTS.length]}`}
                  aria-hidden="true"
                >
                  <div className="absolute -right-8 -top-10 h-32 w-32 rotate-12 rounded-[18px] border border-white/20" />
                  <div className="absolute -bottom-14 left-6 h-32 w-32 -rotate-6 rounded-[18px] border border-white/15" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="cw-badge-neutral">{post.category}</span>
                    <span className="text-[0.8125rem] text-muted">{post.readTime}</span>
                  </div>

                  <h3 className="cw-h3 mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors duration-200 hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mb-5 text-[0.9375rem] leading-relaxed text-muted">
                    {post.summary}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="cw-link-arrow mt-auto"
                  >
                    Read guide
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
