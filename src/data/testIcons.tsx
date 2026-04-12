import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

const primaryColor = "#0284C7";
const accentColor = "#FF6B6B";

export const APTTIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="6" width="24" height="28" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="12" x2="22" y2="12" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="18" x2="28" y2="18" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="24" x2="28" y2="24" stroke={primaryColor} strokeWidth="2" />
    <circle cx="26" cy="12" r="2" fill={accentColor} />
  </svg>
);

export const ALTIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="8" width="20" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="16" r="4" fill={accentColor} />
    <line x1="20" y1="22" x2="20" y2="28" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const AlbuminIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M10 20 Q20 8 30 20 Q20 32 10 20" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M14 20 Q20 12 26 20 Q20 28 14 20" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const ALPIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="6" width="24" height="28" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="12" x2="28" y2="12" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="18" x2="28" y2="18" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="24" x2="28" y2="24" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="30" x2="28" y2="30" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const AntigenTestIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="6" width="20" height="28" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <rect x="16" y="14" width="8" height="12" rx="1" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="18" x2="20" y2="22" stroke={accentColor} strokeWidth="2" />
    <line x1="18" y1="20" x2="22" y2="20" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const ASTIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M10 28 Q15 20 20 24 Q25 28 30 12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="30" cy="12" r="3" fill={accentColor} />
  </svg>
);

export const AutopsyPathologyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="6" width="24" height="28" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="12" x2="28" y2="12" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="18" x2="28" y2="18" stroke={primaryColor} strokeWidth="2" />
    <line x1="12" y1="24" x2="20" y2="24" stroke={primaryColor} strokeWidth="2" />
    <circle cx="26" cy="28" r="3" fill={accentColor} />
  </svg>
);

export const BilirubinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 8 L20 26" stroke={primaryColor} strokeWidth="2" />
    <path d="M14 14 L20 8 L26 14" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="32" x2="28" y2="32" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="26" r="4" fill={accentColor} />
  </svg>
);

export const BleedingTimeIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 8 C20 8 12 18 12 24 C12 28 16 32 20 32 C24 32 28 28 28 24 C28 18 20 8 20 8Z" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="24" r="3" fill={accentColor} />
  </svg>
);

export const BloodCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 8 L14 28 C14 30 16 32 20 32 C24 32 26 30 26 28 L26 8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="28" y2="8" stroke={primaryColor} strokeWidth="2" />
    <text x="20" y="22" textAnchor="middle" fill={accentColor} fontSize="10" fontWeight="bold">A</text>
  </svg>
);

export const BloodGlucoseIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M20 8 C20 8 16 12 16 16 C16 18 18 20 20 20 C22 20 24 18 24 16 C24 12 20 8 20 8Z" fill={accentColor} />
  </svg>
);

export const BloodTypingIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="20" r="6" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="20" r="6" stroke={accentColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="14" x2="20" y2="26" stroke={primaryColor} strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export const BUNIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="4" fill={accentColor} />
    <line x1="20" y1="6" x2="20" y2="10" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="30" x2="20" y2="34" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const BoneMarrowIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="12" rx="8" ry="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <ellipse cx="20" cy="28" rx="8" ry="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="12" x2="12" y2="28" stroke={primaryColor} strokeWidth="2" />
    <line x1="28" y1="12" x2="28" y2="28" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="3" fill={accentColor} />
  </svg>
);

export const ChlamydiaCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="14" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="14" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="26" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="14" r="1.5" fill={accentColor} />
    <circle cx="26" cy="14" r="1.5" fill={accentColor} />
    <circle cx="20" cy="26" r="1.5" fill={accentColor} />
  </svg>
);

export const ClottingTimeIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="20" x2="20" y2="12" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="20" x2="26" y2="20" stroke={accentColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const CMVAntibodyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 10 L20 18" stroke={primaryColor} strokeWidth="2" />
    <path d="M12 14 L20 18 L28 14" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="24" r="6" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="27" textAnchor="middle" fill={accentColor} fontSize="8" fontWeight="bold">?</text>
  </svg>
);

