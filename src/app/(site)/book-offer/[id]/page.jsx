"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
`;

export default function BookOfferPage() {
  const params = useParams();
  const offerId = String(params.id || "").trim();

  const [offer, setOffer] = useState(null);
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
    if (!offerId) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/offers/${encodeURIComponent(offerId)}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Offer not found");
        }
        if (!cancelled) setOffer(json.data);
      } catch (err) {
        if (!cancelled) {
          setOffer(null);
          setError(err.message || "Failed to load offer");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [offerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offer) return;

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
      offerId: offer.id,
      packageId: offer.packageId || null,
      testId: offer.testId || null,
      notes: `Special Offer: ${offer.name} — ₹${offer.discountedPrice} (${offer.discount}% OFF)`,
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
          <p className="text-center text-slate-500 py-20 text-sm">Loading offer…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-[80px] lg:pt-[88px]">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Offer Not Found</h1>
            <p className="text-slate-600 mb-8">{error || "This offer is no longer available."}</p>
            <Link href="/" className="text-sky-600 font-semibold hover:underline">
              Back to Home
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
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Offer Booked</h1>
            <p className="text-slate-600 mb-2">
              Your booking for <span className="font-semibold text-sky-700">{offer.name}</span> at{" "}
              <span className="font-semibold">₹{offer.discountedPrice}</span> is saved.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              We will contact you shortly to confirm.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
            >
              Back to Home
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
        <section className="relative h-40 lg:h-48 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full max-w-3xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <Link href="/" className="self-start text-sky-100 hover:text-white text-sm mb-2">
              ← Back to Home
            </Link>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
              Special Offer · {offer.discount}% OFF
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{offer.name}</h1>
            <p className="mt-2 text-white text-lg font-semibold">
              ₹{offer.discountedPrice}{" "}
              <span className="text-sky-100 text-sm line-through font-normal">
                ₹{offer.originalPrice}
              </span>
            </p>
          </div>
        </section>

        <div className="max-w-lg mx-auto px-4 py-8 lg:py-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden"
          >
            <div className="bg-[#FF6B6B] px-5 py-3">
              <h2 className="text-sm font-bold text-white">Book This Offer</h2>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-slate-400 mb-0.5">Reports</p>
                  <p className="font-medium">{offer.reportsTime || "24 hrs"}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Fasting</p>
                  <p className="font-medium">{offer.fasting || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Sample</p>
                  <p className="font-medium">{offer.sampleType || "Blood"}</p>
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white"
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
                className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#e55a5a] transition-colors text-sm disabled:opacity-60"
              >
                {submitting
                  ? "Booking…"
                  : `Confirm Booking — ₹${offer.discountedPrice}`}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
