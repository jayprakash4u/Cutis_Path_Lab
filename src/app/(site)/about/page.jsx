"use client";

// ========== LAYOUT COMPONENTS ==========
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeroBand from "@/components/sections/PageHeroBand";

// ========== BADGE ARTWORK ==========
// The only static thing left on this page. Copy, ordering and visibility all
// come from the AboutAccreditation table; `iconKey` picks the drawing.

const BADGES = {
  nabl: (
    <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="65" cy="65" r="50" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M65 22 L92 34 L92 60 Q92 80 65 92 Q38 80 38 60 L38 34 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M65 29 L86 39 L86 60 Q86 76 65 86 Q44 76 44 60 L44 39 Z" fill="#fff" stroke="#0284c7" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="52,61 61,72 78,50" fill="none" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="92" width="42" height="16" rx="8" fill="#0284c7" />
      <text x="65" y="104" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1.5">NABL</text>
      <circle cx="65" cy="29" r="6" fill="#FF6B6B" />
    </svg>
  ),
  iso: (
    <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="65" cy="65" r="50" fill="none" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="65" cy="58" r="22" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.2" />
      <circle cx="65" cy="58" r="14" fill="#fff" stroke="#0284c7" strokeWidth="2" />
      <rect x="62" y="32" width="6" height="8" rx="2" fill="#0284c7" />
      <rect x="62" y="76" width="6" height="8" rx="2" fill="#0284c7" />
      <rect x="34" y="55" width="8" height="6" rx="2" fill="#0284c7" />
      <rect x="78" y="55" width="8" height="6" rx="2" fill="#0284c7" />
      <rect x="42" y="38" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(45 45 42)" />
      <rect x="76" y="38" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(-45 79 42)" />
      <rect x="42" y="68" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(-45 45 72)" />
      <rect x="76" y="68" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(45 79 72)" />
      <text x="65" y="63" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FF6B6B" fontFamily="Arial,sans-serif">ISO</text>
      <rect x="38" y="88" width="54" height="16" rx="8" fill="#FF6B6B" />
      <text x="65" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1">15189:2012</text>
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="65" cy="65" r="50" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="65" cy="50" r="26" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
      <circle cx="65" cy="50" r="19" fill="#fff" stroke="#0284c7" strokeWidth="1.8" />
      <text x="65" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0284c7" fontFamily="Arial,sans-serif">CAP</text>
      <path d="M50 72 L42 95 L55 87 L60 98 L65 76Z" fill="#FF6B6B" stroke="#FF6B6B" strokeLinejoin="round" />
      <path d="M80 72 L88 95 L75 87 L70 98 L65 76Z" fill="#0284c7" stroke="#0284c7" strokeLinejoin="round" />
      <circle cx="65" cy="50" r="8" fill="#FF6B6B" opacity="0.15" />
      <polygon points="65,38 67.5,46 76,46 69.5,51 72,59 65,54 58,59 60.5,51 54,46 62.5,46" fill="none" stroke="#FF6B6B" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
};

// ========== SHARED PIECES ==========

/** The site's section marker — a sky chip sitting on a coral rule. */
function SectionHeading({ id, children }) {
  return (
    <div className="relative py-2">
      <span className="absolute inset-x-0 top-1/2 border-t-4 border-[#FF6B6B]" aria-hidden="true" />
      <h2
        id={id}
        className="relative inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2 t-h2 font-bold text-white lg:px-5"
      >
        {children}
      </h2>
    </div>
  );
}

/** Mission / Vision share a layout; only the side the image sits on changes. */
function SplitSection({ id, heading, body, image, imageFirst }) {
  if (!heading && !body) return null;
  return (
    <section className="py-10 lg:py-16" aria-labelledby={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-14">
          {image && (
            <div className={imageFirst ? "order-2 md:order-1" : "order-2"}>
              <img
                src={image}
                alt={heading || ""}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-2xl ring-1 ring-slate-200/80"
              />
            </div>
          )}
          <div className={imageFirst ? "order-1 md:order-2" : "order-1"}>
            {heading && <SectionHeading id={id}>{heading}</SectionHeading>}
            {body && <p className="mt-5 max-w-prose t-body text-slate-600">{body}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== MAIN COMPONENT ==========

export default function AboutPage() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/site-about");
        const json = await res.json();
        if (!cancelled && json.success && json.data) setAbout(json.data);
      } catch {
        // Section guards below keep the page coherent if this fails.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = about?.stats ?? [];
  const accreditations = about?.accreditations ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <PageHeroBand
          image="/images/about-poster.png"
          crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
          title="About Us"
          tagline={about?.heroTagline || ""}
        />

        {(about?.introLead || about?.introBody) && (
          <section
            className="border-b border-slate-100 bg-slate-50 py-10 lg:py-16"
            aria-labelledby="who-we-are"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading id="who-we-are">
                {about.introHeading || "Who we are"}
              </SectionHeading>
              {about.introLead && (
                <p className="mt-6 max-w-3xl t-lead text-slate-600">{about.introLead}</p>
              )}
              {about.introBody && (
                <p className="mt-4 max-w-3xl t-body text-slate-600">{about.introBody}</p>
              )}
            </div>
          </section>
        )}

        <SplitSection
          id="our-mission"
          heading={about?.missionHeading}
          body={about?.missionBody}
          image={about?.missionImage}
          imageFirst
        />

        <SplitSection
          id="our-vision"
          heading={about?.visionHeading}
          body={about?.visionBody}
          image={about?.visionImage}
        />

        {stats.length > 0 && (
          <section className="bg-slate-50 py-10 lg:py-16" aria-labelledby="by-the-numbers">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading id="by-the-numbers">
                {about?.statsHeading || "By the numbers"}
              </SectionHeading>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="bg-white px-4 py-6 text-center lg:px-6 lg:py-8">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-3xl font-bold tabular-nums tracking-tight text-sky-600 lg:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-2 block t-caption font-medium uppercase tracking-[0.12em] text-slate-500">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {accreditations.length > 0 && (
          <section className="py-10 lg:py-16" aria-labelledby="accreditations">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading id="accreditations">
                {about?.certsHeading || "Accreditations"}
              </SectionHeading>
              {about?.certsIntro && (
                <p className="mt-6 max-w-prose t-body text-slate-600">{about.certsIntro}</p>
              )}

              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {accreditations.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-center transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="mx-auto h-28 w-28 [&>svg]:h-full [&>svg]:w-full">
                      {BADGES[item.iconKey] || BADGES.nabl}
                    </div>
                    <h3 className="mt-4 t-h3 font-semibold text-slate-900">{item.title}</h3>
                    {item.body && <p className="mt-2 t-meta text-slate-600">{item.body}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
