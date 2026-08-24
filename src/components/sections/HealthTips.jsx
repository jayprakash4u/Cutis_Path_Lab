"use client";

import React from "react";
import { Section, SectionHeading } from "@/components/ui/Section";

/* Shown when the section has no rows, and the source of the artwork the
   editable rows pick by `iconKey`. */
const DEFAULT_TIPS = [
  {
    color: "#647DCE",
    borderColor: "#647DCE",
    iconKey: "fasting",
    title: "FASTING",
    description:
      "Fast for 8-12 hours before blood tests. Only water is allowed during fasting period.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#EFF2FB"
          stroke="#647DCE"
          strokeWidth="2"
        />
        <line
          x1="62"
          y1="55"
          x2="62"
          y2="65"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="67"
          y1="55"
          x2="67"
          y2="65"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M62 65 Q65 70 67 65"
          fill="none"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="68"
          x2="64"
          y2="110"
          stroke="#647DCE"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="74"
          y1="55"
          x2="74"
          y2="110"
          stroke="#647DCE"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M74 55 Q82 65 74 78"
          fill="#647DCE"
          stroke="#647DCE"
          strokeWidth="1"
        />
        <circle
          cx="94"
          cy="83"
          r="18"
          fill="white"
          stroke="#647DCE"
          strokeWidth="2"
        />
        {/* Clock centre — the one detail, same language as the site's other icon sets */}
        <circle cx="94" cy="83" r="2" fill="#C62F45" />
        <line
          x1="94"
          y1="83"
          x2="94"
          y2="72"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="94"
          y1="83"
          x2="103"
          y2="83"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="91"
          y1="79"
          x2="91"
          y2="87"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="97"
          y1="79"
          x2="97"
          y2="87"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    color: "#647DCE",
    borderColor: "#647DCE",
    iconKey: "hydration",
    title: "HYDRATION",
    description:
      "Drink plenty of water before your test to make blood draw easier.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#EFF2FB"
          stroke="#647DCE"
          strokeWidth="2"
        />
        <path
          d="M82 45 C82 45 62 70 62 85 C62 98 71 108 82 108 C93 108 102 98 102 85 C102 70 82 45 82 45 Z"
          fill="#647DCE"
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
          fill="#647DCE"
          opacity="0.85"
        />
        <path
          d="M110 62 C110 62 107 67 107 70 C107 71.8 108.8 73 110 73 C111.2 73 113 71.8 113 70 C113 67 110 62 110 62 Z"
          fill="#647DCE"
          opacity="0.85"
        />
        {/* One satellite droplet in accent — the one detail, rest of the icon stays brand blue */}
        <path
          d="M65 48 C65 48 63 51 63 53 C63 54.8 64.8 56 66 56 C67.2 56 69 54.8 69 53 C69 51 65 48 65 48 Z"
          fill="#C62F45"
          opacity="0.85"
        />
      </svg>
    ),
  },
  {
    color: "#647DCE",
    borderColor: "#647DCE",
    iconKey: "alcohol",
    title: "NO ALCOHOL",
    description:
      "Refrain from alcohol consumption 24 hours before your health checkup.",
    icon: (
      <svg viewBox="0 0 164 164" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="82"
          cy="82"
          r="60"
          fill="#EFF2FB"
          stroke="#647DCE"
          strokeWidth="2"
        />
        <path
          d="M68 55 L96 55 L88 82 Q88 92 82 92 Q76 92 76 82 Z"
          fill="#647DCE"
          opacity="0.15"
          stroke="#647DCE"
          strokeWidth="2"
        />
        <path
          d="M70 68 L94 68 L88 82 Q88 90 82 90 Q76 90 76 82 Z"
          fill="#647DCE"
          opacity="0.3"
        />
        <line
          x1="82"
          y1="92"
          x2="82"
          y2="108"
          stroke="#647DCE"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="72"
          y1="108"
          x2="92"
          y2="108"
          stroke="#647DCE"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* The prohibition ring and slash, in accent — the universal "no" mark,
            same one-detail language as the rest of the icon set. */}
        <circle
          cx="82"
          cy="82"
          r="40"
          fill="none"
          stroke="#C62F45"
          strokeWidth="4"
        />
        <line
          x1="58"
          y1="58"
          x2="106"
          y2="106"
          stroke="#C62F45"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const ICONS = Object.fromEntries(DEFAULT_TIPS.map((tip) => [tip.iconKey, tip.icon]));

const StepCard = ({ borderColor, title, description, icon: Icon }) => (
  <div
    className="flex flex-col items-center rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6"
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

export default function HealthTips({ section, items }) {
  const tips = items?.length ? items : DEFAULT_TIPS;

  return (
    <Section tone="white">
      <SectionHeading
        title={section?.title || "How to prepare for your health checkup"}
        subtitle={section?.subtitle || "Follow these guidelines before your visit so your results are as accurate as possible."}
      />

      <div>
        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
          {tips.map((tip, i) => (
            <StepCard
              key={tip.id || tip.title}
              borderColor={tip.borderColor || "#647DCE"}
              title={tip.title}
              description={tip.description}
              icon={ICONS[tip.iconKey] || DEFAULT_TIPS[i % DEFAULT_TIPS.length].icon}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
