"use client";

/**
 * Book Appointment Page Component
 * Multi-step form for booking diagnostic tests with home collection
 * 
 * @description 4-step booking wizard: Select Tests → Your Details → Schedule → Confirm
 */

// ========== REACT HOOKS ==========
import { useState } from "react";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ========== DATA ==========
import { tests } from "@/data/staticData";

// ========== CONSTANTS & CONFIGURATION ==========

/**
 * Available time slots for appointments
 */
const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

/**
 * Progress steps configuration
 */
const STEPS = [
  { number: 1, title: "Select Tests" },
  { number: 2, title: "Your Details" },
  { number: 3, title: "Schedule" },
  { number: 4, title: "Confirm" },
];

/**
 * Category filter options
 */
const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "Hematology", name: "Hematology" },
  { id: "Biochemistry", name: "Biochemistry" },
  { id: "Hormone", name: "Hormone" },
];

/**
 * Static content constants
 */
const CONTENT = {
  // Hero section
  HERO: {
    TITLE: "Book Your",
    SUBTITLE: "Appointment",
    TAGLINE: "Quick and easy online booking with home sample collection",
  },

  // Step titles
  STEP_TITLES: {
    1: { heading: "Select Your Tests", description: "Choose from our range of diagnostic tests" },
    2: { heading: "Your Information", description: "Please provide your details for the appointment" },
    3: { heading: "Schedule Your Visit", description: "Choose your preferred date and time slot" },
    4: { heading: "Review & Confirm", description: "Please review your booking details" },
  },

  // Discount threshold message
  DISCOUNT: {
    THRESHOLD: 2,
    PERCENTAGE: 10,
    MESSAGE: "10% bulk discount applied!",
  },

  // Home collection info
  HOME_COLLECTION: {
    TITLE: "Free home sample collection",
    DESCRIPTION: "Our technician will visit your location at the scheduled time",
  },
};

// ========== HELPER FUNCTIONS ==========

/**
 * Checks if user can proceed to next step based on validation
 * @param {number} step - Current step number
 * @param {object} formData - Form data object
 * @param {Array} selectedTests - Array of selected tests
 * @returns {boolean} - Whether user can proceed
 */
const canProceed = (step, formData, selectedTests) => {
  if (step === 1) return selectedTests.length > 0;
  if (step === 2) return formData.firstName && formData.lastName && formData.email && formData.phone;
  if (step === 3) return formData.date && formData.time;
  return true;
};

// ========== MAIN COMPONENT ==========

