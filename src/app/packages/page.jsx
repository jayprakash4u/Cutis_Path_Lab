/**
 * Packages Page — loads packages from /api/packages
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { PackageCard } from "@/components/ui";

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/packages");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load packages");
        }
        if (!cancelled) setPackages(json.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load packages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleViewDetails = (pkg) => setSelectedPackage(pkg);
  const closePanel = () => setSelectedPackage(null);

  /*
    On phones the detail panel is a modal sheet over a scrim, so the listing
    behind it must not scroll — otherwise flicking the sheet drags the page.
    The desktop side panel is deliberately non-modal (the listing stays usable
    behind it), so the lock is matched to the same 1024px breakpoint the layout
    switches at. Escape closes at both sizes.
  */
  useEffect(() => {
    if (!selectedPackage) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedPackage(null);
    };
    document.addEventListener("keydown", onKeyDown);

    const isSheet = window.matchMedia("(max-width: 1023px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isSheet) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (isSheet) document.body.style.overflow = previousOverflow;
    };
  }, [selectedPackage]);

  const handleBookPackage = (pkg) => {
    if (!pkg?.id) return;
    router.push(`/book-package/${encodeURIComponent(pkg.id)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav-tall">
        <PagePosterHero
          src="/images/posters/packages-poster.png"
          mobileSrc="/images/banners/mobile/packages-poster.png"
          mobileWidth={1842}
          mobileHeight={854}
          alt="Cutis Path Lab Packages"
          width={6667}
          height={654}
        />

        <section className="py-4 lg:py-8 px-4 lg:px-19 bg-white">
          <div className="max-w-7xl mx-auto px-3 lg:px-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative px-4 lg:px-8 py-4 lg:py-8">
                <div className="absolute left-0 right-0 top-1/2 border-t border-accent-500 z-0"></div>
                <div className="relative z-10 inline-block bg-brand-600 px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-2xl rounded-bl-2xl">
                  <h2 className="text-sm lg:text-lg md:text-xl font-bold text-white">
                    Our Packages
                  </h2>
                </div>
              </div>

              <div className="px-4 lg:px-8 pb-4 lg:pb-8">
                <p className="text-slate-600 text-xs lg:text-sm leading-relaxed">
                  We offer comprehensive pathology and diagnostic packages including blood
                  tests, urine tests, histopathology, genetic testing, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 lg:pb-12">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            {loading && (
              <p className="text-center text-slate-500 py-12 text-sm">Loading packages…</p>
            )}
            {error && !loading && (
              <p className="text-center text-red-600 py-12 text-sm">{error}</p>
            )}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    title={pkg.name}
                    price={`Rs. ${pkg.price}`}
                    badge={pkg.category}
                    actionHref={null}
                    reportsTime={pkg.reportsTime || "24-48 hrs"}
                    fasting={pkg.fasting || "10-12 hrs"}
                    sampleType={pkg.sampleType || "Blood"}
                    includes={pkg.includes}
                    onViewDetails={() => handleViewDetails(pkg)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedPackage && (
        <>
          {/* Phones only — the desktop side panel deliberately leaves the
              listing behind it usable, so it gets no scrim. */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            onClick={closePanel}
            aria-hidden="true"
          />

          {/*
            Two shapes, one element. On phones it's a bottom sheet anchored to
            the bottom edge and capped at 85vh, so the details always get most
            of the screen. From lg it returns to the right-hand side panel
            docked just under the navbar. Both offsets used to be hardcoded:
            `top-[330px]` on mobile left a package with a long test list about
            370px to render into, and `top-[300px]` on desktop floated it ~190px
            below a 110px navbar. Deriving it from --site-nav-h-lg-tall keeps it
            correct if the header height ever changes.
          */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:inset-x-auto lg:right-0 lg:top-[calc(var(--site-nav-h-lg-tall)+1.5rem)] lg:w-full lg:max-w-[320px]">
            <div className="pointer-events-auto flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-detail-panel lg:h-full lg:max-h-none lg:rounded-none">
              {/* Header stays put so Close is always reachable in a long list */}
              <div className="flex flex-none items-start justify-between gap-3 border-b border-slate-100 px-5 pb-4 pt-4 lg:px-6 lg:pt-6">
                <div className="min-w-0">
                  <span className="mb-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                    {selectedPackage.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 lg:text-2xl">
                    {selectedPackage.name}
                  </h2>
                </div>
                <button
                  onClick={closePanel}
                  className="flex-none rounded-full border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-100"
                  aria-label="Close panel"
                >
                  <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Only this scrolls */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 lg:px-6">
                <div className="bg-brand-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-1">Package Price</p>
                <p className="text-3xl font-bold text-brand-600">Rs. {selectedPackage.price}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedPackage.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Includes ({selectedPackage.includes?.length || 0} Tests)
                </h3>
                <div className="space-y-2">
                  {(selectedPackage.includes || []).map((test, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                      <span className="text-slate-700 text-sm font-medium">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Sample Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Reports In</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedPackage.reportsTime || "24-48 hrs"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Fasting</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedPackage.fasting || "10-12 hrs"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Sample Type</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedPackage.sampleType || "Blood"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-700">{selectedPackage.category}</p>
                  </div>
                </div>
              </div>

              </div>

              {/*
                Pinned below the scroll area. Previously the CTA sat at the end
                of the content, so on a package with a dozen tests you had to
                scroll the whole list before you could book it. `pb-safe`-style
                padding keeps it clear of the iOS home indicator.
              */}
              <div className="flex-none border-t border-slate-100 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 lg:px-6 lg:pb-6">
                <button
                  type="button"
                  onClick={() => handleBookPackage(selectedPackage)}
                  className="w-full rounded-lg bg-accent-500 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Book This Package
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
