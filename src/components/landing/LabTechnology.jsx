"use client";

import React from "react";

export default function FeaturesSection() {
  const technologies = [
    {
      title: "AI Diagnostics",
      subtitle: "Smart analysis",
      description: "Intelligent diagnostic support",
    },
    {
      title: "Digital Pathology",
      subtitle: "Slide imaging",
      description: "Advanced tissue imaging",
    },
    {
      title: "Molecular Testing",
      subtitle: "Genetic screening",
      description: "Precision molecular analysis",
    },
    {
      title: "Lab Automation",
      subtitle: "Efficient workflow",
      description: "Automated processing systems",
    },
    {
      title: "PCR Technology",
      subtitle: "Rapid detection",
      description: "Real-time amplification",
    },
    {
      title: "Smart Sample Tracking",
      subtitle: "Real-time monitoring",
      description: "Complete sample management",
    },
  ];

  const getIcon = (index) => {
    const icons = [
      // AI Diagnostics - Brain neural network
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="22"
          r="7"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="25"
          cy="40"
          r="6"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="55"
          cy="40"
          r="6"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="40"
          cy="58"
          r="7"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <path d="M38 28 L27 36" stroke="#0369A1" strokeWidth="1.5" />
        <path d="M42 28 L53 36" stroke="#0369A1" strokeWidth="1.5" />
        <path d="M25 46 L40 52" stroke="#0369A1" strokeWidth="1.5" />
        <path d="M55 46 L40 52" stroke="#0369A1" strokeWidth="1.5" />
        <circle cx="40" cy="22" r="3" fill="#FF6B6B" />
      </svg>,

      // Digital Pathology - Test tube microscope
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="22"
          y="12"
          width="36"
          height="30"
          rx="2"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="40"
          cy="30"
          r="10"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="40" cy="30" r="5" fill="#FF6B6B" opacity="0.2" />
        <line
          x1="28"
          y1="20"
          x2="52"
          y2="20"
          stroke="#0369A1"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="30"
          y1="50"
          x2="30"
          y2="60"
          stroke="#0369A1"
          strokeWidth="2"
        />
        <line
          x1="40"
          y1="50"
          x2="40"
          y2="60"
          stroke="#0369A1"
          strokeWidth="2"
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="60"
          stroke="#0369A1"
          strokeWidth="2"
        />
        <rect
          x="25"
          y="58"
          width="30"
          height="6"
          rx="1"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>,

      // Molecular Testing - DNA Helix
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 12 Q26 18 32 26 Q40 32 32 40 Q26 48 32 56 Q40 64 32 72"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M48 12 Q54 18 48 26 Q40 32 48 40 Q54 48 48 56 Q40 64 48 72"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="32" cy="20" r="2.5" fill="#FF6B6B" />
        <circle cx="48" cy="28" r="2.5" fill="#FF6B6B" />
        <circle cx="32" cy="44" r="2.5" fill="#FF6B6B" />
        <circle cx="48" cy="52" r="2.5" fill="#FF6B6B" />
        <line
          x1="32"
          y1="20"
          x2="48"
          y2="28"
          stroke="#0369A1"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="32"
          y1="44"
          x2="48"
          y2="52"
          stroke="#0369A1"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>,

      // Lab Automation - Connected nodes network
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="5"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="40"
          cy="20"
          r="5"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="60"
          cy="20"
          r="5"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="20"
          cy="50"
          r="5"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="40"
          cy="60"
          r="6"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="60"
          cy="50"
          r="5"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="25"
          y1="20"
          x2="35"
          y2="20"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <line
          x1="45"
          y1="20"
          x2="55"
          y2="20"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="25"
          x2="20"
          y2="45"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="25"
          x2="40"
          y2="54"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <line
          x1="60"
          y1="25"
          x2="60"
          y2="45"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <circle cx="40" cy="60" r="2.5" fill="#FF6B6B" />
      </svg>,

      // PCR Technology - Wave amplification
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 55 Q16 48 20 55 Q24 62 28 55"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M28 42 Q34 30 40 42 Q46 54 52 42"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M48 30 Q56 14 64 30 Q72 46 80 30"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="10"
          y1="60"
          x2="80"
          y2="60"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="55" r="2" fill="#FF6B6B" />
        <circle cx="40" cy="42" r="2" fill="#FF6B6B" />
        <circle cx="64" cy="30" r="2" fill="#FF6B6B" />
      </svg>,

      // Smart Sample Tracking - RFID Tag
      <svg
        key={index}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="14"
          y="22"
          width="40"
          height="42"
          rx="2"
          stroke="#0369A1"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="20"
          y="28"
          width="28"
          height="8"
          rx="1"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="34"
          cy="48"
          r="8"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="34" cy="48" r="4" fill="#FF6B6B" opacity="0.25" />
        <circle
          cx="58"
          cy="26"
          r="4"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="68"
          cy="16"
          r="3"
          stroke="#0369A1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M56 29 Q62 22 68 14"
          stroke="#0369A1"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path d="M66 64 L74 72" stroke="#FF6B6B" strokeWidth="2" />
      </svg>,
    ];

    return icons[index];
  };
  return (
    <section className="w-full bg-sky-50 py-12 md:py-16 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Badge */}
        <div className="mb-12">
          <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl inline-block">
            <h2 className="text-lg md:text-xl font-bold text-white">
              Our Lab Technology
            </h2>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Top Border */}
              <div className="h-1.5 bg-[#FF6B6B]" />

              {/* Content */}
              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 mb-6 flex items-center justify-center">
                  {getIcon(idx)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {tech.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-slate-600 mb-6">
                  {tech.description}
                </p>

                {/* Button */}
                <button className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm">
                  Know More {">>"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
