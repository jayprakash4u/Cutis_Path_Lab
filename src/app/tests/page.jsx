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
  { id: "Vitamins", name: "Vitamins" },
  { id: "Diabetes", name: "Diabetes" },
  { id: "Immunology", name: "Immunology" },
  { id: "Microbiology", name: "Microbiology" },
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
    let result = tests;

    if (activeCategory !== "all") {
      result = result.filter((test) => test.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter((test) =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[80px] lg:pt-[110px]">
        <section className="relative w-full">
          <img 
            src="/images/posters/tests-hero.png" 
            alt="Cutis Path Lab Tests"
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          />
        </section>

        <div className="min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Category Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
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
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3 flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-slate-700">
                    Showing {testList.length} tests
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:border-sky-500 bg-white text-sm text-slate-700 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="text-slate-700">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {testList.map((item, index) => {
                    const TestIcon = item.icon;
                    const isSelected = selectedTests.find(t => t.text === item.text);
                    return (
                      <div 
                        key={index}
                        onClick={() => toggleTest(item)}
                        className={`flex items-center group cursor-pointer ${isSelected ? 'opacity-100' : ''}`}
                      >
                        <div className={`relative z-10 w-[68px] h-[68px] flex items-center justify-center rounded-full flex-shrink-0 shadow-md ${isSelected ? 'bg-sky-200 border border-sky-600' : 'bg-sky-100 border border-[#FF6B6B]'}`}>
                          <TestIcon size={40} />
                        </div>
                        <div className={`px-3 rounded-r-lg -ml-12 shadow-md h-14 w-52 flex items-center justify-between border-t-4 ${isSelected ? 'bg-[#FF6B6B] border-sky-600' : 'bg-sky-600 border-[#FF6B6B]'}`}>
                          <p className="text-xs text-white font-medium leading-tight ml-10">{item.text}</p>
                          <span className="text-xs font-bold text-white mr-2">₹{item.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Selected Tests Sidebar */}
              <div className="lg:w-72 flex-shrink-0">
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
      </main>
      <Footer />
    </div>
  );
}