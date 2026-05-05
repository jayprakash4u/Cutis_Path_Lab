"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

const primary = "#0284C7"
const primaryLight = "#7DD3FC"
const accent = "#FF6B6B"
const accentLight = "#FFA8A8"

export const BloodTestsIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="bloodDrop" x1="24" y1="8" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accent} />
        <stop offset="100%" stopColor="#E53E3E" />
      </linearGradient>
    </defs>
    <path 
      d="M24 6 C24 6 12 20 12 28 C12 35 17 40 24 40 C31 40 36 35 36 28 C36 20 24 6 24 6Z" 
      fill="url(#bloodDrop)"
      stroke={accent}
      strokeWidth="1.5"
    />
    <circle cx="20" cy="26" r="3" fill={primaryLight} fillOpacity="0.8" />
    <circle cx="28" cy="30" r="2.5" fill={primaryLight} fillOpacity="0.8" />
    <circle cx="24" cy="33" r="2" fill="white" fillOpacity="0.6" />
  </svg>
)

export const UrineTestsIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="urineGrad" x1="24" y1="20" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <path 
      d="M18 8 L18 34 C18 38 20 40 24 40 C28 40 30 38 30 34 L30 8" 
      fill="none"
      stroke={primary}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path 
      d="M18 20 L18 34 C18 38 20 40 24 40 C28 40 30 38 30 34 L30 20 Z" 
      fill="url(#urineGrad)"
      fillOpacity="0.7"
    />
    <line x1="16" y1="8" x2="32" y2="8" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="24" cy="18" rx="4" ry="1.5" fill="white" fillOpacity="0.5" />
  </svg>
)

export const StoolTestsIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="containerGrad" x1="24" y1="12" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <rect x="12" y="12" width="24" height="28" rx="3" fill="url(#containerGrad)" fillOpacity="0.3" stroke={primary} strokeWidth="2" />
    <rect x="10" y="8" width="28" height="6" rx="2" fill={primary} />
    <line x1="16" y1="22" x2="32" y2="22" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="28" x2="28" y2="28" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="34" x2="24" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const ClinicalBiochemistryIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="flaskLiquid" x1="24" y1="24" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <path 
      d="M20 6 L20 18 L10 38 C9 40 10 42 13 42 L35 42 C38 42 39 40 38 38 L28 18 L28 6" 
      fill="none"
      stroke={primary}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M12 34 L36 34 L38 38 C39 40 38 42 35 42 L13 42 C10 42 9 40 10 38 L12 34 Z" 
      fill="url(#flaskLiquid)"
      fillOpacity="0.7"
    />
    <line x1="18" y1="6" x2="30" y2="6" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="37" r="2" fill={accent} />
    <circle cx="24" cy="39" r="1.5" fill={accent} />
    <circle cx="30" cy="36" r="2.5" fill={accent} />
  </svg>
)

export const MicrobiologyTestsIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="virusGrad" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="10" fill="url(#virusGrad)" />
    <line x1="24" y1="4" x2="24" y2="12" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="4" r="2.5" fill={accent} />
    <line x1="24" y1="36" x2="24" y2="44" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="44" r="2.5" fill={accent} />
    <line x1="4" y1="24" x2="12" y2="24" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="4" cy="24" r="2.5" fill={accent} />
    <line x1="36" y1="24" x2="44" y2="24" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="44" cy="24" r="2.5" fill={accent} />
    <line x1="10" y1="10" x2="16" y2="16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="9" r="2" fill={accent} />
    <line x1="38" y1="10" x2="32" y2="16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <circle cx="39" cy="9" r="2" fill={accent} />
    <line x1="10" y1="38" x2="16" y2="32" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="39" r="2" fill={accent} />
    <line x1="38" y1="38" x2="32" y2="32" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <circle cx="39" cy="39" r="2" fill={accent} />
  </svg>
)

