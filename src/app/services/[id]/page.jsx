"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceIconCard from "@/components/sections/ServiceIconCard";
import { resolveServiceIcon } from "@/lib/serviceIcons";
import { services } from "@/data/staticData";

const WHAT_TO_EXPECT = [
  {
    title: "Sample collection",
    desc: "Comfortable collection at the lab or via home visit when available.",
  },
  {
    title: "Laboratory analysis",
    desc: "Processed with calibrated equipment and validated protocols.",
  },
  {
    title: "Clear reporting",
    desc: "Results reviewed by specialists and delivered promptly.",
  },
];

const HIGHLIGHTS = [
  { text: "Home collection available", tone: "clinical" },
  { text: "Reports in 24–48 hours", tone: "assay" },
  { text: "Specialist reviewed", tone: "bloom" },
  { text: "Certified laboratory", tone: "flag" },
];

const DOT_TONE = {
  clinical: "bg-clinical-600",
  assay: "bg-assay-600",
  bloom: "bg-bloom-600",
  flag: "bg-flag-600",
};

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = Number(params.id);
  const service = services.find((s) => Number(s.id) === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="pt-below-nav-tall">
          <div className="shell py-20 text-center">
            <h1 className="sec-title">Service not found</h1>
            <p className="mt-2 text-sm text-ink-500">
              The service you are looking for does not exist or was removed.
            </p>
            <Link href="/services" className="btn-primary mt-6 inline-flex">
              Back to services
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
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav-tall pb-16">
        <section className="border-b border-line bg-surface">
          <div className="shell py-10 md:py-14">
            <Link
              href="/services"
              className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition-colors hover:text-clinical-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All services
            </Link>

            <div className="flex items-start gap-4 md:gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-clinical-50 md:h-16 md:w-16">
                <IconComponent size={36} className="h-9 w-9" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">
                  {service.name}
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={enquireHref} className="btn-primary">
                Book / enquire
              </Link>
              <a href="tel:+9779825849435" className="btn-outline">
                Call the lab
              </a>
            </div>

            <ul className="mono mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-ink-500">
              {HIGHLIGHTS.map((item) => (
                <li key={item.text} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section bg-paper">
          <div className="shell max-w-3xl space-y-10">
            <div>
              <p className="eyebrow">About this service</p>
              <div className="mt-2.5 flex items-center gap-4">
                <h2 className="sec-title">What it covers</h2>
                <span className="sec-rule" aria-hidden="true" />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                Our {service.name} service is delivered by trained laboratory
                professionals using validated methods. Reports are reviewed
                before release so you and your clinician get clear, reliable
                findings for diagnosis and follow-up care.
              </p>
            </div>

            <div>
              <p className="eyebrow">Process</p>
              <div className="mt-2.5 flex items-center gap-4">
                <h2 className="sec-title">What to expect</h2>
                <span className="sec-rule" aria-hidden="true" />
              </div>
              <ol className="mt-5 space-y-px overflow-hidden rounded-lg border border-line bg-line">
                {WHAT_TO_EXPECT.map((item, idx) => (
                  <li key={item.title} className="flex gap-4 bg-surface p-5">
                    <span className="mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clinical-100 text-sm font-bold text-clinical-700">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-ink-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[13px] text-ink-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card border-t-[3px] border-t-bloom-600 p-5 sm:p-6">
              <h2 className="text-[0.9375rem] font-semibold text-ink-900">
                When to consider this service
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                {service.name} is typically recommended based on clinical
                presentation, family history, or as part of a diagnostic
                workup. Speak with your doctor to confirm if this is
                appropriate for you.
              </p>
            </div>
          </div>
        </section>

        <section className="section-tight border-t border-line bg-surface">
          <div className="shell">
            <p className="eyebrow">Explore more</p>
            <div className="mt-2.5 flex items-center gap-4">
              <h2 className="sec-title">Related services</h2>
              <span className="sec-rule" aria-hidden="true" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {relatedServices.map((related) => (
                <ServiceIconCard key={related.id} service={related} descriptionMax={48} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
