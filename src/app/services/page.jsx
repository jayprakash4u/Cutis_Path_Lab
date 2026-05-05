"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesGrid from "@/components/sections/ServicesGrid";
import { services } from "@/data/staticData";

const CATEGORIES = [
  { id: "all", name: "All Services", icon: "grid" },
  { id: "genetics", name: "Genetics", icon: "dna" },
  { id: "pathology", name: "Pathology", icon: "flask" },
  { id: "imaging", name: "Imaging", icon: "scan" },
  { id: "health", name: "Health Check", icon: "heart" },
];

const CATEGORY_KEYWORDS = {
  genetics: ["gene", "dna", "maternal", "newborn"],
  pathology: ["pathology", "blood", "urine", "hormone"],
  imaging: ["x-ray", "scan", "ultrasound", "mri"],
};

function getCategoryIcon(type) {
  const cls = "w-6 h-6";
  switch (type) {
    case "dna": return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15m15 0c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 01-3.7 3.7 48.656 48.656 0 01-7.324 0 4.006 4.006 0 01-3.7-3.7c-.017-.22-.032-.441-.046-.662m-7.288 0L4.5 12m3.288 0l3-3m-3 3l-3-3m12 3c0-1.232.046-2.453.138-3.662a4.006 4.006 0 013.7-3.7 48.678 48.678 0 017.324 0 4.006 4.006 0 013.7 3.7c.017.22.032.441.046.662" /></svg>;
    case "flask": return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
    case "scan": return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    case "heart": return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
    default: return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
  }
}

const getCategory = (serviceName) => {
  const name = serviceName.toLowerCase();
  if (CATEGORY_KEYWORDS.genetics.some(keyword => name.includes(keyword))) return "genetics";
  if (CATEGORY_KEYWORDS.pathology.some(keyword => name.includes(keyword))) return "pathology";
  if (CATEGORY_KEYWORDS.imaging.some(keyword => name.includes(keyword))) return "imaging";
  return "health";
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredServices, setFilteredServices] = useState(services);

  useEffect(() => {
    let filtered = services;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }
    if (activeCategory !== "all") {
      filtered = filtered.filter((service) => getCategory(service.name) === activeCategory);
    }
    setFilteredServices(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-[80px] lg:pt-[88px]">
        {/* Hero Section - Image for all screens */}
        <section className="relative w-full h-[18vh] sm:h-[180px]">
          <img 
            src="/images/services-poster.png" 
            alt="Cutis Path Lab Services"
            className="w-full h-full sm:object-cover object-fill"
          />
        </section>

        <ServicesGrid />
      </main>

      <Footer />
    </div>
  );
}