export const HistopathologyIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="microGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <ellipse cx="20" cy="6" rx="5" ry="3" fill={primary} />
    <rect x="17" y="6" width="6" height="8" fill={primary} />
    <rect x="14" y="14" width="12" height="16" rx="2" fill="url(#microGrad)" />
    <path d="M26 18 L34 18 L34 28 C34 30 32 32 30 32 L26 32 Z" fill={primary} />
    <rect x="28" y="32" width="12" height="4" rx="1" fill={primary} />
    <circle cx="34" cy="34" r="2" fill={accent} />
    <path d="M10 42 L38 42 L36 38 L12 38 Z" fill={primary} />
    <rect x="18" y="30" width="4" height="6" rx="1" fill={primaryLight} />
  </svg>
)

export const CytologyIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="cellGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="24" rx="18" ry="14" fill="url(#cellGrad)" fillOpacity="0.4" stroke={primary} strokeWidth="2.5" />
    <ellipse cx="24" cy="24" rx="8" ry="6" fill={accent} fillOpacity="0.7" stroke={accent} strokeWidth="2" />
    <circle cx="24" cy="24" r="3" fill={accent} />
    <ellipse cx="14" cy="20" rx="3" ry="2" fill={primaryLight} />
    <ellipse cx="34" cy="28" rx="3" ry="2" fill={primaryLight} />
    <circle cx="16" cy="30" r="2" fill={primaryLight} />
    <circle cx="32" cy="18" r="2" fill={primaryLight} />
  </svg>
)

export const HormoneTestingIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="hormoneGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <path 
      d="M24 8 L34 14 L34 26 L24 32 L14 26 L14 14 Z" 
      fill="url(#hormoneGrad)" 
      fillOpacity="0.4"
      stroke={primary} 
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <line x1="24" y1="14" x2="24" y2="26" stroke={primary} strokeWidth="2" />
    <line x1="18" y1="17" x2="30" y2="23" stroke={primary} strokeWidth="2" />
    <circle cx="24" cy="8" r="3" fill={accent} />
    <circle cx="34" cy="14" r="3" fill={accent} />
    <circle cx="14" cy="26" r="3" fill={accent} />
    <path d="M24 36 L24 44 M20 40 L24 44 L28 40" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const DiabetesTestingIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="meterGrad" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <rect x="10" y="6" width="28" height="36" rx="4" fill="url(#meterGrad)" fillOpacity="0.3" stroke={primary} strokeWidth="2.5" />
    <rect x="14" y="12" width="20" height="14" rx="2" fill="white" stroke={primary} strokeWidth="1.5" />
    <text x="24" y="23" textAnchor="middle" fill={accent} fontSize="10" fontWeight="bold">120</text>
    <path d="M24 30 C24 30 20 34 20 36 C20 38 22 40 24 40 C26 40 28 38 28 36 C28 34 24 30 24 30Z" fill={accent} />
    <circle cx="24" cy="8" r="1.5" fill={primary} />
  </svg>
)

export const ThyroidTestingIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="thyroidGrad" x1="24" y1="10" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <ellipse cx="14" cy="26" rx="8" ry="12" fill="url(#thyroidGrad)" fillOpacity="0.6" stroke={accent} strokeWidth="2" />
    <ellipse cx="34" cy="26" rx="8" ry="12" fill="url(#thyroidGrad)" fillOpacity="0.6" stroke={accent} strokeWidth="2" />
    <rect x="18" y="22" width="12" height="8" fill={accent} fillOpacity="0.6" stroke={accent} strokeWidth="2" />
    <line x1="24" y1="10" x2="24" y2="18" stroke={primary} strokeWidth="3" strokeLinecap="round" />
    <line x1="24" y1="34" x2="24" y2="44" stroke={primary} strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export const LipidProfileIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="lipidGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <path 
      d="M24 40 C24 40 8 28 8 18 C8 12 12 8 18 8 C21 8 24 10 24 14 C24 10 27 8 30 8 C36 8 40 12 40 18 C40 28 24 40 24 40Z" 
      fill="url(#lipidGrad)" 
      fillOpacity="0.4"
      stroke={primary}
      strokeWidth="2.5"
    />
    <circle cx="18" cy="20" r="4" fill={accent} fillOpacity="0.8" />
    <circle cx="30" cy="20" r="4" fill={accent} fillOpacity="0.8" />
    <circle cx="24" cy="28" r="3" fill={accent} fillOpacity="0.8" />
  </svg>
)