export default function BookPage() {
  // Step tracking (1-4)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Selected tests array
  const [selectedTests, setSelectedTests] = useState([]);
  
  // Category filter
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  /**
   * Toggle test selection - adds if not present, removes if present
   */
  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.find((t) => t.id === test.id)
        ? prev.filter((t) => t.id !== test.id)
        : [...prev, test]
    );
  };

  /**
   * Price calculation with bulk discount
   */
  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const discount = selectedTests.length > CONTENT.DISCOUNT.THRESHOLD 
    ? Math.round(totalPrice * (CONTENT.DISCOUNT.PERCENTAGE / 100)) 
    : 0;
  const finalPrice = totalPrice - discount;

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment booking feature coming soon!");
  };

  // ========== RENDER ==========
  return (
    <>
      <Navbar />
      <main className="pt-20 lg:pt-24 pb-16 bg-white">
        
        {/* Hero Section */}
        <section className="relative py-12 lg:py-16 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {CONTENT.HERO.TITLE} <span className="text-sky-100">{CONTENT.HERO.SUBTITLE}</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {CONTENT.HERO.TAGLINE}
            </p>
          </div>
        </section>

        {/* Progress Steps - Sticky */}
        <div className="bg-white border-b border-slate-100 sticky top-16 lg:top-20 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-2 ${currentStep >= step.number ? 'text-sky-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep > step.number 
                        ? 'bg-sky-600 text-white' 
                        : currentStep === step.number 
                          ? 'bg-sky-100 text-sky-600 border-2 border-sky-600'
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {currentStep > step.number ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : step.number}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.number ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Select Tests */}
              {currentStep === 1 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-[#FF6B6B] w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[1].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeCategory === category.id
                              ? "bg-sky-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  
                    {/* Filtered Tests */}
                    {(() => {
                      const filteredTests = activeCategory === "all" 
                        ? tests 
                        : tests.filter(test => test.category === activeCategory);
                      
                      return (
                        <>
                          <div className="mb-4">
                            <p className="text-sm text-slate-500">
                              Showing <span className="font-semibold text-sky-600">{filteredTests.length}</span> {filteredTests.length === 1 ? 'test' : 'tests'}
                            </p>
                          </div>
                          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            <div className="grid sm:grid-cols-2 gap-4">
                              {filteredTests.map((test) => (
                                <button
                                  key={test.id}
                                  onClick={() => toggleTest(test)}
                                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                                    selectedTests.find((t) => t.id === test.id)
                                      ? "border-sky-500 bg-sky-50 shadow-sm"
                                      : "border-slate-200 hover:border-sky-300 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="text-left">
                                    <p className="font-semibold text-slate-900">{test.name}</p>
                                    <p className="text-xs text-slate-500">{test.category}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-sky-600">₹{test.price}</p>
                                    {selectedTests.find((t) => t.id === test.id) && (
                                      <div className="w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center mt-1 ml-auto">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  
                    {/* Selection Summary */}
                    {selectedTests.length > 0 && (
                      <div className="mt-6 p-4 bg-sky-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-sky-700">
                            {selectedTests.length} test{selectedTests.length > 1 ? 's' : ''} selected
                          </span>
                        </div>
                        {selectedTests.length > CONTENT.DISCOUNT.THRESHOLD && (
                          <span className="text-sm font-medium text-sky-600">
                            🎉 {CONTENT.DISCOUNT.MESSAGE}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-[#FF6B6B] w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[2].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    <form className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Home Address (for sample collection)</label>
                        <textarea
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none resize-none"
                          rows={3}
                          placeholder="Enter your complete address for home sample collection"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
                        <textarea
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none resize-none"
                          rows={2}
                          placeholder="Any special requirements or instructions"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        ></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 3 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-[#FF6B6B] w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[3].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors outline-none"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Time *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setFormData({ ...formData, time: slot })}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.time === slot
                                  ? "bg-[#FF6B6B] text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Home Collection Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-700">{CONTENT.HOME_COLLECTION.TITLE}</p>
                          <p className="text-xs text-blue-600 mt-1">{CONTENT.HOME_COLLECTION.DESCRIPTION}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100">
                  <div className="bg-[#FF6B6B] w-full px-4 py-2 rounded-tr-xl">
                    <h2 className="text-xl font-bold text-white">{CONTENT.STEP_TITLES[4].heading}</h2>
                  </div>
                  
                  <div className="p-6 lg:p-8 space-y-4">
                    {/* Patient Details */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Patient Details</h3>
                      <p className="text-sm text-slate-600">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-slate-600">{formData.email}</p>
                      <p className="text-sm text-slate-600">{formData.phone}</p>
                    </div>
                    
                    {/* Appointment Details */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Appointment</h3>
                      <p className="text-sm text-slate-600">Date: {formData.date}</p>
                      <p className="text-sm text-slate-600">Time: {formData.time}</p>
                    </div>
                    
                    {/* Address (if provided) */}
                    {formData.address && (
                      <div className="p-4 bg-white rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-2">Sample Collection Address</h3>
                        <p className="text-sm text-slate-600">{formData.address}</p>
                      </div>
                    )}
                    
                    {/* Selected Tests Summary */}
                    <div className="p-4 bg-white rounded-xl">
                      <h3 className="font-semibold text-slate-900 mb-2">Selected Tests</h3>
                      <div className="space-y-2">
                        {selectedTests.map((test) => (
                          <div key={test.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">{test.name}</span>
                            <span className="text-slate-900 font-medium">₹{test.price}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-sky-600">₹{finalPrice}</span>
                          </div>
                          {discount > 0 && (
                            <p className="text-xs text-green-600 mt-1">Bulk discount applied: -₹{discount}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div></div>
                )}
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed(currentStep, formData, selectedTests)}
                    className={`px-6 py-3 bg-[#FF6B6B] text-white font-medium rounded-xl transition-colors ${
                      canProceed(currentStep, formData, selectedTests) 
                        ? 'hover:opacity-90' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-0 border border-slate-100 sticky top-48">
                <div className="bg-sky-600 w-full px-4 py-2 rounded-tr-xl">
                  <h2 className="text-lg font-bold text-white">Booking Summary</h2>
                </div>
                
                <div className="p-6">
                  {selectedTests.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-slate-500">No tests selected</p>
                      <p className="text-xs text-slate-400 mt-1">Select tests to see pricing</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Tests List */}
                      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                        {selectedTests.map((test) => (
                          <div key={test.id} className="flex justify-between items-center py-2 border-b border-slate-100">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{test.name}</p>
                              <p className="text-xs text-slate-500">{test.category}</p>
                            </div>
                            <span className="font-semibold text-slate-900">₹{test.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Price Summary */}
                      <div className="space-y-2 border-t border-slate-200 pt-4 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Subtotal</span>
                          <span className="text-slate-900">₹{totalPrice}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Bulk Discount ({CONTENT.DISCOUNT.PERCENTAGE}%)</span>
                            <span className="text-green-600">-₹{discount}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Total */}
                      <div className="border-t border-slate-200 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-slate-900">Total</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-sky-600">₹{finalPrice}</span>
                            {discount > 0 && (
                              <p className="text-xs text-green-600">You saved ₹{discount}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Home Collection Badge */}
                      <div className="p-3 bg-[#FF6B6B] rounded-xl mb-4">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{CONTENT.HOME_COLLECTION.TITLE}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 text-center">
                        Results will be sent to your email within 24 hours
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}