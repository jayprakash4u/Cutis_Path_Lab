"use client";

import ServiceIconCard from "@/components/sections/ServiceIconCard";

export default function ServicesGrid({ services = [] }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative mb-8 md:mb-10">
          <div className="absolute top-0 left-0">
            <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
              <h2 className="text-lg md:text-xl font-bold text-white">Our Services</h2>
            </div>
          </div>
          <div className="pt-12">
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              We offer comprehensive pathology and diagnostic services including blood tests,
              urine tests, histopathology, genetic testing, and more.
            </p>
          </div>
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
