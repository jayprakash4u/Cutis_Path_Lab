import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import { sqlOne, sqlQuery, toBool } from "@/lib/mysql";
import { getSiteUrl } from "@/lib/siteUrl";

/*
  A server component, unlike /tests/[id] and /services/[id] which fetch on the
  client. For an article that is the whole point: the body and the metadata have
  to be in the HTML that crawlers and link previews receive, and a blog that
  renders its text only after a client fetch is invisible to both.
*/

const SELECT_FIELDS = `\`id\`, \`slug\`, \`title\`, \`excerpt\`, \`content\`, \`category\`,
       \`author\`, \`imageUrl\` AS \`image\`, \`readMinutes\`,
       \`publishedAt\` AS \`date\`, \`isActive\``;

async function getPost(slug) {
  const row = await sqlOne(
    `SELECT ${SELECT_FIELDS} FROM \`BlogPost\` WHERE \`slug\` = ? LIMIT 1`,
    [String(slug || "").trim()],
  );
  if (!row || !toBool(row.isActive)) return null;
  return row;
}

async function getRelated(post) {
  return sqlQuery(
    `SELECT \`slug\`, \`title\`, \`excerpt\`, \`category\`, \`imageUrl\` AS \`image\`,
            \`readMinutes\`, \`publishedAt\` AS \`date\`
       FROM \`BlogPost\`
      WHERE \`isActive\` = 1 AND \`category\` = ? AND \`id\` <> ?
      ORDER BY \`publishedAt\` DESC
      LIMIT 3`,
    [post.category, post.id],
  );
}

/* Fixed locale — `toLocaleDateString()` with the server's default would not
   necessarily match what the client renders, which is a hydration mismatch. */
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  // The root layout's title template already appends "· Cutis Path Lab",
  // so the brand must not be repeated here.
  if (!post) {
    return { title: "Article not found" };
  }

  const description =
    post.excerpt || `${post.title} — from the Cutis Path Lab health and lab insights blog.`;
  const base = getSiteUrl();

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: base ? `${base}/blog/${post.slug}` : undefined,
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  // A slug that isn't in the table, or a post the admin has deactivated,
  // should 404 rather than render an empty shell.
  if (!post) notFound();

  const related = await getRelated(post);
  const published = formatDate(post.date);
  const base = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.image ? [post.image] : undefined,
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    author: { "@type": "Organization", name: post.author || "Cutis Path Lab" },
    publisher: { "@type": "Organization", name: "Cutis Path Lab" },
    mainEntityOfPage: base ? `${base}/blog/${post.slug}` : undefined,
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-gray-50 pt-below-nav">
        {/*
          The article sits on a contained white card rather than running edge to
          edge. Two columns at the top — title beside the cover — then the body
          drops into a narrower measure inside the same card, because a line of
          text as wide as the card is tiring to read.
        */}
        <article className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            <header className="px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
              <nav aria-label="Breadcrumb">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7M3 12h18" />
                  </svg>
                  Back to blog
                </Link>
              </nav>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-[#FF6B6B] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {post.category}
                  </span>

                  <h1 className="mt-4 text-2xl font-bold leading-[1.2] text-slate-900 sm:text-3xl lg:text-[2.1rem]">
                    {post.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500">
                    {published ? (
                      <time dateTime={new Date(post.date).toISOString()}>{published}</time>
                    ) : null}
                    <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
                    <span>
                      By{" "}
                      <span className="font-semibold text-slate-700">
                        {post.author || "Cutis Path Lab"}
                      </span>
                    </span>
                    <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
                    <span>{post.readMinutes || 4} min read</span>
                  </div>
                </div>

                {post.image ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 1024px) 480px, (min-width: 640px) 90vw, 100vw"
                      quality={90}
                    />
                  </div>
                ) : null}
              </div>
            </header>

            {/* Body — held to a comfortable measure inside the card */}
            <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:px-0 lg:py-10">
              {post.excerpt ? (
                <p className="mb-6 border-l-4 border-sky-200 pl-4 text-[15px] italic leading-[1.85] text-slate-500">
                  {post.excerpt}
                </p>
              ) : null}

              {post.content && String(post.content).trim() ? (
              <ArticleBody content={post.content} />
            ) : (
              /*
                Every seeded post currently has a NULL `content` column — the
                seed carried excerpts only. Rather than render a blank page,
                say so plainly and keep the reader moving. This branch stops
                mattering the moment a body is saved in the admin console.
              */
              <div className="rounded-2xl border border-dashed border-slate-200 bg-gray-50 p-6 text-center sm:p-8">
                <p className="text-sm font-semibold text-slate-700">
                  The full article is being written.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                  We&apos;re preparing this one for publication. In the meantime our team
                  is happy to answer questions about {post.title.toLowerCase()} directly.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                  >
                    Ask the lab
                  </Link>
                  <Link
                    href="/blog"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700"
                  >
                    Browse other articles
                  </Link>
                </div>
              </div>
            )}

              {/* General-interest health writing, not personal medical advice. */}
              <p className="mt-10 rounded-xl border-l-4 border-[#FF6B6B] bg-gray-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                This article is for general information and is not a substitute for a
                consultation. Talk to your doctor before acting on anything you read here.
              </p>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Related posts
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
              >
                View all
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div
                        className="h-full w-full bg-gradient-to-br from-sky-600 to-sky-800"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="inline-block self-start rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                      {item.category}
                    </span>
                    <h3 className="mt-2.5 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <span className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
                      {formatDate(item.date)} &nbsp;|&nbsp; {item.readMinutes || 4} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
