"use client";

/**
 * Package Detail Page Component
 * Displays detailed information about a specific test package
 * 
 * @description Shows package details, prerequisites, included tests, and booking options
 */

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ========== NAVIGATION ==========
import Link from "next/link";
import { useParams } from "next/navigation";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Package data - In production, this would come from an API or staticData
 * Each package has: id, name, category, description, price, image, prerequisites, includedTests
 */
const PACKAGES = [
  {
    id: 1,
    name: "NPL General Health Check Up Package",
    description: "Comprehensive health checkup package covering all essential tests for overall health assessment.",
    price: 1500,
    testsCount: 10,
    branchesCount: 7,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
    prerequisites: [
      "Avoiding specific foods and drinks such as cooked meats, herbal tea, or alcohol",
      "Making sure not to overeat the day before a test",
      "Not smoking, avoiding medicines and/or supplements. Be sure to talk with your provider about what you are currently taking",
      "Avoiding specific behaviors such as strenuous exercise or other activity"
    ],
    includedTests: [
      "COMPLETE BLOOD COUNT", "GLUCOSE FASTING", "GLUCOSE, RANDOM", "CHOLESTEROL TOTAL; SERUM",
      "TRIGLYCERIDE; SERUM", "SGOT: SGPT RATIO", "CREATININE, SERUM", "URIC ACID",
      "THYROID-STIMULATING HORMONE; TSH", "URINE EXAMINATION R/E, M/E"
    ],
  },
  {
    id: 2, name: "Complete Blood Count", category: "Hematology",
    description: "Comprehensive blood analysis including RBC, WBC, platelets, hemoglobin, and hematocrit.",
    price: 350, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Avoid heavy meals before the test"],
    includedTests: ["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"],
  },
  {
    id: 3, name: "Liver Function Test", category: "Biochemistry",
    description: "Tests for liver health including enzymes, bilirubin, and protein levels.",
    price: 800, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop",
    prerequisites: ["Fasting for 10-12 hours required", "Avoid alcohol for 24 hours before the test", "Avoid fatty foods the night before"],
    includedTests: ["ALT", "AST", "Bilirubin", "Albumin", "Total Protein"],
  },
  {
    id: 4, name: "Kidney Function Test", category: "Biochemistry",
    description: "Evaluates kidney performance through blood urea and creatinine tests.",
    price: 700, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=800&h=400&fit=crop",
    prerequisites: ["Fasting for 10-12 hours required", "Avoid heavy protein meals the night before"],
    includedTests: ["Creatinine", "BUN", "Uric Acid", "Electrolytes", "eGFR"],
  },
  {
    id: 5, name: "Thyroid Profile", category: "Hormone",
    description: "Complete thyroid function assessment including T3, T4, and TSH.",
    price: 1200, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Inform about current medications"],
    includedTests: ["T3", "T4", "TSH", "Free T3", "Free T4"],
  },
  {
    id: 6, name: "Blood Sugar Fasting", category: "Biochemistry",
    description: "Fasting blood glucose test for diabetes screening and management.",
    price: 200, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=800&h=400&fit=crop",
    prerequisites: ["Fasting for 10-12 hours required", "Only water is allowed during fasting period"],
    includedTests: ["Fasting Glucose", "PP Glucose", "HbA1c"],
  },
  {
    id: 7, name: "Lipid Profile", category: "Biochemistry",
    description: "Cholesterol and triglyceride assessment for heart health.",
    price: 600, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=800&h=400&fit=crop",
    prerequisites: ["Fasting for 10-12 hours required", "Avoid alcohol for 24 hours before the test"],
    includedTests: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"],
  },
  {
    id: 8, name: "Hemoglobin A1C", category: "Diabetes",
    description: "Long-term blood sugar monitoring for diabetes management.",
    price: 500, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Can be done at any time of the day"],
    includedTests: ["HbA1c", "Average Blood Glucose"],
  },
  {
    id: 9, name: "Vitamin D3", category: "Vitamins",
    description: "Test for Vitamin D deficiency and bone health assessment.",
    price: 1500, testsCount: 1, branchesCount: 7,
    image: "https://plus.unsplash.com/premium_photo-1663011406193-7beb9d225d31?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Inform about vitamin supplements"],
    includedTests: ["Vitamin D3", "Vitamin D2", "Total Vitamin D"],
  },
  {
    id: 10, name: "Iron Studies", category: "Hematology",
    description: "Comprehensive iron deficiency and anemia workup.",
    price: 900, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=400&fit=crop",
    prerequisites: ["Fasting for 10-12 hours required", "Avoid iron supplements for 24 hours before the test"],
    includedTests: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"],
  },
  {
    id: 11, name: "Dengue NS1 Antigen", category: "Microbiology",
    description: "Early detection test for dengue fever infection.",
    price: 800, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Can be done at any time"],
    includedTests: ["NS1 Antigen", "IgM Antibody", "IgG Antibody"],
  },
  {
    id: 12, name: "Urine Analysis", category: "Pathology",
    description: "Complete urine examination for kidney and urinary tract health.",
    price: 250, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=400&fit=crop",
    prerequisites: ["First morning sample preferred", "Clean catch sample required"],
    includedTests: ["pH", "Protein", "Glucose", "Ketones", "Microscopy"],
  },
  {
    id: 13, name: "ECG", category: "Cardiology",
    description: "Electrocardiogram for heart rhythm and function assessment.",
    price: 400, testsCount: 1, branchesCount: 7,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    prerequisites: ["No fasting required", "Avoid caffeine before the test", "Wear comfortable clothing"],
    includedTests: ["Heart Rhythm", "Heart Rate", "Cardiac Axis", "Abnormalities"],
  },
];

