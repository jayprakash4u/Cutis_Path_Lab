"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";

function AccreditationIcon({ iconKey }) {
  const key = String(iconKey || "nabl").toLowerCase();

  if (key === "iso") {
    return (
      <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="65" cy="65" r="60" fill="#EFF2FB" stroke="#3750A4" strokeWidth="2.5" />
        <circle cx="65" cy="65" r="50" fill="none" stroke="#C62F45" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="65" cy="58" r="22" fill="#C3CDEE" stroke="#3750A4" strokeWidth="2.2" />
        <circle cx="65" cy="58" r="14" fill="#fff" stroke="#3750A4" strokeWidth="2" />
        <rect x="62" y="32" width="6" height="8" rx="2" fill="#3750A4" />
        <rect x="62" y="76" width="6" height="8" rx="2" fill="#3750A4" />
        <rect x="34" y="55" width="8" height="6" rx="2" fill="#3750A4" />
        <rect x="78" y="55" width="8" height="6" rx="2" fill="#3750A4" />
        <rect x="42" y="38" width="6" height="8" rx="2" fill="#3750A4" transform="rotate(45 45 42)" />
        <rect x="76" y="38" width="6" height="8" rx="2" fill="#3750A4" transform="rotate(-45 79 42)" />
        <rect x="42" y="68" width="6" height="8" rx="2" fill="#3750A4" transform="rotate(-45 45 72)" />
        <rect x="76" y="68" width="6" height="8" rx="2" fill="#3750A4" transform="rotate(45 79 72)" />
        <text x="65" y="63" textAnchor="middle" fontSize="11" fontWeight="900" fill="#C62F45" fontFamily="Arial,sans-serif">ISO</text>
        <rect x="38" y="88" width="54" height="16" rx="8" fill="#C62F45" />
        <text x="65" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1">15189:2012</text>
      </svg>
    );
  }

  if (key === "cap") {
    return (
      <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="65" cy="65" r="60" fill="#EFF2FB" stroke="#3750A4" strokeWidth="2.5" />
        <circle cx="65" cy="65" r="50" fill="none" stroke="#3750A4" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="65" cy="50" r="26" fill="#C3CDEE" stroke="#3750A4" strokeWidth="2.5" />
        <circle cx="65" cy="50" r="19" fill="#fff" stroke="#3750A4" strokeWidth="1.8" />
        <text x="65" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill="#3750A4" fontFamily="Arial,sans-serif">CAP</text>
        <path d="M50 72 L42 95 L55 87 L60 98 L65 76Z" fill="#C62F45" stroke="#C62F45" strokeLinejoin="round" />
        <path d="M80 72 L88 95 L75 87 L70 98 L65 76Z" fill="#3750A4" stroke="#3750A4" strokeLinejoin="round" />
        <circle cx="65" cy="50" r="8" fill="#C62F45" opacity="0.15" />
        <polygon points="65,38 67.5,46 76,46 69.5,51 72,59 65,54 58,59 60.5,51 54,46 62.5,46" fill="none" stroke="#C62F45" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="65" cy="65" r="60" fill="#EFF2FB" stroke="#3750A4" strokeWidth="2.5" />
      <circle cx="65" cy="65" r="50" fill="none" stroke="#3750A4" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M65 22 L92 34 L92 60 Q92 80 65 92 Q38 80 38 60 L38 34 Z" fill="#C3CDEE" stroke="#3750A4" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M65 29 L86 39 L86 60 Q86 76 65 86 Q44 76 44 60 L44 39 Z" fill="#fff" stroke="#3750A4" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="52,61 61,72 78,50" fill="none" stroke="#C62F45" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="92" width="42" height="16" rx="8" fill="#3750A4" />
      <text x="65" y="104" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1.5">NABL</text>
      <circle cx="65" cy="29" r="6" fill="#C62F45" />
    </svg>
  );
}

function SectionBanner({ title }) {
  if (!title) return null;
  return (
    <div className="relative px-4 lg:px-8 py-4 lg:py-8">
      <div className="absolute left-0 right-0 top-1/2 z-0 border-t-4 border-brand-200" />
      <div className="relative z-10 inline-block rounded-tr-2xl rounded-bl-2xl bg-brand-600 px-3 py-1.5 lg:px-4 lg:py-2">
        <h2 className="text-sm font-bold text-white md:text-xl lg:text-lg">{title}</h2>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/site-about");
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setAbout(json.data);
        }
      } catch {
        if (!cancelled) setAbout(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const introHeading = about?.introHeading || "About Us";
  const introLead = about?.introLead || "";
  const introBody = about?.introBody || "";
  const missionHeading = about?.missionHeading || "Our Mission";
  const missionBody = about?.missionBody || "";
  const missionImage = about?.missionImage || "/images/mission-vision.png";
  const visionHeading = about?.visionHeading || "Our Vision";
  const visionBody = about?.visionBody || "";
  const visionImage = about?.visionImage || "/images/vision-image.png";
  const statsHeading = about?.statsHeading || "Our Achievements";
  const certsHeading = about?.certsHeading || "Accreditations";
  const certsIntro = about?.certsIntro || "";
  const stats = Array.isArray(about?.stats) ? about.stats : [];
  const certs = Array.isArray(about?.accreditations) ? about.accreditations : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-below-nav">
        <PagePosterHero
          src="/images/about-poster.png"
          mobileSrc="/images/banners/mobile/aboutusheroimage.jpg"
          mobileWidth={1024}
          mobileHeight={474}
          alt="Cutis Path Lab About Us"
          width={6667}
          height={579}
        />

        {(introLead || introBody) && (
          <section className="bg-gray-50 py-6 lg:py-12">
            <div className="mx-auto max-w-7xl px-3 lg:px-6">
              <div className="overflow-hidden rounded-lg bg-slate-50 shadow-sm">
                <SectionBanner title={introHeading} />
                <div className="space-y-3 px-4 pb-4 lg:px-8 lg:pb-8">
                  {introLead ? (
                    <p className="text-xs leading-relaxed text-slate-600 lg:text-sm">{introLead}</p>
                  ) : null}
                  {introBody ? (
                    <p className="text-xs leading-relaxed text-slate-600 lg:text-sm">{introBody}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        )}

        {missionBody && (
          <section className="bg-white py-6 lg:py-16">
            <div className="mx-auto max-w-7xl px-3 lg:px-6">
              <div className="overflow-hidden">
                <div className="px-4 pb-4 lg:px-8 lg:pb-8">
                  <div className="grid items-center gap-6 md:grid-cols-2 lg:gap-12">
                    <div className="relative order-2 md:order-1">
                      {missionImage ? (
                        <img
                          src={missionImage}
                          alt={missionHeading}
                          className="h-auto w-full rounded-lg"
                        />
                      ) : null}
                    </div>
                    <div className="order-1 md:order-2">
                      <div className="relative px-3 py-2 text-right lg:px-4 lg:py-3">
                        <div className="absolute left-0 right-0 top-1/2 border-t-4 border-brand-200" />
                        <div className="relative z-10 inline-block rounded-tr-xl rounded-bl-xl bg-brand-600 px-4 py-1.5 lg:px-6 lg:py-2">
                          <h2 className="text-sm font-bold text-white md:text-xl lg:text-lg">
                            {missionHeading}
                          </h2>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 lg:mt-6 lg:text-sm">
                        {missionBody}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {visionBody && (
          <section className="bg-white py-6 lg:py-16">
            <div className="mx-auto max-w-7xl px-3 lg:px-6">
              <div className="overflow-hidden">
                <div className="px-4 pb-4 lg:px-8 lg:pb-8">
                  <div className="grid items-center gap-6 md:grid-cols-2 lg:gap-12">
                    <div>
                      <div className="relative px-3 py-1.5 lg:px-4 lg:py-2">
                        <div className="absolute left-0 right-0 top-1/2 z-0 border-t-4 border-brand-200" />
                        <div className="relative z-10 inline-block rounded-tr-2xl rounded-bl-2xl bg-brand-600 px-3 py-1.5 lg:px-4 lg:py-2">
                          <h2 className="text-sm font-bold text-white md:text-xl lg:text-lg">
                            {visionHeading}
                          </h2>
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 lg:mt-4 lg:text-sm">
                        {visionBody}
                      </p>
                    </div>
                    <div>
                      {visionImage ? (
                        <img
                          src={visionImage}
                          alt={visionHeading}
                          className="h-auto w-full rounded-lg"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {(stats.length > 0 || certs.length > 0 || loading) && (
          <section className="bg-white py-6 lg:py-16">
            <div className="mx-auto max-w-7xl px-3 lg:px-6">
              <div className="overflow-hidden rounded-lg bg-white">
                <SectionBanner title={stats.length ? statsHeading : certsHeading} />
                <div className="px-4 pb-4 lg:px-8 lg:pb-8">
                  {loading && stats.length === 0 && certs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
                  ) : null}

                  {stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6">
                      {stats.map((stat) => (
                        <div key={stat.id || stat.label} className="p-2 text-center lg:p-4">
                          <div className="mb-1 text-xl font-bold text-brand-600 md:text-4xl lg:mb-2 lg:text-3xl">
                            {stat.value}
                          </div>
                          <div className="text-[10px] text-slate-600 lg:text-sm">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {certs.length > 0 && (
                    <div className={stats.length > 0 ? "mt-8" : ""}>
                      {stats.length > 0 && certsHeading ? (
                        <h3 className="mb-2 text-center text-base font-semibold text-slate-900 lg:text-lg">
                          {certsHeading}
                        </h3>
                      ) : null}
                      {certsIntro ? (
                        <p className="mx-auto mb-6 max-w-3xl text-center text-xs leading-relaxed text-slate-600 lg:text-sm">
                          {certsIntro}
                        </p>
                      ) : null}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {certs.map((cert) => (
                          <div
                            key={cert.id || cert.title}
                            className="rounded-lg border border-slate-200 border-l-4 border-l-brand-500 bg-white p-4"
                          >
                            <div className="mx-auto mb-3 flex h-32 w-32 items-center justify-center">
                              <AccreditationIcon iconKey={cert.iconKey} />
                            </div>
                            <h3 className="mb-1 text-center font-semibold text-slate-900">
                              {cert.title}
                            </h3>
                            {cert.body ? (
                              <p className="text-center text-sm text-slate-600">{cert.body}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
