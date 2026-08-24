"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { blogCategories } from "@/data/blogPosts";

const PAGE_SIZE = 9; // 3 rows of 3 on desktop

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Posts come from the database now, so the admin panel can publish them.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/blog");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setBlogPosts(json.data);
        }
      } catch {
        if (!cancelled) setBlogPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const query = search.trim().toLowerCase();

  /*
    Search first, so the category chip counts below can be taken from it —
    "Health (20)" beside a search matching three of them would be misleading.

    Title, excerpt and author only: the public list endpoint deliberately does
    not ship article bodies (that would send every full post to every visitor),
    so there is no body text here to search.
  */
  const searchMatched = useMemo(() => {
    if (!query) return blogPosts;
    return blogPosts.filter((post) =>
      [post.title, post.excerpt, post.category, post.author]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [blogPosts, query]);

  const posts = useMemo(
    () =>
      activeCategory === "All"
        ? searchMatched
        : searchMatched.filter((post) => post.category === activeCategory),
    [searchMatched, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const pagedPosts = useMemo(
    () => posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [posts, currentPage],
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  // Changing the filter can leave you past the end of the shorter list.
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <h1 className="sr-only">Blog</h1>

        {/*
          Same full-bleed treatment as every other page hero. Rendering the
          1024px artwork at its natural size inside a centred flex container
          left it floating as an island with ~450px of white either side on a
          desktop screen, and squeezed it to a ~33px sliver on a phone, where
          11.64:1 is far too wide to stay legible.
        */}
        <PagePosterHero
          src="/images/posters/heroblogpage.jpg"
          alt="Our Blog — insights on health, wellness and modern medicine"
          width={1024}
          height={88}
          mobileSrc="/images/banners/mobile/blogheroimage.jpg"
          mobileWidth={1024}
          mobileHeight={506}
        />

        {/* Header card — shared page-intro pattern */}
        <section className="bg-white px-4 py-4 lg:px-19 lg:py-8">
          <div className="mx-auto max-w-7xl px-3 lg:px-6">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative px-4 py-4 lg:px-8 lg:py-8">
                <div
                  className="absolute left-0 right-0 top-1/2 z-0 border-t border-brand-200"
                  aria-hidden="true"
                ></div>
                <div className="relative z-10 inline-block rounded-bl-2xl rounded-tr-2xl bg-brand-600 px-3 py-1.5 lg:px-4 lg:py-2">
                  <h2 className="text-sm font-bold text-white md:text-xl lg:text-lg">
                    Health & Lab Insights
                  </h2>
                </div>
              </div>

              <div className="px-4 pb-4 lg:px-8 lg:pb-8">
                <p className="text-xs leading-relaxed text-slate-600 lg:text-sm">
                  Guides on preparing for tests, understanding your reports, and staying ahead of
                  common conditions — written by the team that processes your samples.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Category filter + search */}
        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category) => {
                const isActive = activeCategory === category;
                const count =
                  category === "All"
                    ? searchMatched.length
                    : searchMatched.filter((p) => p.category === category).length;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                    {!loading ? (
                      <span className={isActive ? "text-brand-100" : "text-slate-400"}> ({count})</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-72">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  // Reset here rather than in an effect: narrowing the list can
                  // otherwise strand you on a page that no longer exists.
                  setCurrentPage(1);
                }}
                placeholder="Search articles"
                aria-label="Search articles"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="bg-gray-50 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-6">
            {/* A result count only earns its space once a search is running —
                the pagination bar already reports the total otherwise. */}
            {!loading && query && posts.length > 0 ? (
              <p className="mb-4 text-sm text-slate-500">
                {posts.length === 1 ? "1 article" : `${posts.length} articles`} matching{" "}
                <span className="font-semibold text-slate-700">“{search.trim()}”</span>
              </p>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-slate-100" />
                    <div className="space-y-2 p-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {query ? `No articles match “${search.trim()}”` : "No posts in this category yet."}
                </p>
                {query ? (
                  <>
                    <p className="mt-1.5 text-sm text-slate-500">
                      Try a different word, or browse everything.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setActiveCategory("All");
                        setCurrentPage(1);
                      }}
                      className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      Clear search
                    </button>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {pagedPosts.map((post) => (
                  /* The whole card is the link — a "Read article" affordance
                     that only works on its own three words is a small target,
                     especially on a phone. */
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          /*
                            Must match the real card width or the browser picks
                            a candidate that has to be scaled up. At lg the card
                            is (1232 - 48) / 3 = 394.7px, not the 380px this
                            previously claimed, which pulled in the 384w file.
                          */
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) calc((100vw - 68px) / 2), calc(100vw - 48px)"
                          quality={90}
                        />
                      ) : (
                        /* Branded tile for posts with no photograph yet, so the
                           grid stays even instead of showing a grey gap. */
                        <div
                          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800"
                          aria-hidden="true"
                        >
                          <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                          <svg
                            className="h-14 w-14 text-white/90 transition-transform duration-500 group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            {post.category === "Health" ? (
                              /* Sample vial — these posts are about tests, not food */
                              <>
                                <path d="M9 2h6M10 2v12.5a3.5 3.5 0 0 0 7 0V2" />
                                <path d="M10 9h7" />
                                <path d="M6 21h5" />
                              </>
                            ) : (
                              <>
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                              </>
                            )}
                          </svg>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
                        <span>{post.readMinutes} min read</span>
                      </div>

                      <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
                        {post.title}
                      </h3>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                        {post.excerpt}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-semibold text-brand-600">
                        Read article
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M14 5l7 7-7 7M21 12H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && posts.length > PAGE_SIZE && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 sm:mt-8 sm:flex-row sm:px-4">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Page {currentPage} of {totalPages}
                  <span className="hidden sm:inline"> · {posts.length} posts</span>
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                  >
                    Prev
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`h-8 min-w-8 rounded-md text-xs font-semibold transition-colors sm:h-9 sm:min-w-9 sm:text-sm ${
                        page === currentPage
                          ? "bg-brand-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
