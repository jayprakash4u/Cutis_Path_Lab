"use client";

import React from "react";

const tips = [
  {
    color: "#4a9aba",
    borderColor: "#FF6B6B",
    title: "FASTING",
    description:
      "Fast for 8-12 hours before blood tests. Only water is allowed during fasting period.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#f0f9ff"
          stroke="#4a9aba"
          strokeWidth="2"
        />
        <line
          x1="62"
          y1="55"
          x2="62"
          y2="65"
          stroke="#4a9aba"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="67"
          y1="55"
          x2="67"
          y2="65"
          stroke="#4a9aba"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M62 65 Q65 70 67 65"
          fill="none"
          stroke="#4a9aba"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="68"
          x2="64"
          y2="110"
          stroke="#4a9aba"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="74"
          y1="55"
          x2="74"
          y2="110"
          stroke="#4a9aba"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M74 55 Q82 65 74 78"
          fill="#4a9aba"
          stroke="#4a9aba"
          strokeWidth="1"
        />
        <circle
          cx="94"
          cy="83"
          r="18"
          fill="white"
          stroke="#FF6B6B"
          strokeWidth="2"
        />
        <circle cx="94" cy="83" r="2" fill="#FF6B6B" />
        <line
          x1="94"
          y1="83"
          x2="94"
          y2="72"
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="94"
          y1="83"
          x2="103"
          y2="83"
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="91"
          y1="79"
          x2="91"
          y2="87"
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="97"
          y1="79"
          x2="97"
          y2="87"
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    color: "#4a9aba",
    borderColor: "#FF6B6B",
    title: "HYDRATION",
    description:
      "Drink plenty of water before your test to make blood draw easier.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#f0f9ff"
          stroke="#4a9aba"
          strokeWidth="2"
        />
        <path
          d="M82 45 C82 45 62 70 62 85 C62 98 71 108 82 108 C93 108 102 98 102 85 C102 70 82 45 82 45 Z"
          fill="#4a9aba"
          opacity="0.85"
        />
        <path
          d="M70 90 Q82 85 94 90"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <text
          x="82"
          y="92"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="white"
          textAnchor="middle"
        >
          H₂O
        </text>
        <path
          d="M55 60 C55 60 52 65 52 68 C52 70 54 72 55 72 C56 72 58 70 58 68 C58 65 55 60 55 60 Z"
          fill="#FF6B6B"
          opacity="0.85"
        />
        <path
          d="M110 62 C110 62 107 67 107 70 C107 71.8 108.8 73 110 73 C111.2 73 113 71.8 113 70 C113 67 110 62 110 62 Z"
          fill="#FF6B6B"
          opacity="0.85"
        />
        <path
          d="M65 48 C65 48 63 51 63 53 C63 54.8 64.8 56 66 56 C67.2 56 69 54.8 69 53 C69 51 65 48 65 48 Z"
          fill="#FF6B6B"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    color: "#4a9aba",
    borderColor: "#FF6B6B",
    title: "NO ALCOHOL",
    description:
      "Refrain from alcohol consumption 24 hours before your health checkup.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#f0f9ff"
          stroke="#4a9aba"
          strokeWidth="2"
        />
        <path
          d="M68 55 L96 55 L88 82 Q88 92 82 92 Q76 92 76 82 Z"
          fill="#4a9aba"
          opacity="0.15"
          stroke="#4a9aba"
          strokeWidth="2"
        />
        <path
          d="M70 68 L94 68 L88 82 Q88 90 82 90 Q76 90 76 82 Z"
          fill="#4a9aba"
          opacity="0.3"
        />
        <line
          x1="82"
          y1="92"
          x2="82"
          y2="108"
          stroke="#4a9aba"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="72"
          y1="108"
          x2="92"
          y2="108"
          stroke="#4a9aba"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="82"
          cy="82"
          r="40"
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="4"
        />
        <line
          x1="58"
          y1="58"
          x2="106"
          y2="106"
          stroke="#FF6B6B"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const StepCard = ({ borderColor, title, description, icon: Icon }) => (
  <div
    className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border-t-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
    style={{ borderTopColor: borderColor }}
  >
    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4">{Icon}</div>
    <div className="text-center">
      <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-xs md:text-sm text-slate-500 leading-relaxed max-w-[200px]">
        {description}
      </p>
    </div>
  </div>
);

export default function HealthTips() {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-0 left-0">
            <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Pre-Checkup Tips
              </h2>
            </div>
          </div>
          <div className="pt-11">
            <p className="mt-2 mb-2 text-sm md:text-base text-slate-500 max-w-xl">
              Follow these guidelines before your health checkup for accurate
              results
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {tips.map((tip) => (
            <StepCard
              key={tip.title}
              borderColor={tip.borderColor}
              title={tip.title}
              description={tip.description}
              icon={tip.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
