import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import blogs from "../../../data/blogs.json";

/* EXTERNAL CSS, second stylesheet (Assignment 1).
   Article typography and the embedded media wrapper live in their
   own file rather than bloating globals.css. */
import "../../../styles/learn.css";

/**
 * /blog/[slug] — DYNAMIC ROUTE (Assignment 4)
 * ------------------------------------------------------------
 * One page per article, pre-rendered at build time.
 *
 * Assignment 1 also lands here: the EMBEDDED MEDIA element. Each
 * article carries a `video` field pointing at an educational
 * YouTube embed, rendered inside a responsive 16:9 wrapper.
 */

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = blogs.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: "Guide not found" };

  return {
    title: post.title,
    description: post.summary.slice(0, 155),
  };
}

export default async function BlogArticlePage({ params }) {
  const resolvedParams = await params;
  const index = blogs.findIndex((p) => p.slug === resolvedParams.slug);
  const post = blogs[index];

  if (!post) notFound();

  const next = blogs[(index + 1) % blogs.length];

  return (
    <div className="cw-rail">
      <article className="cw-container py-12 md:py-16">
        <Link href="/blog" className="cw-link-arrow mb-8 inline-flex text-muted">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          All guides
        </Link>

        <header className="mb-8 max-w-[68ch]">
          <p className="cw-eyebrow mb-3">{post.category}</p>
          <h1 className="cw-h2 mb-5">{post.title}</h1>
          <div className="article-meta">
            <span>{post.readTime}</span>
            <span className="article-meta__dot" aria-hidden="true" />
            <span>CardWise editorial</span>
            <span className="article-meta__dot" aria-hidden="true" />
            <span>Educational content, not financial advice</span>
          </div>
        </header>

        {/* ---------- Body ---------- */}
        <div className="article-prose">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* ---------- EMBEDDED MEDIA (Assignment 1) ---------- */}
        {post.video && (
          <section className="mt-12 max-w-[68ch]">
            <h2 className="cw-h3 mb-4">Watch: a short explainer</h2>
            <div className="media-embed">
              <iframe
                src={post.video}
                title={`Video explainer: ${post.title}`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="media-caption">
              Embedded third-party video, included for educational context.
            </p>
          </section>
        )}

        {/* ---------- Next article ---------- */}
        <footer className="mt-14 max-w-[68ch] border-t border-border pt-8">
          <p className="cw-eyebrow mb-3">Read next</p>
          <Link
            href={`/blog/${next.slug}`}
            className="cw-card-interactive flex items-center justify-between gap-4 p-5"
          >
            <span>
              <span className="block text-[1.0625rem] font-semibold">{next.title}</span>
              <span className="mt-1 block text-[0.875rem] text-muted">
                {next.category} · {next.readTime}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
          </Link>
        </footer>
      </article>
    </div>
  );
}
