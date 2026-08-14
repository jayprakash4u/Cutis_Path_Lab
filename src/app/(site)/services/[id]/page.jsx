"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceIconCard from "@/components/sections/ServiceIconCard";
import PageHeroBand from "@/components/sections/PageHeroBand";
import { resolveServiceIcon } from "@/lib/serviceIcons";
import { services } from "@/data/staticData";

const WHAT_TO_EXPECT = [
  {
    title: "Sample Collection",
    desc: "Comfortable collection at the lab or via home visit when available.",
  },
  {
    title: "Laboratory Analysis",
    desc: "Processed with calibrated equipment and validated protocols.",
  },
  {
    title: "Clear Reports",
    desc: "Results reviewed by specialists and delivered promptly.",
  },
];

const HIGHLIGHTS = [
  "Home collection available",
  "Reports in 24–48 hours",
  "Specialist reviewed",
  "Certified laboratory",
];

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = Number(params.id);
  const service = services.find((s) => Number(s.id) === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Service Not Found
            </h1>
            <p className="text-slate-600 mb-5">
              The service you are looking for does not exist or was removed.
            </p>
            <Link
              href="/services"
              className="inline-flex px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
            >
              Back to Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedServices = services
    .filter((s) => Number(s.id) !== serviceId)
    .slice(0, 4);
  const IconComponent = resolveServiceIcon(service);
  const enquireHref = `/contact?service=${encodeURIComponent(service.name)}`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <PageHeroBand
          image="/images/services-poster.png"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
          title={service.name}
          tagline={service.description}
        />

        <section className="border-b border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-8 md:py-10">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-sky-50 flex items-center justify-center">
                <IconComponent size={40} className="w-10 h-10" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={enquireHref}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
                  >
                    Book / Enquire
                  </Link>
                  <a
                    href="tel:+9779825849435"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:border-sky-500 hover:text-sky-700 transition-colors"
                  >
                    Call lab
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {HIGHLIGHTS.map((item) => (
                    <li
                      key={item}
                      className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5"
                    >
                      <span className="text-sky-600" aria-hidden="true">
                        ●
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50/80">
          <div className="max-w-4xl mx-auto px-6 py-10 md:py-12 space-y-10">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                About this service
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Our {service.name} service is delivered by trained laboratory professionals
                using validated methods. Reports are reviewed before release so you and your
                clinician get clear, reliable findings for diagnosis and follow-up care.
              </p>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-5">
                What to expect
              </h2>
              <ol className="space-y-4">
                {WHAT_TO_EXPECT.map((item, idx) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm md:text-base">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                When to consider this service
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {service.name} is typically recommended based on clinical presentation, family
                history, or as part of a diagnostic workup. Speak with your doctor to confirm
                if this is appropriate for you.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">
              Related services
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              {relatedServices.map((related) => (
                <ServiceIconCard
                  key={related.id}
                  service={related}
                  descriptionMax={48}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
