"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { resolveServiceCategory } from "@/lib/serviceCategories";

const CATEGORIES = [
  { id: "all", name: "All Services" },
  { id: "genetics", name: "Genetics" },
  { id: "pathology", name: "Pathology" },
  { id: "imaging", name: "Imaging" },
  { id: "health", name: "Health Check" },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/services");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load services");
        }
        if (!cancelled) setServices(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load services");
          setServices([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredServices = useMemo(() => {
    let filtered = services;
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter(
        (service) =>
          (service.name || "").toLowerCase().includes(query) ||
          (service.description || "").toLowerCase().includes(query),
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (service) => resolveServiceCategory(service) === activeCategory,
      );
    }

    return filtered;
  }, [services, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <PagePosterHero
          src="/images/services-poster.png"
          alt="Cutis Path Lab Services"
          width={6667}
          height={579}
          mobileSrc="/images/banners/mobile/services-poster.png"
          mobileWidth={1844}
          mobileHeight={853}
        />

        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            <div className="relative max-w-xl">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {error ? (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : null}

        {loading ? (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <ServicesGrid services={filteredServices} />
        )}
      </main>

      <Footer />
    </div>
  );
}
