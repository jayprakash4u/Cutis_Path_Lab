/**
 * Packages Page Component
 * Displays all available diagnostic test packages
 * 
 * @description Packages listing page with grid of package cards
 */

// ========== REACT HOOKS ==========
"use client";
import { useState } from "react";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ========== UI COMPONENTS ==========
import { PackageCard } from "@/components/ui";

// ========== IMAGE CONFIGURATION ==========
import { PACKAGE_IMAGES } from "@/data/images";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Package data configuration
 * Each package includes: id, name, category, description, price, image, includes (tests list)
 * Note: Images are imported from @/data/images (PACKAGE_IMAGES)
 */
const PACKAGES = [
  { id: 1, name: "Complete Blood Count", category: "Hematology", description: "Comprehensive blood analysis including RBC, WBC, platelets, hemoglobin, and hematocrit.", price: 350, image: PACKAGE_IMAGES[1], includes: ["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"] },
  { id: 2, name: "Liver Function Test", category: "Biochemistry", description: "Tests for liver health including enzymes, bilirubin, and protein levels.", price: 800, image: PACKAGE_IMAGES[2], includes: ["ALT", "AST", "Bilirubin", "Albumin", "Total Protein"] },
  { id: 3, name: "Kidney Function Test", category: "Biochemistry", description: "Evaluates kidney performance through blood urea and creatinine tests.", price: 700, image: PACKAGE_IMAGES[3], includes: ["Creatinine", "BUN", "Uric Acid", "Electrolytes", "eGFR"] },
  { id: 4, name: "Thyroid Profile", category: "Hormone", description: "Complete thyroid function assessment including T3, T4, and TSH.", price: 1200, image: PACKAGE_IMAGES[4], includes: ["T3", "T4", "TSH", "Free T3", "Free T4"] },
  { id: 5, name: "Blood Sugar Fasting", category: "Biochemistry", description: "Fasting blood glucose test for diabetes screening and management.", price: 200, image: PACKAGE_IMAGES[5], includes: ["Fasting Glucose", "PP Glucose", "HbA1c"] },
  { id: 6, name: "Lipid Profile", category: "Biochemistry", description: "Cholesterol and triglyceride assessment for heart health.", price: 600, image: PACKAGE_IMAGES[6], includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"] },
  { id: 7, name: "Hemoglobin A1C", category: "Diabetes", description: "Long-term blood sugar monitoring for diabetes management.", price: 500, image: PACKAGE_IMAGES[7], includes: ["HbA1c", "Average Blood Glucose"] },
  { id: 8, name: "Vitamin D3", category: "Vitamins", description: "Test for Vitamin D deficiency and bone health assessment.", price: 1500, image: PACKAGE_IMAGES[8], includes: ["Vitamin D3", "Vitamin D2", "Total Vitamin D"] },
  { id: 9, name: "Iron Studies", category: "Hematology", description: "Comprehensive iron deficiency and anemia workup.", price: 900, image: PACKAGE_IMAGES[9], includes: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"] },
  { id: 10, name: "Dengue NS1 Antigen", category: "Microbiology", description: "Early detection test for dengue fever infection.", price: 800, image: PACKAGE_IMAGES[10], includes: ["NS1 Antigen", "IgM Antibody", "IgG Antibody"] },
  { id: 11, name: "Urine Analysis", category: "Pathology", description: "Complete urine examination for kidney and urinary tract health.", price: 250, image: PACKAGE_IMAGES[11], includes: ["pH", "Protein", "Glucose", "Ketones", "Microscopy"] },
  { id: 12, name: "ECG", category: "Cardiology", description: "Electrocardiogram for heart rhythm and function assessment.", price: 400, image: PACKAGE_IMAGES[12], includes: ["Heart Rhythm", "Heart Rate", "Cardiac Axis", "Abnormalities"] },
  { id: 13, name: "Vitamin B12", category: "Vitamins", description: "Test for Vitamin B12 deficiency and neurological health.", price: 1200, image: PACKAGE_IMAGES[13], includes: ["Vitamin B12", "Folate", "Homocysteine"] },
  { id: 14, name: "HbA1c & Glucose", category: "Diabetes", description: "Combined test for diabetes diagnosis and monitoring.", price: 650, image: PACKAGE_IMAGES[14], includes: ["HbA1c", "Fasting Glucose", "PP Glucose"] },
  { id: 15, name: "Uric Acid", category: "Biochemistry", description: "Test for gout and kidney stone risk assessment.", price: 300, image: PACKAGE_IMAGES[15], includes: ["Uric Acid", "Creatinine", "BUN"] },
  { id: 16, name: "ESR", category: "Hematology", description: "Erythrocyte sedimentation rate for inflammation detection.", price: 150, image: PACKAGE_IMAGES[16], includes: ["ESR", "CRP", "WBC Count"] },
  { id: 17, name: "Malaria Antigen", category: "Microbiology", description: "Rapid test for malaria parasite detection.", price: 450, image: PACKAGE_IMAGES[17], includes: ["Malaria Antigen", "P. falciparum", "P. vivax"] },
  { id: 18, name: "Pregnancy Test", category: "Hormone", description: "Beta HCG test for pregnancy confirmation.", price: 350, image: PACKAGE_IMAGES[18], includes: ["Beta HCG", "Qualitative", "Quantitative"] },
  { id: 19, name: "Semen Analysis", category: "Pathology", description: "Complete semen examination for fertility assessment.", price: 500, image: PACKAGE_IMAGES[19], includes: ["Count", "Motility", "Morphology", "Volume"] },
  { id: 20, name: "Stool Routine", category: "Pathology", description: "Complete stool examination for digestive health.", price: 200, image: PACKAGE_IMAGES[20], includes: ["Color", "Consistency", "Microscopy", "Occult Blood"] },
  { id: 21, name: "Blood Group & Rh", category: "Hematology", description: "ABO blood group and Rh factor determination.", price: 250, image: PACKAGE_IMAGES[21], includes: ["ABO Group", "Rh Factor", "Antibody Screen"] },
  { id: 22, name: "Coagulation Profile", category: "Hematology", description: "Blood clotting function assessment.", price: 800, image: PACKAGE_IMAGES[22], includes: ["PT", "aPTT", "INR", "Fibrinogen"] },
  { id: 23, name: "Serum Electrolytes", category: "Biochemistry", description: "Electrolyte balance assessment for hydration status.", price: 400, image: PACKAGE_IMAGES[23], includes: ["Sodium", "Potassium", "Chloride", "Bicarbonate"] },
  { id: 24, name: "Amylase & Lipase", category: "Biochemistry", description: "Pancreatic enzyme test for pancreatitis diagnosis.", price: 700, image: PACKAGE_IMAGES[24], includes: ["Amylase", "Lipase", "Calcium"] },
  { id: 25, name: "Prostate Specific Antigen", category: "Hormone", description: "PSA test for prostate health screening.", price: 900, image: PACKAGE_IMAGES[25], includes: ["Total PSA", "Free PSA", "PSA Ratio"] },
];

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
  };

  const closePanel = () => {
    setSelectedPackage(null);
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-[72px] lg:pt-[110px]">
        
        {/* Hero Section - Image for all screens */}
        <section className="relative w-full h-[18vh] sm:h-[180px]">
          <img 
            src="/images/posters/packages-poster.png" 
            alt="Cutis Path Lab Packages"
            className="w-full h-full sm:object-cover object-fill"
          />
        </section>

        <section className="py-4 lg:py-8 px-4 lg:px-19 bg-white">
          <div className="max-w-7xl mx-auto px-3 lg:px-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative px-4 lg:px-8 py-4 lg:py-8">
                <div className="absolute left-0 right-0 top-1/2 border-t border-[#FF6B6B] z-0"></div>
                <div className="relative z-10 inline-block bg-sky-600 px-3 lg:px-4 py-1.5 lg:py-2 rounded-tr-2xl rounded-bl-2xl">
                  <h2 className="text-sm lg:text-lg md:text-xl font-bold text-white">
                    Our Packages
                  </h2>
                </div>
              </div>
              
              <div className="px-4 lg:px-8 pb-4 lg:pb-8">
                <p className="text-slate-600 text-xs lg:text-sm leading-relaxed">
                  We offer comprehensive pathology and diagnostic packages including blood tests, urine tests, histopathology, genetic testing, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="pb-8 lg:pb-12">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  title={pkg.name}
                  description={pkg.description}
                  price={`Rs. ${pkg.price}`}
                  badge={pkg.category}
                  image={pkg.image}
                  actionHref={null}
                  reportsTime="24-48 hrs"
                  fasting="10-12 hrs"
                  sampleType="Blood"
                  includes={pkg.includes}
                  onViewDetails={() => handleViewDetails(pkg)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Package Details Side Panel */}
      {selectedPackage && (
        <div className="fixed right-0 top-[330px] lg:top-[300px] bottom-0 w-full max-w-[320px] pointer-events-none z-40">
          {/* Panel - below hero section */}
          <div className="h-full bg-white shadow-2xl overflow-y-auto animate-slide-in pointer-events-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 mb-2">
                    {selectedPackage.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedPackage.name}
                  </h2>
                </div>
                <button 
                  onClick={closePanel}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 bg-white shadow-sm"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Price */}
              <div className="bg-sky-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-1">Package Price</p>
                <p className="text-3xl font-bold text-sky-600">Rs. {selectedPackage.price}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Included Tests */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Includes ({selectedPackage.includes.length} Tests)</h3>
                <div className="space-y-2">
                  {selectedPackage.includes.map((test, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                      <span className="text-slate-700 text-sm font-medium">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Sample Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Reports In</p>
                    <p className="text-sm font-medium text-slate-700">24-48 hrs</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Fasting</p>
                    <p className="text-sm font-medium text-slate-700">10-12 hrs</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Sample Type</p>
                    <p className="text-sm font-medium text-slate-700">Blood</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-700">{selectedPackage.category}</p>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-lg hover:bg-[#e55a5a] transition-colors">
                Book This Package
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}