export const CBCIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="14" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="14" r="5" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="26" r="5" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="26" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const CortisolIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M12 28 L16 20 L20 24 L24 14 L28 18" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="24" cy="14" r="3" fill={accentColor} />
  </svg>
);

export const COVID19Icon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="8" x2="20" y2="12" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="28" x2="20" y2="32" stroke={primaryColor} strokeWidth="2" />
    <line x1="8" y1="20" x2="12" y2="20" stroke={primaryColor} strokeWidth="2" />
    <line x1="28" y1="20" x2="32" y2="20" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="3" fill={accentColor} />
  </svg>
);

export const CreatinineIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M12 32 C12 20 16 14 20 14 C24 14 28 20 28 32" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="14" r="4" fill={accentColor} />
  </svg>
);

export const CSFCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 10 L14 26 C14 30 16 32 20 32 C24 32 26 30 26 26 L26 10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="18" x2="26" y2="18" stroke={primaryColor} strokeWidth="2" />
    <circle cx="18" cy="24" r="2" fill={accentColor} />
    <circle cx="22" cy="22" r="2" fill={accentColor} />
  </svg>
);

export const CytopathologyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const DDimerIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M10 20 L18 12 L18 28 Z" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M30 20 L22 12 L22 28 Z" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const DengueNS1Icon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="8" width="20" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="15" y="18" fill={primaryColor} fontSize="7" fontWeight="bold">Na</text>
    <text x="22" y="18" fill={primaryColor} fontSize="5">+</text>
    <text x="15" y="26" fill={accentColor} fontSize="7" fontWeight="bold">K</text>
    <text x="20" y="26" fill={accentColor} fontSize="5">+</text>
    <text x="15" y="32" fill={primaryColor} fontSize="7" fontWeight="bold">Ca</text>
    <text x="24" y="32" fill={primaryColor} fontSize="5">2+</text>
  </svg>
);

export const ElectrolytesIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="16" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="14" y="18" textAnchor="middle" fill={primaryColor} fontSize="6">+</text>
    <circle cx="26" cy="16" r="4" stroke={accentColor} strokeWidth="2" fill="none" />
    <text x="26" y="18" textAnchor="middle" fill={accentColor} fontSize="6">-</text>
    <circle cx="20" cy="28" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="30" textAnchor="middle" fill={primaryColor} fontSize="6">+</text>
  </svg>
);

export const ElectronMicroscopyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="18" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="28" x2="20" y2="34" stroke={primaryColor} strokeWidth="2" />
    <line x1="14" y1="34" x2="26" y2="34" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="18" r="4" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const ESRIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="16" y="6" width="8" height="28" rx="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="16" y1="20" x2="24" y2="20" stroke={primaryColor} strokeWidth="1" />
    <rect x="17" y="20" width="6" height="12" rx="3" fill={accentColor} />
  </svg>
);

export const EstrogenIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="16" r="8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="24" x2="20" y2="34" stroke={primaryColor} strokeWidth="2" />
    <line x1="16" y1="30" x2="24" y2="30" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const ExfoliativeCytologyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="16" rx="10" ry="6" stroke={primaryColor} strokeWidth="2" fill="none" />
    <ellipse cx="20" cy="26" rx="8" ry="5" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="16" r="2" fill={accentColor} />
  </svg>
);

export const FNAIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="18" y="6" width="4" height="20" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M18 26 L20 32 L22 26" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="32" r="2" fill={accentColor} />
  </svg>
);

