"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { tests } from "@/data/staticData";
import { categoryTone } from "@/lib/categoryTone";
import { TestIconView } from "@/lib/testIcons";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Test details" },
  { id: "preparation", label: "Preparation" },
];

const TILE_BG = {
  clinical: "bg-clinical-100 text-clinical-700",
  assay: "bg-assay-100 text-assay-700",
  bloom: "bg-bloom-100 text-bloom-700",
  flag: "bg-flag-100 text-flag-700",
};

// Tailwind can't see classes built with template-literal interpolation
// (`border-${tone}-600`), so every tone variant is spelled out literally here.
const TONE_CLASSES = {
  clinical: {
    tab: "border-clinical-600 text-clinical-700",
    borderT: "border-t-clinical-600",
    text700: "text-clinical-700",
    bgLight: "bg-clinical-50",
    bg600: "bg-clinical-600",
  },
  assay: {
    tab: "border-assay-600 text-assay-700",
    borderT: "border-t-assay-600",
    text700: "text-assay-700",
    bgLight: "bg-assay-100",
    bg600: "bg-assay-600",
  },
  bloom: {
    tab: "border-bloom-600 text-bloom-700",
    borderT: "border-t-bloom-600",
    text700: "text-bloom-700",
    bgLight: "bg-bloom-100",
    bg600: "bg-bloom-600",
  },
  flag: {
    tab: "border-flag-600 text-flag-700",
    borderT: "border-t-flag-600",
    text700: "text-flag-700",
    bgLight: "bg-flag-100",
    bg600: "bg-flag-600",
  },
};

