"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { tests } from "@/data/staticData";
import { PUBLIC_IMAGES } from "@/data/images";
import { testList } from "@/data/testIcons";

const CATEGORIES = [
  { id: "all", name: "All Tests" },
  { id: "Hematology", name: "Hematology" },
  { id: "Biochemistry", name: "Biochemistry" },
  { id: "Hormone", name: "Hormone" },
  { id: "Immunology", name: "Immunology" },
  { id: "Microbiology", name: "Microbiology" },
  { id: "Pathology", name: "Pathology" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Sort: A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedTests, setSelectedTests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Map tests with icons from testList
  const testsWithIcons = useMemo(() => {
    return tests.map(test => {
      const matched = testList.find(t => t.text.toLowerCase().includes(test.name.toLowerCase().split(' ')[0].toLowerCase()));
      return {
        ...test,
        text: test.name,
        icon: matched?.icon || testList[0]?.icon,
        price: test.price
      };
    });
  }, []);

  const toggleTest = (test) => {
    setSelectedTests(prev => {
      const exists = prev.find(t => t.text === test.text);
      if (exists) {
        return prev.filter(t => t.text !== test.text);
      }
      return [...prev, test];
    });
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const discount = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice - discount;

  const filteredTests = useMemo(() => {
    let result = testsWithIcons;

    if (activeCategory && activeCategory !== "all") {
      result = result.filter((test) => test.category && test.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter((test) =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy, testsWithIcons]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[72px] lg:pt-[110px]">
        {/* Hero Section - Image for all screens */}
        <section className="relative w-full h-[18vh] sm:h-[180px]">
          <img 
            src="/images/posters/tests-hero.png" 
            alt="Cutis Path Lab Tests"
            className="w-full h-full sm:object-cover object-fill"
          />
        </section>

        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
          <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Inline Category Scroll - Visible on mobile */}
              <div className="lg:hidden overflow-x-auto -mx-2 px-2 py-2 mb-2 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-2 w-max">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        activeCategory === category.id
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Sidebar - Hidden on mobile, visible on lg */}
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="bg-[#FF6B6B] px-4 py-3">
                    <h3 className="text-white font-semibold">All Filters</h3>
                  </div>
                  <div className="p-3 border-b border-slate-200">
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-sky-500 text-sm text-black"
                    />
                  </div>
                  <div className="p-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                          activeCategory === category.id
                            ? "bg-sky-100 text-sky-700 border-l-4 border-sky-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 border-l-4 border-transparent"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Content with Cards */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {filteredTests.length} tests
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline text-xs sm:text-sm text-slate-500">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-1 sm:px-3 py-1 rounded-md border border-slate-200 focus:outline-none focus:border-sky-500 bg-white text-xs sm:text-sm text-slate-700 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="text-slate-700">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredTests.map((item, index) => {
                    const TestIcon = item.icon;
                    const isSelected = selectedTests.find(t => t.text === item.text);
                    return (
                      <div 
                        key={index}
                        onClick={() => toggleTest(item)}
                        className={`flex items-center group cursor-pointer ${isSelected ? 'opacity-100' : ''}`}
                      >
                        <div className={`relative z-10 w-20 h-20 sm:w-[68px] sm:h-[68px] flex items-center justify-center rounded-full flex-shrink-0 shadow-md ${isSelected ? 'bg-sky-200 border border-sky-600' : 'bg-sky-100 border border-[#FF6B6B]'}`}>
                          <TestIcon size={36} className="sm:size-10" />
                        </div>
                        <div className={`px-3 sm:px-3 rounded-r-lg -ml-12 sm:-ml-12 shadow-md h-20 sm:h-14 w-full sm:w-52 flex items-center justify-between border-t-4 ${isSelected ? 'bg-[#FF6B6B] border-sky-600' : 'bg-sky-600 border-[#FF6B6B]'}`}>
                          <p className="text-xs sm:text-xs text-white font-medium leading-tight ml-12 sm:ml-10">{item.text}</p>
                          <span className="text-xs sm:text-xs font-bold text-white mr-3 sm:mr-2">₹{item.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Selected Tests Sidebar - Hidden on mobile, visible on lg */}
              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                  <div className="bg-sky-600 px-4 py-3">
                    <h3 className="text-white font-semibold">Selected Tests ({selectedTests.length})</h3>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {selectedTests.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No tests selected</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedTests.map((test, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 font-medium">{test.text}</p>
                              <p className="text-xs text-slate-500">₹{test.price}</p>
                            </div>
                            <button 
                              onClick={() => toggleTest(test)}
                              className="text-red-500 text-xs hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedTests.length > 0 && (
                    <div className="border-t border-slate-200 p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">Total Price:</span>
                        <span className="text-sm font-medium">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">Discount (10%):</span>
                        <span className="text-sm text-green-600">-₹{discount}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-sm font-semibold">Final Price:</span>
                        <span className="text-sm font-bold text-sky-600">₹{finalPrice}</span>
                      </div>
                      <button className="w-full bg-[#FF6B6B] text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Selected Tests Bar - Shows when tests selected on small screens */}
        {selectedTests.length > 0 && (
          <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40 px-2 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-600">{selectedTests.length} tests</span>
              <span className="text-[10px] font-bold text-sky-600">₹{finalPrice}</span>
            </div>
            <button className="w-full bg-[#FF6B6B] text-white py-1.5 rounded-lg font-medium text-[10px] hover:bg-red-600 transition-colors">
              Book Now
            </button>
          </div>
        )}

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[70%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-sm">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-xs mb-3"
                />
                <div className="space-y-1">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => { setActiveCategory(category.id); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        activeCategory === category.id
                          ? "bg-sky-100 text-sky-700 border-l-4 border-sky-600"
                          : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}