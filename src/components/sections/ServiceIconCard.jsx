"use client";

import Link from "next/link";
import {
  resolveServiceIcon,
  shortServiceDescription,
} from "@/lib/serviceIcons";

/** Icon service card — one of the grid cells on the services page. */
export default function ServiceIconCard({
  service,
  href,
  ctaLabel = "Know more",
  descriptionMax = 48,
  className = "",
}) {
  const IconComponent = resolveServiceIcon(service);
  const linkHref = href || `/services/${service.id}`;

  return (
    <article
      className={`card card-hover group flex h-full flex-col p-5 sm:p-6 ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-clinical-50">
        <IconComponent size={28} className="h-7 w-7" />
      </span>

      <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink-900 transition-colors group-hover:text-clinical-700">
        {service.name}
      </h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-500">
        {shortServiceDescription(service.description, descriptionMax)}
      </p>

      <Link
        href={linkHref}
        className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[13px] font-semibold text-clinical-700 transition-colors hover:text-clinical-600"
      >
        {ctaLabel}
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}
