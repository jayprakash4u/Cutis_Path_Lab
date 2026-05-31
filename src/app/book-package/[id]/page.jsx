"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { tests } from "@/data/staticData";

/**
 * Packages that are searchable from the navbar (must match the list in Navbar.jsx)
 */
const PACKAGES = [
  { id: 1, name: "Complete Blood Count", description: "Comprehensive blood analysis including RBC, WBC, platelets, hemoglobin, and hematocrit.", includes: ["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"], price: 350 },
  { id: 2, name: "Liver Function Test", description: "Tests for liver health including enzymes, bilirubin, and protein levels.", includes: ["ALT", "AST", "Bilirubin", "Albumin", "Total Protein"], price: 800 },
  { id: 3, name: "Kidney Function Test", description: "Evaluates kidney performance through blood urea and creatinine tests.", includes: ["Creatinine", "BUN", "Uric Acid", "Electrolytes", "eGFR"], price: 700 },
  { id: 4, name: "Thyroid Profile", description: "Complete thyroid function assessment including T3, T4, and TSH.", includes: ["T3", "T4", "TSH", "Free T3", "Free T4"], price: 1200 },
  { id: 5, name: "Blood Sugar Fasting", description: "Fasting blood glucose test for diabetes screening and management.", includes: ["Fasting Glucose", "PP Glucose", "HbA1c"], price: 200 },
  { id: 6, name: "Lipid Profile", description: "Cholesterol and triglyceride assessment for heart health.", includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"], price: 600 },
  { id: 7, name: "Hemoglobin A1C", description: "Long-term blood sugar monitoring for diabetes management.", includes: ["HbA1c", "Average Blood Glucose"], price: 500 },
  { id: 8, name: "Vitamin D3", description: "Test for Vitamin D deficiency and bone health assessment.", includes: ["Vitamin D3", "Vitamin D2", "Total Vitamin D"], price: 1500 },
  { id: 9, name: "Iron Studies", description: "Comprehensive iron deficiency and anemia workup.", includes: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"], price: 900 },
  { id: 10, name: "Dengue NS1 Antigen", description: "Early detection test for dengue fever infection.", includes: ["NS1 Antigen", "IgM Antibody", "IgG Antibody"], price: 800 },
  { id: 11, name: "Urine Analysis", description: "Complete urine examination for kidney and urinary tract health.", includes: ["pH", "Protein", "Glucose", "Ketones", "Microscopy"], price: 250 },
  { id: 12, name: "ECG", description: "Electrocardiogram for heart rhythm and function assessment.", includes: ["Heart Rhythm", "Heart Rate", "Cardiac Axis", "Abnormalities"], price: 400 },
  { id: 13, name: "Vitamin B12", description: "Test for Vitamin B12 deficiency and neurological health.", includes: ["Vitamin B12", "Folate", "Homocysteine"], price: 1200 },
  { id: 14, name: "HbA1c & Glucose", description: "Combined test for diabetes diagnosis and monitoring.", includes: ["HbA1c", "Fasting Glucose", "PP Glucose"], price: 650 },
  { id: 15, name: "Uric Acid", description: "Test for gout and kidney stone risk assessment.", includes: ["Uric Acid", "Creatinine", "BUN"], price: 300 },
  { id: 16, name: "ESR", description: "Erythrocyte sedimentation rate for inflammation detection.", includes: ["ESR", "CRP", "WBC Count"], price: 150 },
  { id: 17, name: "Malaria Antigen", description: "Rapid test for malaria parasite detection.", includes: ["Malaria Antigen", "P. falciparum", "P. vivax"], price: 450 },
  { id: 18, name: "Pregnancy Test", description: "Beta HCG test for pregnancy confirmation.", includes: ["Beta HCG", "Qualitative", "Quantitative"], price: 350 },
  { id: 19, name: "Semen Analysis", description: "Complete semen examination for fertility assessment.", includes: ["Count", "Motility", "Morphology", "Volume"], price: 500 },
  { id: 20, name: "Stool Routine", description: "Complete stool examination for digestive health.", includes: ["Color", "Consistency", "Microscopy", "Occult Blood"], price: 200 },
  { id: 21, name: "Blood Group & Rh", description: "ABO blood group and Rh factor determination.", includes: ["ABO Group", "Rh Factor", "Antibody Screen"], price: 250 },
  { id: 22, name: "Coagulation Profile", description: "Blood clotting function assessment.", includes: ["PT", "aPTT", "INR", "Fibrinogen"], price: 800 },
  { id: 23, name: "Serum Electrolytes", description: "Electrolyte balance assessment for hydration status.", includes: ["Sodium", "Potassium", "Chloride", "Bicarbonate"], price: 400 },
  { id: 24, name: "Amylase & Lipase", description: "Pancreatic enzyme test for pancreatitis diagnosis.", includes: ["Amylase", "Lipase", "Calcium"], price: 700 },
  { id: 25, name: "Prostate Specific Antigen", description: "PSA test for prostate health screening.", includes: ["Total PSA", "Free PSA", "PSA Ratio"], price: 900 },
];

/**
 * Resolve package included test names to actual test objects from staticData.
 * Matches by exact name, then partial.
 */
function resolvePackageTests(includedTestNames) {
  const resolved = [];
  const usedIds = new Set();
  for (const name of includedTestNames) {
    const lowerName = name.toLowerCase().trim();
    // Exact match first
    let match = tests.find(
      (t) => t.name.toLowerCase().trim() === lowerName
    );
    // Partial match fallback
    if (!match) {
      match = tests.find((t) => t.name.toLowerCase().includes(lowerName));
    }
    if (match && !usedIds.has(match.id)) {
      resolved.push(match);
      usedIds.add(match.id);
    }
  }
  return resolved;
}

export default function BookPackagePage() {
  const params = useParams();
  const router = useRouter();
  const packageId = Number(params.id);

  /**
   * Inline CSS so the browser's native date-picker popup (Chrome / Edge / Safari)
   * uses light-mode text/calendar-icon colours that match the surrounding UI.
   */
  const datePickerStyles = `
    input[type="date"] {
      color-scheme: light;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(0.25) sepia(0.3) saturate(3) hue-rotate(200deg);
    }
    input[type="date"]::-webkit-datetime-edit-text,
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field,
    input[type="date"]::-webkit-datetime-edit-year-field {
      color: #1e293b;
    }
  `;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    address: "",
  });

  const pkg = useMemo(
    () => PACKAGES.find((p) => p.id === packageId),
    [packageId]
  );

  const pkgTests = useMemo(
    () => (pkg ? resolvePackageTests(pkg.includes) : []),
    [pkg]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle individual test booking → redirect to /book?testIds=T001 (single)
  const handleBookSingle = (testId) => {
    router.push(`/book?testIds=${encodeURIComponent(testId)}`);
  };

  // Quick-book with phone number (shows confirmation)
  const handleQuickBook = (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    if (pkgTests.length === 0) {
      alert("This package has no tests available for booking.");
      return;
    }
    const ids = pkgTests.map((t) => t.id).join(",");
    router.push(`/book?testIds=${encodeURIComponent(ids)}`);
  };

  // 404 – Package not found
  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Package Not Found
            </h1>
            <p className="text-slate-600 mb-8">
              The package you are looking for does not exist or has been removed.
            </p>
            <Link href="/packages">
              <button className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                Back to Packages
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{datePickerStyles}</style>
      <Navbar />
      <main className="pt-[80px] lg:pt-[88px]">
        {/* Hero Banner */}
        <section className="relative h-48 lg:h-60 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <Link
              href="/packages"
              className="self-start text-sky-100 hover:text-white text-sm transition-colors mb-2"
            >
              ← Back to Packages
            </Link>
            <h1 className="text-2xl lg:text-4xl font-bold text-white">
              {pkg.name}
            </h1>
            <p className="text-sky-100 text-sm lg:text-base mt-1 max-w-lg">
              {pkg.description}
            </p>
            <span className="mt-2 inline-block px-4 py-1 rounded-full bg-white/20 text-white text-xs lg:text-sm font-semibold">
              Rs. {pkg.price} · {pkg.includes.length} Tests Included
            </span>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left — Package Test Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* What's Included */}
              <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <div className="bg-[#FF6B6B] px-5 py-2">
                  <h2 className="text-sm lg:text-base font-bold text-white">
                    What&apos;s Included
                  </h2>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {pkgTests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
                            T
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {test.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {test.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold text-sky-600">
                            ₹{test.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBookSingle(test.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package Description */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <h3 className="text-base font-semibold text-slate-800 mb-2">
                  About This Package
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            </div>

            {/* Right — Quick Book Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden sticky top-32">
                {/* Price Card */}
                <div className="bg-sky-600 px-5 py-3">
                  <h3 className="text-sm font-bold text-white">Book This Package</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Total Price */}
                  <div className="bg-sky-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Package Price</p>
                      <p className="text-2xl font-bold text-sky-600">
                        Rs. {pkg.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-0.5">Tests Included</p>
                      <p className="text-xl font-bold text-slate-800">
                        {pkg.includes.length}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                       <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                         Preferred Date *
                       </label>
                        <input
                           type="date"
                           name="date"
                           required
                           min={new Date().toISOString().split("T")[0]}
                           value={formData.date}
                           onChange={handleChange}
                           style={{ colorScheme: 'light' }}
                           className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white
                                      text-slate-800 placeholder:text-slate-400
                                      focus:border-sky-500 focus:ring-2 focus:ring-sky-100
                                      text-sm outline-none transition-colors cursor-pointer"
                        />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                         Preferred Time Slot *
                       </label>
                      <select
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none transition-colors bg-white"
                      >
                        <option value="">Select time…</option>
                        {[
                          "8:00 AM","9:00 AM","10:00 AM","11:00 AM",
                          "12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM",
                        ].map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <button
                    type="button"
                    onClick={handleQuickBook}
                    className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#e55a5a] transition-colors text-sm"
                  >
                    Book All Tests (Rs. {pkg.price})
                  </button>

                  <Link
                    href={`/book?testIds=${encodeURIComponent(pkgTests.map((t) => t.id).join(","))}`}
                    className="block w-full py-2.5 text-center text-sky-600 font-semibold text-sm hover:underline"
                  >
                    View Full Booking Page →
                  </Link>

                  {/* Tests Summary */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Tests Included ({pkgTests.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {pkgTests.slice(0, 4).map((t) => (
                        <span
                          key={t.id}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full"
                        >
                          {t.name}
                        </span>
                      ))}
                      {pkgTests.length > 4 && (
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] rounded-full font-medium">
                          +{pkgTests.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
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
