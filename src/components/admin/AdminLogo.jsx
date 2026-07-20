"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Same Cutis mark as the public navbar — full horizontal logo, not a cropped icon.
 */
export default function AdminLogo({
  href = "/admin",
  size = "md",
  priority = false,
  className = "",
}) {
  const sizes = {
    sm: { width: 110, height: 40, className: "w-[100px] h-auto" },
    md: { width: 150, height: 52, className: "w-[128px] sm:w-[150px] h-auto" },
    lg: { width: 200, height: 70, className: "w-[160px] sm:w-[190px] h-auto" },
    xl: { width: 240, height: 84, className: "w-[180px] sm:w-[220px] h-auto" },
  };
  const s = sizes[size] || sizes.md;

  const image = (
    <Image
      src="/images/cutis.png"
      alt="Cutis Path Lab"
      width={s.width}
      height={s.height}
      className={`${s.className} object-contain object-left`}
      priority={priority}
    />
  );

  if (!href) {
    return <div className={`inline-flex items-center ${className}`}>{image}</div>;
  }

  return (
    <Link href={href} className={`inline-flex items-center shrink-0 ${className}`}>
      {image}
    </Link>
  );
}