export const FlowCytometryIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="16" cy="16" r="2" fill={primaryColor} />
    <circle cx="24" cy="16" r="2" fill={accentColor} />
    <circle cx="16" cy="24" r="2" fill={accentColor} />
    <circle cx="24" cy="24" r="2" fill={primaryColor} />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const FSHIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="12" width="20" height="16" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="18" x2="14" y2="24" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="16" x2="20" y2="24" stroke={accentColor} strokeWidth="2" />
    <line x1="26" y1="20" x2="26" y2="24" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const FungalCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="28" rx="10" ry="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M16 28 C16 28 16 20 20 16" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M20 16 C24 20 24 28 24 28" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="12" r="4" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const GGTIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="8" width="20" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M14 16 L18 24 L22 18 L26 26" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const GonorrheaCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="16" cy="16" r="4" fill={accentColor} />
    <circle cx="24" cy="16" r="4" fill={accentColor} />
    <circle cx="16" cy="24" r="4" fill={accentColor} />
    <circle cx="24" cy="24" r="4" fill={accentColor} />
    <circle cx="20" cy="20" r="3" stroke={primaryColor} strokeWidth="2" fill="none" />
  </svg>
);

export const GramStainIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="14" r="3" fill={primaryColor} />
    <circle cx="22" cy="12" r="2" fill={accentColor} />
    <circle cx="26" cy="18" r="3" fill={primaryColor} />
    <circle cx="18" cy="22" r="2" fill={accentColor} />
    <circle cx="12" cy="26" r="3" fill={primaryColor} />
    <circle cx="24" cy="28" r="2" fill={accentColor} />
  </svg>
);

export const GrowthHormoneIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="12" y="22" width="4" height="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <rect x="18" y="16" width="4" height="16" stroke={primaryColor} strokeWidth="2" fill="none" />
    <rect x="24" y="10" width="4" height="22" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="10" r="2" fill={accentColor} />
  </svg>
);

export const HCGIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="12" y="8" width="16" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <rect x="16" y="14" width="8" height="8" rx="1" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="16" x2="20" y2="20" stroke={accentColor} strokeWidth="2" />
    <line x1="18" y1="18" x2="22" y2="18" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const HemoglobinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="24" textAnchor="middle" fill={accentColor} fontSize="10" fontWeight="bold">Hb</text>
  </svg>
);

export const HepBIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="24" textAnchor="middle" fill={accentColor} fontSize="10" fontWeight="bold">HBs</text>
  </svg>
);

export const HepCIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="24" textAnchor="middle" fill={accentColor} fontSize="10" fontWeight="bold">HCV</text>
  </svg>
);

export const HistopathologyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="10" y1="16" x2="30" y2="16" stroke={primaryColor} strokeWidth="1" />
    <line x1="10" y1="22" x2="30" y2="22" stroke={primaryColor} strokeWidth="1" />
    <line x1="16" y1="10" x2="16" y2="30" stroke={primaryColor} strokeWidth="1" />
    <line x1="24" y1="10" x2="24" y2="30" stroke={primaryColor} strokeWidth="1" />
    <circle cx="20" cy="19" r="2" fill={accentColor} />
  </svg>
);

export const HIVIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 10 L20 18" stroke={primaryColor} strokeWidth="2" />
    <path d="M12 14 L20 18 L28 14" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="26" r="8" stroke={accentColor} strokeWidth="2" fill="none" />
    <line x1="16" y1="22" x2="24" y2="30" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const ImmunoglobulinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 10 L14 20 L10 26" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M14 20 L18 26" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M26 10 L26 20 L22 26" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M26 20 L30 26" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="14" x2="26" y2="14" stroke={accentColor} strokeWidth="2" />
    <circle cx="20" cy="32" r="4" fill={accentColor} />
  </svg>
);

export const ImmunohistochemistryIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="16" cy="16" r="3" fill={accentColor} />
    <circle cx="24" cy="16" r="3" fill={primaryColor} />
    <circle cx="16" cy="24" r="3" fill={primaryColor} />
    <circle cx="24" cy="24" r="3" fill={accentColor} />
  </svg>
);

export const InsulinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="16" y="8" width="8" height="20" rx="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="28" x2="20" y2="34" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="16" r="3" fill={accentColor} />
  </svg>
);

