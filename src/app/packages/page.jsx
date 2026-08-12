/**
 * Packages Page — rendered from static sample data in src/data/landingData.js
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import SectionHeader from "@/components/ui/SectionHeader";
import { PackageCard } from "@/components/ui";
import { packages } from "@/data/landingData";
import { categoryChipClass } from "@/lib/categoryTone";

export default function PackagesPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleViewDetails = (pkg) => setSelectedPackage(pkg);
  const closePanel = () => setSelectedPackage(null);

  const handleBookPackage = (pkg) => {
    if (!pkg?.id) return;
    router.push(`/book-package/${encodeURIComponent(pkg.id)}`);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav-tall pb-24 lg:pb-0">
        <PagePosterHero
          src="/images/posters/packages-poster.png"
          alt="Cutis Path Lab Packages"
          width={6667}
          height={654}
        />

        <section className="section bg-paper">
          <div className="shell">
            <SectionHeader
              eyebrow="Bundled testing"
              title="Health packages"
              lede="Grouped panels priced below the sum of their parts. Each one lists exactly which tests it contains — open a package to see the breakdown."
            />

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  title={pkg.name}
                  price={`Rs ${pkg.price.toLocaleString("en-IN")}`}
                  badge={pkg.category}
                  actionHref={null}
                  reportsTime={pkg.reportsTime}
                  fasting={pkg.fasting}
                  sampleType={pkg.sampleType}
                  includes={pkg.includes}
                  onViewDetails={() => handleViewDetails(pkg)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedPackage && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-deep-900/50"
            aria-label="Close package details"
            onClick={closePanel}
          />

          <aside
            className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-3"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPackage.name} details`}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <span className={categoryChipClass(selectedPackage.category)}>
                  {selectedPackage.category}
                </span>
                <h2 className="mt-2.5 text-xl font-bold text-ink-900">
                  {selectedPackage.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-500 transition hover:border-clinical-500 hover:text-clinical-700"
                aria-label="Close panel"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-sm leading-relaxed text-ink-600">
                {selectedPackage.description}
              </p>

              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <h3 className="label">
                    Includes · {selectedPackage.includes?.length || 0} tests
                  </h3>
                  <span className="sec-rule" aria-hidden="true" />
                </div>
                <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
                  {(selectedPackage.includes || []).map((test, index) => (
                    <li
                      key={index}
                      className="flex items-baseline gap-3 px-4 py-2.5"
                    >
                      <span className="mono text-[11px] text-ink-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[13px] text-ink-700">{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <h3 className="label">Sample details</h3>
                  <span className="sec-rule" aria-hidden="true" />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
                  {[
                    ["Report", selectedPackage.reportsTime],
                    ["Fasting", selectedPackage.fasting],
                    ["Sample", selectedPackage.sampleType],
                    ["Category", selectedPackage.category],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-surface px-4 py-3">
                      <dt className="label">{k}</dt>
                      <dd className="mono mt-1 text-[12px] text-ink-700">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <footer className="border-t border-line bg-paper px-6 py-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label">Package price</p>
                  <p className="mono mt-1 text-2xl font-semibold leading-none text-ink-900">
                    Rs {selectedPackage.price.toLocaleString("en-IN")}
                  </p>
                  {selectedPackage.originalPrice && (
                    <p className="mono mt-1.5 text-[11px] text-ink-400 line-through">
                      Rs {selectedPackage.originalPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleBookPackage(selectedPackage)}
                  className="btn-primary !py-3"
                >
                  Book this package
                </button>
              </div>
            </footer>
          </aside>
        </div>
      )}

      <Footer />
    </div>
  );
}
