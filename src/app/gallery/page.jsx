"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryItems } from "@/data/landingData";

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav pb-24 lg:pb-0">
        <section className="section bg-paper">
          <div className="shell">
            <SectionHeader
              eyebrow="Inside the lab"
              title="Gallery"
              lede="The collection room, the processing floor, and the instruments your sample passes through."
            />

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightbox(item)}
                  className="group overflow-hidden rounded-lg border border-line bg-surface text-left transition duration-200 hover:border-clinical-200 hover:shadow-2"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-surface-sunk">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="text-[13px] font-medium text-ink-800">
                      {item.title}
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:text-clinical-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <figure
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-ink-900">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <figcaption className="label mt-3 text-center !text-clinical-200/60">
              {lightbox.title}
            </figcaption>
          </figure>
        </div>
      )}

      <Footer />
    </div>
  );
}