export default function TestDetailPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const test = tests.find((t) => t.id === params.id);

  if (!test) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="pt-below-nav-tall">
          <div className="shell py-20 text-center">
            <h1 className="sec-title">Test not found</h1>
            <p className="mt-2 text-sm text-ink-500">
              The test you are looking for does not exist.
            </p>
            <Link href="/tests" className="btn-primary mt-6 inline-flex">
              Back to tests
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tone = categoryTone(test.category);
  const toneClasses = TONE_CLASSES[tone];
  const discount = Math.round(
    ((test.originalPrice - test.price) / test.originalPrice) * 100,
  );

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="pt-below-nav-tall pb-16">
        <div className="border-b border-line bg-surface">
          <div className="shell flex items-center gap-2 py-4 text-[13px] text-ink-500">
            <Link href="/tests" className="hover:text-clinical-700">
              Tests
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink-900">{test.name}</span>
          </div>
        </div>

        <div className="shell py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`chip-${tone}`}>{test.category}</span>
                  <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
                    {test.name}
                  </h1>
                </div>
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ${TILE_BG[tone]}`}
                >
                  <TestIconView test={test} size={28} />
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                {test.description}
              </p>

              {/* Tabs */}
              <div className="mt-8 flex gap-6 border-b border-line">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px border-b-2 pb-3 text-[13px] font-semibold transition-colors ${
                      activeTab === tab.id
                        ? toneClasses.tab
                        : "border-transparent text-ink-500 hover:text-ink-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className={`card border-t-[3px] p-5 sm:p-6 ${toneClasses.borderT}`}>
                      <h3 className="text-[0.9375rem] font-semibold text-ink-900">
                        What this test measures
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                        {test.description} Results are reported with a reference
                        interval alongside the value, so it is clear where a
                        result sits before your clinician reviews it.
                      </p>
                    </div>

                    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                      {[
                        ["Sample type", test.sampleType],
                        ["Fasting required", test.fastingRequired ? "Yes" : "No"],
                        ["Report delivery", test.reportTime],
                        ["Parameters", test.parameters],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-surface p-4">
                          <dt className="label">{k}</dt>
                          <dd className="mono mt-1.5 text-sm font-semibold text-ink-900">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="card p-5 sm:p-6">
                      <h3 className="text-[0.9375rem] font-semibold text-ink-900">
                        Test components
                      </h3>
                      <p className="mt-2 text-[13px] text-ink-600">
                        This panel includes{" "}
                        <span className={`font-semibold ${toneClasses.text700}`}>
                          {test.parameters}
                        </span>{" "}
                        parameter{test.parameters > 1 ? "s" : ""} in a single
                        run.
                      </p>
                    </div>
                    <div className="card border-l-[3px] border-l-clinical-600 p-5 sm:p-6">
                      <h4 className="text-[0.9375rem] font-semibold text-ink-900">
                        Clinical significance
                      </h4>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                        This test supports early detection and ongoing
                        monitoring of related conditions. Regular testing is
                        recommended as part of preventive care where your
                        clinician advises it.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "preparation" && (
                  <div className="space-y-4">
                    <div className="card p-5 sm:p-6">
                      <h3 className="text-[0.9375rem] font-semibold text-ink-900">
                        Before your appointment
                      </h3>
                      <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-ink-600">
                        <p>
                          <span className="font-semibold text-ink-900">Fasting — </span>
                          {test.fastingRequired
                            ? "An 8–12 hour fast is required. Water is fine during that window."
                            : "No fasting is required for this test."}
                        </p>
                        <p>
                          <span className="font-semibold text-ink-900">Sample — </span>
                          A {test.sampleType.toLowerCase()} sample is collected by
                          a trained phlebotomist, at the lab or at your door.
                        </p>
                      </div>
                    </div>
                    <div className="card border-t-[3px] border-t-assay-600 p-5 sm:p-6">
                      <span className="chip-assay">Report delivery</span>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                        Your report is delivered in{" "}
                        <span className="font-semibold text-ink-900">
                          {test.reportTime}
                        </span>{" "}
                        by email or WhatsApp.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-28 overflow-hidden">
                <div className={`border-b border-line px-5 py-3 ${toneClasses.bgLight}`}>
                  <p className="label">Price</p>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="mono text-2xl font-bold text-ink-900">
                      Rs {test.price}
                    </span>
                    <span className="mono text-sm text-ink-400 line-through">
                      Rs {test.originalPrice}
                    </span>
                  </div>
                  <span className="chip-flag mt-2 inline-flex">
                    Save {discount}%
                  </span>

                  <div className="mt-5 flex items-center justify-between rounded-md border border-line px-3 py-2">
                    <span className="text-[13px] font-medium text-ink-700">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-600 hover:border-clinical-500 hover:text-clinical-700"
                      >
                        −
                      </button>
                      <span className="mono w-5 text-center text-sm font-semibold text-ink-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-600 hover:border-clinical-500 hover:text-clinical-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-[13px] font-semibold text-ink-900">
                      Total
                    </span>
                    <span className="mono text-lg font-bold text-ink-900">
                      Rs {(test.price * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    href={`/book?testIds=${encodeURIComponent(test.id)}`}
                    className="btn-primary mt-5 w-full !py-3"
                  >
                    Book this test
                  </Link>

                  <ul className="mono mt-6 space-y-2 border-t border-line pt-5 text-[11px] uppercase tracking-[0.1em] text-ink-500">
                    {["ISO certified laboratory", "Expert phlebotomists", "Fast, accurate results"].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${toneClasses.bg600}`}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related tests */}
          {(() => {
            const related = tests
              .filter((t) => t.category === test.category && t.id !== test.id)
              .slice(0, 3);
            if (related.length === 0) return null;
            return (
              <div className="mt-14 border-t border-line pt-10">
                <h2 className="sec-title">Related tests</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {related.map((relatedTest) => {
                    const relatedTone = categoryTone(relatedTest.category);
                    return (
                      <Link
                        key={relatedTest.id}
                        href={`/tests/${relatedTest.id}`}
                        className="card card-hover flex flex-col p-5"
                      >
                        <span className={`chip-${relatedTone}`}>
                          {relatedTest.category}
                        </span>
                        <h3 className="mt-3 text-[0.9375rem] font-semibold text-ink-900">
                          {relatedTest.name}
                        </h3>
                        <p className="mono mt-2 text-sm font-semibold text-ink-900">
                          Rs {relatedTest.price}
                        </p>
                        <span className="mt-3 text-[13px] font-semibold text-clinical-700">
                          View details →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
