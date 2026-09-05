import Link from "next/link";
import blogs from "../data/blogs.json";

export default function LearnPreview() {
  const featured = blogs.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              FINANCIAL CLARITY
            </div>
            <h2 className="cw-h2">
              Guides &amp; credit-card <span className="text-neutral-400">insights.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-black hover:underline"
          >
            Read all guides →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((post) => (
            <article key={post.slug} className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-400 transition-all">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-black mb-3 leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {post.summary}
                </p>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-xs font-bold text-black hover:underline"
              >
                Read full article →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


