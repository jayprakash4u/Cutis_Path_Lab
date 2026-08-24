"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { bookingCreateSchema, bookingQuickSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";

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

export default function BookPackagePage() {
  const params = useParams();
  const router = useRouter();
  const packageId = String(params.id || "").trim();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!packageId) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/packages/${encodeURIComponent(packageId)}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Package not found");
        }
        if (!cancelled) setPkg(json.data);
      } catch (err) {
        if (!cancelled) {
          setPkg(null);
          setError(err.message || "Failed to load package");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [packageId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const pkgTests = pkg?.tests || [];
  const includeItems = pkg?.includeItems || [];

  const handleBookSingle = (testId) => {
    if (!testId) return;
    router.push(`/book?testIds=${encodeURIComponent(testId)}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pkg) return;

    const quick = parseOrErrors(bookingQuickSchema, formData);
    if (!quick.ok) {
      setFieldErrors(quick.errors);
      alert(quick.message);
      return;
    }

    const payload = parseOrErrors(bookingCreateSchema, {
      name: quick.data.name,
      phone: quick.data.phone,
      address: quick.data.address || "",
      preferredDate: quick.data.date,
      preferredTime: quick.data.time,
      packageId: pkg.id,
      notes: `Package: ${pkg.name} (${pkg.code || pkg.id})`,
    });
    if (!payload.ok) {
      setFieldErrors(payload.errors);
      alert(payload.message);
      return;
    }

    try {
      setSubmitting(true);
      setFieldErrors({});
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.errors) setFieldErrors(json.errors);
        throw new Error(json.message || "Failed to save booking");
      }
      setSuccess(true);
    } catch (err) {
      alert(err.message || "Failed to save booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <p className="text-center text-slate-500 py-20 text-sm">Loading package…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Package Not Found</h1>
            <p className="text-slate-600 mb-8">
              {error || "The package you are looking for does not exist or has been removed."}
            </p>
            <Link href="/packages">
              <button className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors">
                Back to Packages
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Booking Confirmed</h1>
            <p className="text-slate-600 mb-2">
              Your booking for <span className="font-semibold text-brand-700">{pkg.name}</span> has
              been saved.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Our team will contact you shortly to confirm the appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/packages"
                className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
              >
                Browse Packages
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Go Home
              </Link>
            </div>
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
        <section className="relative h-48 lg:h-60 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <Link
              href="/packages"
              className="self-start text-brand-100 hover:text-white text-sm transition-colors mb-2"
            >
              ← Back to Packages
            </Link>
            <h1 className="text-2xl lg:text-4xl font-bold text-white">{pkg.name}</h1>
            <p className="text-brand-100 text-sm lg:text-base mt-1 max-w-lg">{pkg.description}</p>
            <span className="mt-2 inline-block px-4 py-1 rounded-full bg-white/20 text-white text-xs lg:text-sm font-semibold">
              Rs. {pkg.price} · {(pkg.includes || []).length} Tests Included
            </span>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
                <div className="bg-brand-600 px-5 py-2">
                  <h2 className="text-sm lg:text-base font-bold text-white">What&apos;s Included</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {includeItems.map((item, index) => (
                      <div
                        key={`${item.testName}-${index}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                            T
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {item.testName || item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.category || pkg.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {item.price != null && (
                            <span className="text-sm font-bold text-brand-600">₹{item.price}</span>
                          )}
                          {item.testId && (
                            <button
                              type="button"
                              onClick={() => handleBookSingle(item.testId)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                            >
                              Book
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <h3 className="text-base font-semibold text-slate-800 mb-2">About This Package</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pkg.description}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden sticky top-32"
              >
                <div className="bg-brand-600 px-5 py-3">
                  <h3 className="text-sm font-bold text-white">Book This Package</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-brand-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Package Price</p>
                      <p className="text-2xl font-bold text-brand-600">Rs. {pkg.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-0.5">Tests Included</p>
                      <p className="text-xl font-bold text-slate-800">
                        {(pkg.includes || []).length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="98xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder="Home / collection address"
                    />
                  </div>

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
                      style={{ colorScheme: "light" }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 cursor-pointer"
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
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none bg-white text-slate-800"
                    >
                      <option value="">Select time…</option>
                      {[
                        "8:00 AM",
                        "9:00 AM",
                        "10:00 AM",
                        "11:00 AM",
                        "12:00 PM",
                        "2:00 PM",
                        "3:00 PM",
                        "4:00 PM",
                        "5:00 PM",
                        "6:00 PM",
                      ].map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm disabled:opacity-60"
                  >
                    {submitting ? "Booking…" : `Book Package (Rs. ${pkg.price})`}
                  </button>

                  {pkgTests.length > 0 && (
                    <Link
                      href={`/book?testIds=${encodeURIComponent(pkgTests.map((t) => t.id).join(","))}`}
                      className="block w-full py-2.5 text-center text-brand-600 font-semibold text-sm hover:underline"
                    >
                      Or book linked tests individually →
                    </Link>
                  )}

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Tests Included ({includeItems.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {includeItems.slice(0, 4).map((t, i) => (
                        <span
                          key={`${t.testName}-${i}`}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full"
                        >
                          {t.testName}
                        </span>
                      ))}
                      {includeItems.length > 4 && (
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] rounded-full font-medium">
                          +{includeItems.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
