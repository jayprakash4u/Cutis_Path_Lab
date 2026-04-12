"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { tests } from "@/data/staticData";
import Link from "next/link";

// Icon renderer using test-specific icons from staticData
const TestIcon = ({ iconPath, className }) => {
  if (!iconPath) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={iconPath} />
    </svg>
  );
};

// Icon components
const icons = {
  flask: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  book: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.754 10-10.747 0-5.002-4.5-10.747-10-10.747z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Find the test
  const test = tests.find((t) => t.id === params.id);

  if (!test) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Test Not Found</h1>
            <p className="text-slate-600 mb-8">
              The test you're looking for doesn't exist.
            </p>
            <Link href="/tests">
              <button className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                Back to Tests
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(
    ((test.originalPrice - test.price) / test.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[80px] lg:pt-[88px]">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/tests" className="hover:text-sky-600 transition-colors">
                Tests
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-medium">{test.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Test Information */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-sky-100 text-sky-700 mb-4">
                      {test.category}
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900">{test.name}</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    {test.icon && (
                      <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
                        <TestIcon iconPath={test.icon} className="w-10 h-10 text-sky-600" />
                      </div>
                    )}
                    {test.popular && (
                      <span className="text-4xl">⭐</span>
                    )}
                  </div>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {test.description}
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-8 border-b border-slate-200">
                <div className="flex gap-6">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "details", label: "Test Details" },
                    { id: "preparation", label: "Preparation" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 font-semibold transition-all ${
                        activeTab === tab.id
                          ? "border-b-2 border-sky-600 text-sky-600"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 border border-sky-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">What is this test?</h3>
                      <p className="text-slate-700 leading-relaxed">
                        {test.description} This test provides essential information about your
                        health status and helps healthcare professionals make informed decisions
                        regarding your medical care.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Sample Type", value: test.sampleType, icon: "flask" },
                        { label: "Fasting Required", value: test.fastingRequired ? "Yes" : "No", icon: "check" },
                        { label: "Report Delivery Time", value: test.reportTime, icon: "clock" },
                        { label: "Number of Parameters", value: test.parameters, icon: "book" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sky-600">{icons[item.icon]}</div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-600 font-medium mb-1">
                                {item.label}
                              </p>
                              <p className="text-base font-semibold text-slate-900">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Test Components</h3>
                      <p className="text-slate-600 mb-4">
                        This comprehensive test includes <span className="font-semibold text-sky-600">{test.parameters}</span> different parameters to provide a complete assessment.
                      </p>
                      <ul className="space-y-2">
                        {[...Array(Math.min(test.parameters, 8))].map((_, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            Parameter {i + 1}
                          </li>
                        ))}
                        {test.parameters > 8 && (
                          <li className="text-slate-600 font-medium">
                            + {test.parameters - 8} more parameters
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 flex gap-4">
                      <div className="text-blue-600 flex-shrink-0">{icons.info}</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Clinical Significance</h4>
                        <p className="text-blue-800">
                          This test helps in early detection of various health conditions and
                          monitoring of existing medical conditions. Regular testing is recommended
                          as part of preventive healthcare.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "preparation" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Pre-Test Preparation</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Fasting Instructions</h4>
                          <p className="text-slate-700">
                            {test.fastingRequired
                              ? "An 8-12 hour fast is required before this test. Please avoid food and beverages (except water) after midnight."
                              : "No fasting is required for this test. You may eat and drink normally before your appointment."}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Sample Collection</h4>
                          <p className="text-slate-700">
                            A {test.sampleType.toLowerCase()} sample will be collected by our trained phlebotomist.
                            Please wear comfortable clothing that allows easy access to your arms.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">What to Bring</h4>
                          <ul className="space-y-2 text-slate-700">
                            <li className="flex items-center gap-2">
                              <span className="text-sky-600">✓</span> Valid government-issued ID
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-sky-600">✓</span> Health insurance card (if applicable)
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-sky-600">✓</span> Any relevant medical records
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
                      <h3 className="font-semibold text-emerald-900 mb-3">✓ Report Delivery</h3>
                      <p className="text-emerald-800">
                        Your detailed test report will be available within <span className="font-semibold">{test.reportTime}</span> and will be sent via email. You can also access it through your patient portal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl border border-sky-200 p-6 sticky top-[120px]">
                {/* Price Section */}
                <div className="mb-6 pb-6 border-b border-sky-200">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-sky-600">₹{test.price}</span>
                    <span className="text-lg text-slate-500 line-through">₹{test.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                      Save ₹{test.originalPrice - test.price} ({discount}%)
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-semibold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="mb-6 pb-6 border-b border-sky-200 bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{(test.price * quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-3">
                    <span>Sample Collection Fee</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-sky-600">
                      ₹{(test.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-sky-700 hover:to-sky-600 transition-all duration-300">
                    Book This Test
                  </button>
                  <button className="w-full border-2 border-sky-600 text-sky-600 font-semibold py-3 rounded-lg hover:bg-sky-50 transition-colors">
                    Add to Cart
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 pt-6 border-t border-sky-200">
                  {[
                    { icon: "✓", text: "ISO Certified Laboratory" },
                    { icon: "✓", text: "Expert Phlebotomists" },
                    { icon: "✓", text: "Fast & Accurate Results" },
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-sky-600 font-bold">{badge.icon}</span>
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tests Section */}
        <div className="bg-slate-50 border-t border-slate-200 py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tests
                .filter((t) => t.category === test.category && t.id !== test.id)
                .slice(0, 3)
                .map((relatedTest) => (
                  <Link key={relatedTest.id} href={`/tests/${relatedTest.id}`}>
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 mb-4">
                        {relatedTest.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                        {relatedTest.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        ₹{relatedTest.price}
                      </p>
                      <button className="text-sky-600 font-semibold text-sm hover:text-sky-700 transition-colors">
                        View Details →
                      </button>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