export const KidneyFunctionIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 12 C8 14 8 28 14 30 C16 30 18 26 18 20 C18 14 16 12 14 12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M26 12 C32 14 32 28 26 30 C24 30 22 26 22 20 C22 14 24 12 26 12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="20" r="2" fill={accentColor} />
    <circle cx="26" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const LHIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M10 28 L16 20 L22 24 L28 12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="28" cy="12" r="3" fill={accentColor} />
    <line x1="10" y1="32" x2="30" y2="32" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const LipidProfileIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M16 16 L20 12 L24 16" stroke={accentColor} strokeWidth="2" fill="none" />
    <path d="M16 24 L20 28 L24 24" stroke={primaryColor} strokeWidth="2" fill="none" />
  </svg>
);

export const LiverFunctionIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M12 14 C12 10 16 8 22 10 C28 12 30 18 28 24 C26 30 20 32 14 30 C10 28 12 20 12 14" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="3" fill={accentColor} />
  </svg>
);

export const MalariaIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M16 16 L24 24" stroke={accentColor} strokeWidth="2" />
    <path d="M24 16 L16 24" stroke={accentColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="3" fill={accentColor} />
  </svg>
);

export const MeaslesIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 10 L20 18" stroke={primaryColor} strokeWidth="2" />
    <path d="M12 14 L20 18 L28 14" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="26" r="6" stroke={primaryColor} strokeWidth="2" fill="none" />
    <text x="20" y="29" textAnchor="middle" fill={accentColor} fontSize="8" fontWeight="bold">M</text>
  </svg>
);

export const MolecularPathologyIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="12" r="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="12" r="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="28" r="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="28" r="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="15" x2="14" y2="25" stroke={primaryColor} strokeWidth="2" />
    <line x1="26" y1="15" x2="26" y2="25" stroke={primaryColor} strokeWidth="2" />
    <line x1="17" y1="12" x2="23" y2="12" stroke={accentColor} strokeWidth="2" />
    <line x1="17" y1="20" x2="23" y2="20" stroke={accentColor} strokeWidth="2" />
    <line x1="17" y1="28" x2="23" y2="28" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const MycoplasmaCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="20" rx="12" ry="8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="16" cy="18" r="2" fill={accentColor} />
    <circle cx="22" cy="22" r="2" fill={accentColor} />
    <circle cx="24" cy="18" r="1.5" fill={primaryColor} />
  </svg>
);

export const PapSmearIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="16" cy="18" r="3" fill={accentColor} />
    <circle cx="24" cy="18" r="2" fill={primaryColor} />
    <circle cx="20" cy="24" r="2" fill={accentColor} />
  </svg>
);

export const BloodSmearIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="12" width="24" height="16" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="20" r="3" fill={accentColor} />
    <circle cx="22" cy="18" r="2" fill={primaryColor} />
    <circle cx="26" cy="22" r="2" fill={accentColor} />
  </svg>
);

export const PlateletCountIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="14" cy="16" rx="4" ry="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <ellipse cx="26" cy="16" rx="4" ry="3" stroke={primaryColor} strokeWidth="2" fill="none" />
    <ellipse cx="20" cy="26" rx="4" ry="3" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="16" r="1" fill={primaryColor} />
    <circle cx="26" cy="16" r="1" fill={primaryColor} />
    <circle cx="20" cy="26" r="1" fill={accentColor} />
  </svg>
);

export const PCRIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 10 C14 10 14 20 14 30" stroke={primaryColor} strokeWidth="2" />
    <path d="M26 10 C26 10 26 20 26 30" stroke={primaryColor} strokeWidth="2" />
    <path d="M14 14 C17 16 23 16 26 14" stroke={accentColor} strokeWidth="2" />
    <path d="M14 22 C17 24 23 24 26 22" stroke={accentColor} strokeWidth="2" />
    <circle cx="14" cy="10" r="2" fill={primaryColor} />
    <circle cx="26" cy="10" r="2" fill={primaryColor} />
  </svg>
);

export const ProgesteroneIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M12 28 L18 20 L24 24 L30 12" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="30" cy="12" r="3" fill={accentColor} />
    <line x1="12" y1="32" x2="30" y2="32" stroke={primaryColor} strokeWidth="2" />
  </svg>
);

