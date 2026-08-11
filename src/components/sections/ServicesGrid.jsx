"use client";

import ServiceIconCard from "@/components/sections/ServiceIconCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ServicesGrid({ services = [] }) {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <SectionHeader
          eyebrow="Departments"
          title="What we test for"
          lede="Blood and urine chemistry, histopathology, microbiology and genetic testing — all processed on site."
        />

        {services.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
            <p className="text-sm font-medium text-ink-700">
              Nothing matches that search
            </p>
            <p className="mt-1 text-[13px] text-ink-500">
              Try a shorter keyword, or clear the category filter.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceIconCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
