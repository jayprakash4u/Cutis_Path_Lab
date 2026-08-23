"use client";

import ServiceIconCard from "@/components/sections/ServiceIconCard";

export default function ServicesGrid({ services = [] }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 md:mb-10">
          {/* Coral rule runs the full width behind the badge, matching the
              About and Packages page headers. */}
          <div className="relative">
            <div
              className="absolute left-0 right-0 top-1/2 z-0 border-t border-accent-500"
              aria-hidden="true"
            ></div>
            <div className="relative z-10 inline-block rounded-bl-2xl rounded-tr-2xl bg-brand-600 px-4 py-2">
              <h2 className="text-lg font-bold text-white md:text-xl">Our Services</h2>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            We offer comprehensive pathology and diagnostic services including blood tests,
            urine tests, histopathology, genetic testing, and more.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            No services match your search. Try a different keyword or category.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceIconCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
