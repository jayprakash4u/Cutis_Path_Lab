"use client"

import { ReactNode } from "react"

interface HexagonStripCardProps {
  color: string
  children?: ReactNode
  className?: string
}

export function HexagonStripCard({
  color,
  children,
  className = "",
}: HexagonStripCardProps) {
  return (
    <div className={`relative w-full h-16 ${className}`}>
      <svg
        viewBox="0 0 400 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Hexagon shape with colored border */}
        <polygon
          points="32,4 54,18 54,46 32,60 10,46 10,18"
          fill={color}
        />
        <polygon
          points="32,10 48,21 48,43 32,54 16,43 16,21"
          fill="white"
        />

        {/* Strip with arrow end */}
        <polygon
          points="45,12 370,12 390,32 370,52 45,52"
          fill="white"
        />
      </svg>

      {/* Content overlay */}
      {children && (
        <div className="absolute inset-0 pl-20 flex items-center text-gray-700 font-medium">
          {children}
        </div>
      )}
    </div>
  )
}

// Preset color variants matching the image
export function DarkGrayHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#4A5568" className={className}>{children}</HexagonStripCard>
}

export function DarkBlueHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#2C5282" className={className}>{children}</HexagonStripCard>
}

export function MediumBlueHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#3182CE" className={className}>{children}</HexagonStripCard>
}

export function BlueGrayHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#4A6785" className={className}>{children}</HexagonStripCard>
}

export function MaroonHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#9B2C2C" className={className}>{children}</HexagonStripCard>
}

// Custom color variants with your specified colors
export function SkyBlueHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#0284c7" className={className}>{children}</HexagonStripCard>
}

export function CoralHexagonCard({ children, className }: { children?: ReactNode; className?: string }) {
  return <HexagonStripCard color="#FF6B6B" className={className}>{children}</HexagonStripCard>
}