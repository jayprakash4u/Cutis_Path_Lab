"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceIconCard from "@/components/sections/ServiceIconCard";
import { resolveServiceIcon } from "@/lib/serviceIcons";

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
  const serviceId = String(params?.id ?? "");

  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return undefined;
    let cancelled = false;

    async function loadService() {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const res = await fetch(`/api/services/${encodeURIComponent(serviceId)}`);
        const json = await res.json();

        if (res.status === 404) {
          if (!cancelled) {
            setService(null);
            setNotFound(true);
          }
          return;
        }
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load service");
        }
        if (!cancelled) setService(json.data);

        // Related services come from the same public list the grid uses.
        try {
          const listRes = await fetch("/api/services?limit=100");
          const listJson = await listRes.json();
          if (!cancelled && listRes.ok && listJson.success) {
            setRelated(
              (listJson.data || [])
                .filter((s) => String(s.id) !== serviceId)
                .slice(0, 4),
            );
          }
        } catch {
          if (!cancelled) setRelated([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load this service");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadService();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16 sm:pt-20 lg:pt-[7.5rem]">
          <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-4">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Service Not Found
            </h1>
            <p className="text-slate-600 mb-5">
              {error || "The service you are looking for does not exist or was removed."}
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

  const IconComponent = resolveServiceIcon(service);
  const enquireHref = `/contact?service=${encodeURIComponent(service.name)}`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-16 sm:pt-20 lg:pt-[7.5rem]">
        <section className="border-b border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 mb-8 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All services
            </Link>

            <div className="flex items-start gap-4 md:gap-5">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-sky-50 flex items-center justify-center">
                <IconComponent size={40} className="w-10 h-10" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  {service.name}
                </h1>
                <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={enquireHref}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                Book / Enquire
              </Link>
              <a
                href="tel:+9779861848382"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:border-sky-500 hover:text-sky-700 transition-colors"
              >
                Call lab
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
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
        </section>

        <section className="bg-slate-50/80">
          <div className="max-w-4xl mx-auto px-6 py-10 md:py-12 space-y-10">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                About this service
              </h2>
              {/* Admin-authored copy when there is any; otherwise the generic
                  paragraph the page has always shown. */}
              <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {service.longDescription
                  ? service.longDescription
                  : `Our ${service.name} service is delivered by trained laboratory professionals using validated methods. Reports are reviewed before release so you and your clinician get clear, reliable findings for diagnosis and follow-up care.`}
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

        {related.length > 0 ? (
          <section className="bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">
                Related services
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
                {related.map((item) => (
                  <ServiceIconCard key={item.id} service={item} descriptionMax={48} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
