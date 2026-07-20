"use client";

import Link from "next/link";
import {
  resolveServiceIcon,
  shortServiceDescription,
} from "@/lib/serviceIcons";

/**
 * Icon service card — roomy layout matching the original services grid.
 */
export default function ServiceIconCard({
  service,
  href,
  ctaLabel = "Know More",
  descriptionMax = 48,
  className = "",
}) {
  const IconComponent = resolveServiceIcon(service);
  const linkHref = href || `/services/${service.id}`;

  return (
    <article
      className={`flex h-full flex-col items-center rounded-xl border border-slate-200 border-t-4 border-t-[#FF6B6B] bg-white p-5 shadow-sm transition-all duration-300 group hover:border-[#FF6B6B] hover:shadow-lg sm:p-6 md:p-7 ${className}`}
    >
      <div className="mb-4">
        <IconComponent size={52} className="h-12 w-12 sm:h-14 sm:w-14" />
      </div>
      <h3 className="mb-2 text-center text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#FF6B6B] sm:text-base">
        {service.name}
      </h3>
      <p className="mb-5 flex-1 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
        {shortServiceDescription(service.description, descriptionMax)}
      </p>
      <Link
        href={linkHref}
        className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-sky-700"
      >
        {ctaLabel}{" "}
        <span className="ml-1 text-[#FF6B6B]" aria-hidden="true">
          &gt;&gt;
        </span>
      </Link>
    </article>
  );
}