/**
 * Static content constants
 */
const CONTENT = {
  NOT_FOUND: {
    TITLE: "Package Not Found",
    LINK_TEXT: "Back to Packages",
  },
  
  // Sidebar features
  FEATURES: [
    "Home sample collection",
    "Reports within 24 hours",
    "Expert consultation",
    "Safe & certified labs",
  ],
};

// ========== MAIN COMPONENT ==========

export default function PackageDetailPage() {
  // Get package ID from URL params
  const params = useParams();
  const id = params?.id;
  
  // Find package by ID
  const pkg = PACKAGES.find((p) => p.id === parseInt(id));

  // ========== NOT FOUND STATE ==========
  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-h2 font-bold text-slate-900 mb-space-md">{CONTENT.NOT_FOUND.TITLE}</h1>
            <Link href="/packages" className="text-sky-600 hover:underline">
              {CONTENT.NOT_FOUND.LINK_TEXT}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-[80px] lg:pt-[88px]">
        
        {/* Hero Section with Background Image */}
        <div className="relative h-72 lg:h-96 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 overflow-hidden">
          <img 
            src={pkg.image} 
            alt={pkg.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent"></div>
          
          {/* Breadcrumb Navigation */}
          <div className="absolute top-6 left-6 right-6">
            <div className="max-w-6xl mx-auto">
              <Link href="/packages" className="text-sky-100 hover:text-white text-sm inline-flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Packages
              </Link>
            </div>
          </div>

          {/* Header Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {pkg.name}
              </h1>
              <p className="text-sky-100 text-lg">{pkg.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column - Package Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Stats Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Tests Count */}
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-sky-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Tests Included</p>
                      <p className="text-2xl font-bold text-sky-600">{pkg.testsCount || 1}</p>
                    </div>
                  </div>
                </div>
                
                {/* Branches Count */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Branches Available</p>
                      <p className="text-2xl font-bold text-blue-600">{pkg.branchesCount || 7}</p>
                    </div>
                  </div>
                </div>
                
                {/* Starting Price */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Starting Price</p>
                      <p className="text-2xl font-bold text-green-600">₹{pkg.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prerequisites Section - Shows if available */}
              {pkg.prerequisites && pkg.prerequisites.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Test Prerequisites</h3>
                  </div>
                  <ul className="space-y-3 px-4 md:px-0">
                    {pkg.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-3 min-h-[44px]">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                        <span className="text-slate-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Included Tests List */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Included Tests</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {pkg.includedTests.map((test, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 border border-sky-100 hover:border-sky-300 hover:bg-sky-100 transition-all">
                      <span className="w-2 h-2 rounded-full bg-sky-600 flex-shrink-0"></span>
                      <span className="text-slate-800 font-medium">{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Booking Card */}
            <div>
              <div className="bg-gradient-to-b from-sky-500 to-sky-600 rounded-2xl p-6 text-white sticky top-24 shadow-lg">
                {/* Price Section */}
                <div className="mb-6 pb-6 border-b border-white/20">
                  <p className="text-sky-100 text-sm mb-2">Package Price</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold">₹{pkg.price}</span>
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full bg-white text-sky-600 font-bold py-3 px-4 rounded-lg hover:bg-sky-50 transition-colors mb-4 text-lg shadow-md">
                  Book Now
                </button>

                {/* Features List from CONTENT */}
                <div className="space-y-3 text-sm">
                  {CONTENT.FEATURES.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
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