export const ProlactinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M10 20 Q15 10 20 20 Q25 30 30 20" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="4" fill={accentColor} />
  </svg>
);

export const ProthrombinTimeIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="20" x2="20" y2="14" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="20" x2="26" y2="22" stroke={accentColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
    <path d="M28 8 L32 8 L32 12" stroke={primaryColor} strokeWidth="2" fill="none" />
  </svg>
);

export const RBCCountIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="16" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="16" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="26" r="5" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const RubellaIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="14" cy="14" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="26" cy="14" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="26" r="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="14" cy="14" r="1.5" fill={accentColor} />
    <circle cx="26" cy="14" r="1.5" fill={accentColor} />
    <circle cx="20" cy="26" r="1.5" fill={accentColor} />
  </svg>
);

export const SputumAFBIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="20" rx="12" ry="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <path d="M14 18 C16 16 18 20 20 18 C22 16 24 20 26 18" stroke={accentColor} strokeWidth="2" fill="none" />
    <path d="M14 24 C16 22 18 26 20 24 C22 22 24 26 26 24" stroke={accentColor} strokeWidth="2" fill="none" />
  </svg>
);

export const StoolCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="4" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="16" cy="16" r="2" fill={accentColor} />
    <circle cx="24" cy="16" r="2" fill={accentColor} />
    <circle cx="20" cy="24" r="2" fill={accentColor} />
  </svg>
);

export const TestosteroneIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="18" cy="22" r="8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="24" y1="16" x2="32" y2="8" stroke={primaryColor} strokeWidth="2" />
    <line x1="28" y1="8" x2="32" y2="8" stroke={accentColor} strokeWidth="2" />
    <line x1="32" y1="8" x2="32" y2="12" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const ThyroidPanelIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 16 C10 18 10 26 14 28 L20 32 L26 28 C30 26 30 18 26 16" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="8" x2="20" y2="16" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="22" r="3" fill={accentColor} />
  </svg>
);

export const TORCHPanelIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="8" width="24" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="8" y1="20" x2="32" y2="20" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="8" x2="20" y2="32" stroke={primaryColor} strokeWidth="2" />
    <circle cx="14" cy="14" r="2" fill={accentColor} />
    <circle cx="26" cy="14" r="2" fill={accentColor} />
    <circle cx="14" cy="26" r="2" fill={accentColor} />
    <circle cx="26" cy="26" r="2" fill={accentColor} />
  </svg>
);

export const TotalProteinIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="14" y="8" width="12" height="24" rx="2" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="16" x2="26" y2="16" stroke={primaryColor} strokeWidth="1" />
    <line x1="14" y1="24" x2="26" y2="24" stroke={primaryColor} strokeWidth="1" />
    <rect x="15" y="17" width="10" height="6" fill={accentColor} fillOpacity="0.5" />
  </svg>
);

export const TyphoidIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="20" rx="6" ry="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="14" y1="14" x2="10" y2="10" stroke={primaryColor} strokeWidth="2" />
    <line x1="26" y1="14" x2="30" y2="10" stroke={primaryColor} strokeWidth="2" />
    <line x1="14" y1="26" x2="10" y2="30" stroke={primaryColor} strokeWidth="2" />
    <line x1="26" y1="26" x2="30" y2="30" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const UrinalysisIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 8 L14 26 C14 30 16 32 20 32 C24 32 26 30 26 26 L26 8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="28" y2="8" stroke={primaryColor} strokeWidth="2" />
    <rect x="16" y="14" width="8" height="4" fill={accentColor} />
    <rect x="16" y="20" width="8" height="4" fill={accentColor} fillOpacity="0.5" />
  </svg>
);

export const UrineCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M14 8 L14 26 C14 30 16 32 20 32 C24 32 26 30 26 26 L26 8" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="28" y2="8" stroke={primaryColor} strokeWidth="2" />
    <circle cx="18" cy="22" r="2" fill={accentColor} />
    <circle cx="22" cy="18" r="2" fill={accentColor} />
    <circle cx="20" cy="26" r="1.5" fill={accentColor} />
  </svg>
);

