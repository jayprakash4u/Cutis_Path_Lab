"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesGrid from "@/components/sections/ServicesGrid";
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px] lg:pt-[88px]">
        <section className="relative w-full h-[18vh] sm:h-[180px]">
          <img
            src="/images/services-poster.png"
            alt="Cutis Path Lab Services"
            className="w-full h-full object-fill"
          />
        </section>

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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
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
                        ? "bg-sky-600 text-white"
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

        <ServicesGrid services={filteredServices} />
      </main>

      <Footer />
    </div>
  );
}
