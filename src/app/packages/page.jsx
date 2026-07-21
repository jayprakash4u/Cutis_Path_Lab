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
          alt="Cutis Path Lab Packages"
          width={6667}
          height={654}
        />

        <section className="py-4 lg:py-8 px-4 lg:px-19 bg-white">
          <div className="max-w-7xl mx-auto px-3 lg:px-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative px-4 lg:px-8 py-4 lg:py-8">
                <div className="absolute left-0 right-0 top-1/2 border-t border-[#FF6B6B] z-0"></div>
                <div className="relative z-10 inline-block bg-sky-600 px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-2xl rounded-bl-2xl">
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
        <div className="fixed right-0 top-[330px] lg:top-[300px] bottom-0 w-full max-w-[320px] pointer-events-none z-40">
          <div className="h-full bg-white shadow-2xl overflow-y-auto animate-slide-in pointer-events-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 mb-2">
                    {selectedPackage.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedPackage.name}
                  </h2>
                </div>
                <button
                  onClick={closePanel}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 bg-white shadow-sm"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-sky-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-1">Package Price</p>
                <p className="text-3xl font-bold text-sky-600">Rs. {selectedPackage.price}</p>
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
                      <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
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

              <button
                type="button"
                onClick={() => handleBookPackage(selectedPackage)}
                className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-lg hover:bg-[#e55a5a] transition-colors"
              >
                Book This Package
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