export const ViralCultureIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="6" stroke={primaryColor} strokeWidth="2" fill="none" />
    <line x1="20" y1="10" x2="20" y2="14" stroke={primaryColor} strokeWidth="2" />
    <line x1="20" y1="26" x2="20" y2="30" stroke={primaryColor} strokeWidth="2" />
    <line x1="10" y1="20" x2="14" y2="20" stroke={primaryColor} strokeWidth="2" />
    <line x1="26" y1="20" x2="30" y2="20" stroke={primaryColor} strokeWidth="2" />
    <line x1="13" y1="13" x2="16" y2="16" stroke={primaryColor} strokeWidth="2" />
    <line x1="24" y1="24" x2="27" y2="27" stroke={primaryColor} strokeWidth="2" />
    <line x1="27" y1="13" x2="24" y2="16" stroke={primaryColor} strokeWidth="2" />
    <line x1="16" y1="24" x2="13" y2="27" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="20" r="2" fill={accentColor} />
  </svg>
);

export const WBCCountIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <circle cx="20" cy="20" r="10" stroke={primaryColor} strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="4" fill={accentColor} />
    <circle cx="18" cy="18" r="1.5" fill="white" />
  </svg>
);

export const testList = [
  { text: "Activated Partial Thromboplastin Time (APTT)", icon: APTTIcon, price: 450 },
  { text: "Alanine Aminotransferase (ALT)", icon: ALTIcon, price: 280 },
  { text: "Albumin", icon: AlbuminIcon, price: 250 },
  { text: "Alkaline Phosphatase (ALP)", icon: ALPIcon, price: 320 },
  { text: "Antigen Test (Bacterial)", icon: AntigenTestIcon, price: 550 },
  { text: "Aspartate Aminotransferase (AST)", icon: ASTIcon, price: 280 },
  { text: "Autopsy Pathology", icon: AutopsyPathologyIcon, price: 2500 },
  { text: "Bilirubin (Total & Direct)", icon: BilirubinIcon, price: 350 },
  { text: "Bleeding Time", icon: BleedingTimeIcon, price: 200 },
  { text: "Blood Culture", icon: BloodCultureIcon, price: 650 },
  { text: "Blood Glucose", icon: BloodGlucoseIcon, price: 150 },
  { text: "Blood Typing", icon: BloodTypingIcon, price: 300 },
  { text: "Blood Urea Nitrogen (BUN)", icon: BUNIcon, price: 280 },
  { text: "Bone Marrow Biopsy", icon: BoneMarrowIcon, price: 1800 },
  { text: "Chlamydia Culture", icon: ChlamydiaCultureIcon, price: 700 },
  { text: "Clotting Time", icon: ClottingTimeIcon, price: 180 },
  { text: "CMV Antibody (IgG/IgM)", icon: CMVAntibodyIcon, price: 800 },
  { text: "Complete Blood Count (CBC)", icon: CBCIcon, price: 350 },
  { text: "Cortisol", icon: CortisolIcon, price: 650 },
  { text: "COVID-19 RT-PCR", icon: COVID19Icon, price: 450 },
  { text: "Creatinine", icon: CreatinineIcon, price: 280 },
  { text: "CSF Culture", icon: CSFCultureIcon, price: 750 },
  { text: "Cytopathology", icon: CytopathologyIcon, price: 900 },
  { text: "D-Dimer", icon: DDimerIcon, price: 850 },
  { text: "Dengue NS1 Antigen", icon: DengueNS1Icon, price: 600 },
  { text: "Electrolytes", icon: ElectrolytesIcon, price: 450 },
  { text: "Electron Microscopy", icon: ElectronMicroscopyIcon, price: 1500 },
  { text: "Erythrocyte Sedimentation Rate (ESR)", icon: ESRIcon, price: 200 },
  { text: "Estrogen", icon: EstrogenIcon, price: 700 },
  { text: "Exfoliative Cytology", icon: ExfoliativeCytologyIcon, price: 600 },
  { text: "Fine Needle Aspiration (FNA)", icon: FNAIcon, price: 1200 },
  { text: "Flow Cytometry", icon: FlowCytometryIcon, price: 2500 },
  { text: "FSH (Follicle Stimulating Hormone)", icon: FSHIcon, price: 550 },
  { text: "Fungal Culture", icon: FungalCultureIcon, price: 500 },
  { text: "Gamma-Glutamyl Transferase (GGT)", icon: GGTIcon, price: 380 },
  { text: "Gonorrhea Culture", icon: GonorrheaCultureIcon, price: 650 },
  { text: "Gram Stain", icon: GramStainIcon, price: 250 },
  { text: "Growth Hormone", icon: GrowthHormoneIcon, price: 850 },
  { text: "HCG (Human Chorionic Gonadotropin)", icon: HCGIcon, price: 400 },
  { text: "Hemoglobin", icon: HemoglobinIcon, price: 180 },
  { text: "Hepatitis B Surface Antigen", icon: HepBIcon, price: 350 },
  { text: "Hepatitis C Antibody", icon: HepCIcon, price: 400 },
  { text: "Histopathology", icon: HistopathologyIcon, price: 1200 },
  { text: "HIV Antibody Test", icon: HIVIcon, price: 450 },
  { text: "Immunoglobulin Panel", icon: ImmunoglobulinIcon, price: 1500 },
  { text: "Immunohistochemistry", icon: ImmunohistochemistryIcon, price: 1800 },
  { text: "Insulin", icon: InsulinIcon, price: 550 },
  { text: "Kidney Function Test", icon: KidneyFunctionIcon, price: 650 },
  { text: "LH (Luteinizing Hormone)", icon: LHIcon, price: 550 },
  { text: "Lipid Profile", icon: LipidProfileIcon, price: 700 },
  { text: "Liver Function Test", icon: LiverFunctionIcon, price: 850 },
  { text: "Malaria Parasite Test", icon: MalariaIcon, price: 200 },
  { text: "Measles Antibody (IgG)", icon: MeaslesIcon, price: 600 },
  { text: "Molecular Pathology", icon: MolecularPathologyIcon, price: 2500 },
  { text: "Mycoplasma Culture", icon: MycoplasmaCultureIcon, price: 700 },
  { text: "Pap Smear Test", icon: PapSmearIcon, price: 450 },
  { text: "Peripheral Blood Smear", icon: BloodSmearIcon, price: 250 },
  { text: "Platelet Count", icon: PlateletCountIcon, price: 180 },
  { text: "Polymerase Chain Reaction (PCR)", icon: PCRIcon, price: 1800 },
  { text: "Progesterone", icon: ProgesteroneIcon, price: 550 },
  { text: "Prolactin", icon: ProlactinIcon, price: 500 },
  { text: "Prothrombin Time (PT)", icon: ProthrombinTimeIcon, price: 350 },
  { text: "RBC Count", icon: RBCCountIcon, price: 150 },
  { text: "Rubella IgG Antibody", icon: RubellaIcon, price: 550 },
  { text: "Sputum Culture (AFB)", icon: SputumAFBIcon, price: 500 },
  { text: "Stool Culture", icon: StoolCultureIcon, price: 450 },
  { text: "Testosterone", icon: TestosteroneIcon, price: 600 },
  { text: "Thyroid Panel", icon: ThyroidPanelIcon, price: 900 },
  { text: "Torch Panel (IgG/IgM)", icon: TORCHPanelIcon, price: 1200 },
  { text: "Total Protein", icon: TotalProteinIcon, price: 280 },
  { text: "Typhoid IgM/IgG Antibody", icon: TyphoidIcon, price: 500 },
  { text: "Urinalysis", icon: UrinalysisIcon, price: 180 },
  { text: "Urine Culture", icon: UrineCultureIcon, price: 400 },
  { text: "Viral Culture", icon: ViralCultureIcon, price: 850 },
  { text: "WBC Count", icon: WBCCountIcon, price: 150 },
];