export const LiverFunctionIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="liverGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M8 20 C8 14 14 10 22 10 L30 10 C38 10 42 16 42 24 C42 32 38 38 28 38 L18 38 C10 38 8 30 8 20Z" 
      fill="url(#liverGrad)"
      fillOpacity="0.6"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M26 10 L26 38" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
    <ellipse cx="18" cy="22" rx="5" ry="3" fill="white" fillOpacity="0.3" />
    <path d="M32 20 L36 26 L42 16" stroke={primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const KidneyFunctionIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="kidneyGrad" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M20 6 C12 6 6 14 6 24 C6 34 12 42 20 42 C26 42 28 36 28 30 C28 26 26 24 24 24 C26 24 28 22 28 18 C28 12 26 6 20 6Z" 
      fill="url(#kidneyGrad)"
      fillOpacity="0.6"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path 
      d="M28 6 C36 6 42 14 42 24 C42 34 36 42 28 42 C22 42 20 36 20 30 C20 26 22 24 24 24 C22 24 20 22 20 18 C20 12 22 6 28 6Z" 
      fill="url(#kidneyGrad)"
      fillOpacity="0.4"
      stroke={accent}
      strokeWidth="2"
    />
    <line x1="16" y1="38" x2="16" y2="44" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="38" x2="32" y2="44" stroke={primary} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const VitaminTestsIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="pillGrad1" x1="16" y1="8" x2="16" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="50%" stopColor={primary} />
      </linearGradient>
      <linearGradient id="pillGrad2" x1="16" y1="8" x2="16" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="50%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <rect x="8" y="12" width="16" height="24" rx="8" fill="url(#pillGrad1)" />
    <rect x="8" y="24" width="16" height="12" rx="0" fill="url(#pillGrad2)" />
    <path d="M8 36 C8 40 12 40 16 40 C20 40 24 40 24 36" fill={accent} />
    <circle cx="36" cy="18" r="8" fill={primary} />
    <ellipse cx="34" cy="16" rx="3" ry="2" fill="white" fillOpacity="0.4" />
    <ellipse cx="36" cy="36" rx="6" ry="4" fill={accent} />
    <ellipse cx="35" cy="35" rx="2" ry="1" fill="white" fillOpacity="0.4" />
  </svg>
)

export const AllergyTestingIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="allergyGrad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M24 4 L40 10 L40 24 C40 34 32 42 24 44 C16 42 8 34 8 24 L8 10 Z" 
      fill="url(#allergyGrad)"
      fillOpacity="0.3"
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect x="22" y="14" width="4" height="14" rx="2" fill={accent} />
    <circle cx="24" cy="34" r="2.5" fill={accent} />
    <circle cx="12" cy="20" r="2" fill={primary} />
    <circle cx="36" cy="20" r="2" fill={primary} />
    <circle cx="14" cy="30" r="1.5" fill={primary} />
    <circle cx="34" cy="30" r="1.5" fill={primary} />
  </svg>
)

export const CancerMarkerIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="ribbonGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M24 18 C24 18 16 10 16 6 C16 4 18 4 20 6 C22 8 24 12 24 12 C24 12 26 8 28 6 C30 4 32 4 32 6 C32 10 24 18 24 18Z" 
      fill="url(#ribbonGrad)"
      stroke={accent}
      strokeWidth="2"
    />
    <path 
      d="M24 18 C20 22 14 32 14 38 C14 42 18 44 20 42 L24 34 L28 42 C30 44 34 42 34 38 C34 32 28 22 24 18Z" 
      fill="url(#ribbonGrad)"
      stroke={accent}
      strokeWidth="2"
    />
    <circle cx="38" cy="36" r="6" stroke={primary} strokeWidth="2.5" fill="white" fillOpacity="0.8" />
    <line x1="42" y1="40" x2="46" y2="44" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

