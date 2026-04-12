"use client";

/**
 * Service Detail Page Component
 * Displays detailed information about a specific diagnostic service
 * 
 * @description Shows service overview, what to expect, indications, and booking options
 */

// ========== REACT HOOKS ==========
import { useState } from "react";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ========== NAVIGATION & DATA ==========
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { services } from "@/data/staticData";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Static content constants
 */
const CONTENT = {
  NOT_FOUND: {
    TITLE: "Service Not Found",
    MESSAGE: "The service you're looking for doesn't exist.",
    LINK_TEXT: "Back to Services",
  },
  
  // What to Expect section data
  WHAT_TO_EXPECT: [
    { title: "Sample Collection", desc: "Professional and comfortable sample collection process" },
    { title: "Advanced Analysis", desc: "State-of-the-art equipment and methodologies" },
    { title: "Accurate Results", desc: "Comprehensive and detailed diagnostic reports" },
    { title: "Expert Consultation", desc: "Results reviewed by highly qualified specialists" },
  ],
  
  // Quick stats data
  STATS: {
    ADVANCED_TESTING: "State-of-Art",
    FAST_PROCESSING: "24-48 Hours",
    EXPERT_TEAM: "15+ Years",
  },
  
  // Sidebar benefits
  BENEFITS: [
    "Home collection available",
    "24-48 hour reports",
    "Free consultation",
    "Certified labs",
  ],
  
  // Section titles
  TITLES: {
    ABOUT: "About This Service",
    WHAT_TO_EXPECT: "What to Expect",
    INDICATIONS: "When to Get This Test",
    RELATED: "Related Services",
    CTA: "Ready to Get Started?",
  },
};

/**
 * Generates dynamic indication text based on service name
 * @param {string} serviceName - Name of the service
 * @returns {string} Indications text
 */
const getIndications = (serviceName) => {
  return `${serviceName} testing is recommended for patients with specific clinical presentations, 
  family history of genetic conditions, or as part of comprehensive diagnostic workup. 
  Consult with your healthcare provider to determine if this service is right for you.`;
};

// ========== MAIN COMPONENT ==========

export default function ServiceDetailPage() {
  // Get service ID from URL params
  const params = useParams();
  const serviceId = parseInt(params.id);
  
  // Find service by ID
  const service = services.find((s) => s.id === serviceId);
  
  // Booking status state for showing success message
  const [bookingStatus, setBookingStatus] = useState(null);

  // ========== NOT FOUND STATE ==========
  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{CONTENT.NOT_FOUND.TITLE}</h1>
            <p className="text-slate-600 mb-4">{CONTENT.NOT_FOUND.MESSAGE}</p>
            <Link href="/services" className="text-sky-600 hover:text-sky-700 font-medium">
              {CONTENT.NOT_FOUND.LINK_TEXT}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related services (excluding current service, limit to 3)
  const relatedServices = services.filter((s) => s.id !== serviceId).slice(0, 3);

  /**
   * Handle booking button click
   * Shows success message for 3 seconds
   */
  const handleBooking = () => {
    setBookingStatus("success");
    setTimeout(() => {
      setBookingStatus(null);
    }, 3000);
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-16">
        
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/services" className="hover:text-sky-600">
                Services
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sky-600 font-medium">{service.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section with Background Image */}
        <section className="relative py-16 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {service.name}
                </h1>
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  {service.description}
                </p>
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBooking}
                    className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-sky-900 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Book Now
                  </button>
                  <Link
                    href="/contact"
                    className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors border border-white/40"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              {/* Service Image (Desktop only) */}
              <div className="hidden lg:block relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Advanced Testing */}
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Advanced Testing</p>
                    <p className="text-2xl font-bold">{CONTENT.STATS.ADVANCED_TESTING}</p>
                  </div>
                </div>
              </div>

              {/* Fast Processing */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Fast Processing</p>
                    <p className="text-2xl font-bold">{CONTENT.STATS.FAST_PROCESSING}</p>
                  </div>
                </div>
              </div>

              {/* Expert Team */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Expert Team</p>
                    <p className="text-2xl font-bold">{CONTENT.STATS.EXPERT_TEAM}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Main Content Column */}
              <div className="lg:col-span-2">
                
                {/* About Service */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">{CONTENT.TITLES.ABOUT}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Our {service.name} service is backed by cutting-edge technology and a team of highly 
                    qualified specialists with years of experience. We are committed to delivering accurate 
                    results and exceptional patient care, ensuring optimal outcomes in diagnosis and treatment planning.
                  </p>
                </div>

                {/* What to Expect - using CONTENT.WHAT_TO_EXPECT */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{CONTENT.TITLES.WHAT_TO_EXPECT}</h2>
                  <div className="grid gap-4">
                    {CONTENT.WHAT_TO_EXPECT.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-500 text-white font-bold">
                            {idx + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.title}</h3>
                          <p className="text-slate-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indications */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{CONTENT.TITLES.INDICATIONS}</h2>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
                    <p className="text-slate-700 leading-relaxed">
                      {getIndications(service.name)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-sky-500 to-sky-600 rounded-2xl p-8 text-white shadow-2xl sticky top-24">
                  {/* Service Badge */}
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-white/90 mb-4">
                      Professional Service
                    </div>
                  </div>

                  {/* Service Name */}
                  <h3 className="text-2xl font-bold mb-4">{service.name}</h3>

                  {/* Booking Status Message */}
                  {bookingStatus === "success" && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-300/50 rounded-lg text-sm text-green-100">
                      ✓ Request submitted successfully! We'll contact you soon.
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full px-6 py-3 mb-4 bg-yellow-400 hover:bg-yellow-300 text-sky-900 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Book This Service
                  </button>

                  {/* Benefits List from CONTENT */}
                  <div className="space-y-3 pt-6 border-t border-white/20">
                    <h4 className="font-semibold text-white/90 mb-4">Why Choose Us?</h4>
                    {CONTENT.BENEFITS.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-white/90">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact Link */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-white/80 mb-2">Questions? Get in touch</p>
                    <Link href="/contact" className="inline-block text-yellow-300 hover:text-yellow-200 font-semibold text-sm underline">
                      Contact us today →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{CONTENT.TITLES.RELATED}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.id}`} className="group">
                  <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-slate-200">
                    <Image
                      src={relatedService.image}
                      alt={relatedService.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 mb-2">
                    {relatedService.name}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {relatedService.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-sky-600 to-sky-500">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {CONTENT.TITLES.CTA}
            </h2>
            <p className="text-sky-100 mb-8 text-lg">
              Book your {service.name} service today and take the first step towards better health.
            </p>
            <button
              onClick={handleBooking}
              className="inline-block px-8 py-3 bg-white text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors"
            >
              Book Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}