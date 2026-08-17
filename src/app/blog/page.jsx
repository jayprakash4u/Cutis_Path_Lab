"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { blogPosts, blogCategories } from "@/data/blogPosts";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const posts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <h1 className="sr-only">Blog</h1>

        <PagePosterHero
          src="/images/blog-poster.png"
          alt="Cutis Path Lab Blog"
          width={2048}
          height={177}
        />

        {/* Header card — shared page-intro pattern */}
        <section className="bg-white px-4 py-4 lg:px-19 lg:py-8">
          <div className="mx-auto max-w-7xl px-3 lg:px-6">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative px-4 py-4 lg:px-8 lg:py-8">
                <div
                  className="absolute left-0 right-0 top-1/2 z-0 border-t border-[#FF6B6B]"
                  aria-hidden="true"
                ></div>
                <div className="relative z-10 inline-block rounded-bl-2xl rounded-tr-2xl bg-sky-600 px-3 py-1.5 lg:px-4 lg:py-2">
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

        {/* Category filter */}
        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="bg-gray-50 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-6">
            {posts.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-500">
                No posts in this category yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
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
                          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-600 to-sky-800"
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
                      <span className="absolute left-3 top-3 rounded-full bg-[#FF6B6B] px-2.5 py-1 text-[11px] font-bold text-white">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
                        <span>{post.readMinutes} min read</span>
                      </div>

                      <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">
                        {post.title}
                      </h3>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                        {post.excerpt}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-semibold text-sky-600">
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
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
