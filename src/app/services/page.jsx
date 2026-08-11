"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PagePosterHero from "@/components/sections/PagePosterHero";
import { services } from "@/data/staticData";

const CATEGORIES = [
  { id: "all", name: "All Services" },
  { id: "genetics", name: "Genetics" },
  { id: "pathology", name: "Pathology" },
  { id: "imaging", name: "Imaging" },
  { id: "health", name: "Health Check" },
];

const CATEGORY_KEYWORDS = {
  genetics: ["gene", "dna", "maternal", "newborn", "molecular", "cytogen", "microarray"],
  pathology: [
    "pathology",
    "histo",
    "cyto",
    "blood",
    "urine",
    "microbio",
    "serolog",
    "immuno",
    "coagulat",
    "chemic",
    "marker",
    "allergy",
    "bone marrow",
    "flow",
  ],
  imaging: ["x-ray", "scan", "ultrasound", "mri"],
};

function getCategory(serviceName) {
  const name = String(serviceName || "").toLowerCase();
  if (CATEGORY_KEYWORDS.genetics.some((keyword) => name.includes(keyword))) {
    return "genetics";
  }
  if (CATEGORY_KEYWORDS.pathology.some((keyword) => name.includes(keyword))) {
    return "pathology";
  }
  if (CATEGORY_KEYWORDS.imaging.some((keyword) => name.includes(keyword))) {
    return "imaging";
  }
  return "health";
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = useMemo(() => {
    let filtered = services;
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query),
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (service) => getCategory(service.name) === activeCategory,
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav pb-24 lg:pb-0">
        <PagePosterHero
          src="/images/services-poster.png"
          alt="Cutis Path Lab Services"
          width={6667}
          height={579}
        />

        <section className="border-b border-line bg-surface">
          <div className="shell space-y-4 py-6">
            <div className="relative max-w-md">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
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
                aria-label="Search services"
                className="w-full rounded-md border border-line bg-paper py-2.5 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-clinical-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-clinical-100"
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
                    className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-clinical-600 text-white"
                        : "border border-line bg-surface text-ink-600 hover:border-clinical-200 hover:text-clinical-700"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <ServicesGrid services={filteredServices} />
      </main>

      <Footer />
    </div>
  );
}