export const GeneticTestingIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="dnaGrad1" x1="16" y1="4" x2="16" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <linearGradient id="dnaGrad2" x1="32" y1="4" x2="32" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M14 4 C14 4 10 12 14 20 C18 28 18 36 14 44" 
      stroke={primary}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path 
      d="M34 4 C34 4 38 12 34 20 C30 28 30 36 34 44" 
      stroke={accent}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="14" y1="8" x2="34" y2="8" stroke={primaryLight} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="16" x2="36" y2="16" stroke={accentLight} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="14" y1="24" x2="34" y2="24" stroke={primaryLight} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="32" x2="36" y2="32" stroke={accentLight} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="14" y1="40" x2="34" y2="40" stroke={primaryLight} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="14" cy="8" r="3" fill={primary} />
    <circle cx="34" cy="8" r="3" fill={accent} />
    <circle cx="14" cy="40" r="3" fill={primary} />
    <circle cx="34" cy="40" r="3" fill={accent} />
  </svg>
)

export const PreventiveHealthIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="shieldGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <path 
      d="M24 4 L42 10 L42 24 C42 34 34 42 24 44 C14 42 6 34 6 24 L6 10 Z" 
      fill="url(#shieldGrad)"
      fillOpacity="0.4"
      stroke={primary}
      strokeWidth="2.5"
    />
    <path 
      d="M16 24 L22 30 L34 16" 
      stroke={accent}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const FullBodyCheckupIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="bodyGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
    </defs>
    <circle cx="24" cy="10" r="6" fill="url(#bodyGrad)" stroke={primary} strokeWidth="2" />
    <path 
      d="M24 16 L24 30" 
      stroke={primary}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path 
      d="M12 22 L24 20 L36 22" 
      stroke={primary}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M24 30 L16 44" stroke={primary} strokeWidth="3" strokeLinecap="round" />
    <path d="M24 30 L32 44" stroke={primary} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="12" x2="8" y2="40" stroke={accent} strokeWidth="2" strokeDasharray="4 2" />
    <line x1="40" y1="12" x2="40" y2="40" stroke={accent} strokeWidth="2" strokeDasharray="4 2" />
    <rect x="10" y="20" width="28" height="4" fill={accent} fillOpacity="0.3" />
    <circle cx="10" cy="10" r="4" fill={accent} />
    <path d="M8 10 L9.5 11.5 L12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const HomeSampleCollectionIcon = ({ className, size = 48 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="houseGrad" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryLight} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <linearGradient id="tubeLiquid" x1="30" y1="24" x2="30" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={accentLight} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
    <path 
      d="M24 6 L6 20 L10 20 L10 40 L38 40 L38 20 L42 20 Z" 
      fill="url(#houseGrad)"
      fillOpacity="0.3"
      stroke={primary}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <rect x="18" y="28" width="8" height="12" fill={primary} fillOpacity="0.5" stroke={primary} strokeWidth="1.5" />
    <rect x="32" y="18" width="6" height="18" rx="3" fill="white" stroke={primary} strokeWidth="2" />
    <rect x="33" y="26" width="4" height="8" rx="2" fill="url(#tubeLiquid)" />
    <line x1="31" y1="18" x2="39" y2="18" stroke={primary} strokeWidth="2" strokeLinecap="round" />
    <line x1="22" y1="32" x2="22" y2="38" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="35" x2="25" y2="35" stroke={accent} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const PathologyCategoryIcons = {
  BloodTests: BloodTestsIcon,
  UrineTests: UrineTestsIcon,
  StoolTests: StoolTestsIcon,
  ClinicalBiochemistry: ClinicalBiochemistryIcon,
  MicrobiologyTests: MicrobiologyTestsIcon,
  Histopathology: HistopathologyIcon,
  Cytology: CytologyIcon,
  HormoneTesting: HormoneTestingIcon,
  DiabetesTesting: DiabetesTestingIcon,
  ThyroidTesting: ThyroidTestingIcon,
  LipidProfileTesting: LipidProfileIcon,
  LiverFunctionTests: LiverFunctionIcon,
  KidneyFunctionTests: KidneyFunctionIcon,
  VitaminDeficiencyTests: VitaminTestsIcon,
  AllergyTesting: AllergyTestingIcon,
  CancerMarkerTests: CancerMarkerIcon,
  GeneticTesting: GeneticTestingIcon,
  PreventiveHealthCheckups: PreventiveHealthIcon,
  FullBodyCheckupPackages: FullBodyCheckupIcon,
  HomeSampleCollection: HomeSampleCollectionIcon,
}