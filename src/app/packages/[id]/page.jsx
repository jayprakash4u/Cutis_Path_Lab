"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { packages } from "@/data/landingData";
import { categoryChipClass } from "@/lib/categoryTone";

export default function PackageDetailPage() {
  const params = useParams();
  const pkg = packages.find((p) => String(p.id) === String(params.id));

  if (!pkg) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="pt-below-nav-tall">
          <div className="shell py-20 text-center">
            <h1 className="sec-title">Package not found</h1>
            <Link href="/packages" className="btn-primary mt-6 inline-flex">
              Back to packages
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const saving = (pkg.originalPrice || pkg.price) - pkg.price;
  const percent = pkg.originalPrice
    ? Math.round((saving / pkg.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav-tall pb-16">
        <div className="border-b border-line bg-surface">
          <div className="shell flex items-center gap-2 py-4 text-[13px] text-ink-500">
            <Link href="/packages" className="hover:text-clinical-700">
              Packages
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink-900">{pkg.name}</span>
          </div>
        </div>

        <div className="shell py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <span className={categoryChipClass(pkg.category)}>{pkg.category}</span>
              <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
                {pkg.name}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                {pkg.description}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
                {[
                  ["Tests included", pkg.includes?.length || 0],
                  ["Report delivery", pkg.reportsTime],
                  ["Fasting", pkg.fasting],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface p-5">
                    <dt className="label">{k}</dt>
                    <dd className="mono mt-1.5 text-base font-semibold text-ink-900">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="card mt-8 overflow-hidden">
                <div className="border-b border-line bg-surface-sunk px-5 py-3.5">
                  <h2 className="text-[0.9375rem] font-semibold text-ink-900">
                    Included tests
                  </h2>
                </div>
                <ul className="divide-y divide-line">
                  {(pkg.includes || []).map((test, index) => (
                    <li key={test} className="flex items-baseline gap-3 px-5 py-3">
                      <span className="mono text-[11px] text-ink-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[13px] text-ink-700">{test}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-28 overflow-hidden">
                <div className="border-b border-line bg-clinical-50 px-5 py-3">
                  <p className="label">Package price</p>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="mono text-2xl font-bold text-ink-900">
                      Rs {pkg.price.toLocaleString("en-IN")}
                    </span>
                    {pkg.originalPrice && (
                      <span className="mono text-sm text-ink-400 line-through">
                        Rs {pkg.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  {percent > 0 && (
                    <span className="chip-flag mt-2 inline-flex">Save {percent}%</span>
                  )}

                  <Link
                    href={`/book-package/${encodeURIComponent(pkg.id)}`}
                    className="btn-primary mt-5 w-full !py-3"
                  >
                    Book this package
                  </Link>

                  <ul className="mono mt-6 space-y-2 border-t border-line pt-5 text-[11px] uppercase tracking-[0.1em] text-ink-500">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-clinical-600" aria-hidden="true" />
                      Home sample collection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-assay-600" aria-hidden="true" />
                      NABL accredited lab
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bloom-600" aria-hidden="true" />
                      Specialist reviewed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
