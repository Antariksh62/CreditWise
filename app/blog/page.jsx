import Link from "next/link";
import { ArrowRight } from "lucide-react";
import blogs from "../../data/blogs.json";
import Reveal from "../../components/Reveal";

/**
 * /blog — the Learn index
 * ------------------------------------------------------------
 * Lists all five educational articles. Each links to its dynamic
 * route at /blog/[slug].
 */

export const metadata = {
  title: "Learn about credit cards",
  description:
    "Five plain-English guides covering credit scores, cashback versus rewards, annual fees, credit utilisation and choosing your first card.",
};

const PANEL_TINTS = [
  "bg-card-emerald",
  "bg-card-graphite",
  "bg-card-sand",
  "bg-card-ink",
  "bg-card-emerald",
];

export default function BlogIndexPage() {
  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mb-12 max-w-[52ch]">
          <p className="cw-eyebrow mb-3">Learn</p>
          <h1 className="cw-h2">Understand the product before you apply for it</h1>
          <p className="cw-body mt-3 text-lead">
            {blogs.length} short guides on how credit cards, scores and rewards actually
            work — written for people getting their first card.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <article className="cw-card-interactive flex h-full flex-col overflow-hidden">
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

                  <h2 className="cw-h3 mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors duration-200 hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mb-5 text-[0.9375rem] leading-relaxed text-muted">
                    {post.summary}
                  </p>

                  <Link href={`/blog/${post.slug}`} className="cw-link-arrow mt-auto">
                    Read guide
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
