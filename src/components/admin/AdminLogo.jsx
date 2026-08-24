"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * The Cutis seal plus the name, matching the public navbar and footer.
 *
 * The mark is a circular seal, blue right to its own edge, so on the admin
 * console's white chrome it had nothing to sit against — hence the ring. At
 * these sizes the seal's own ring lettering ("Pvt. Ltd.", "Mid Baneshwor, KTM")
 * is far too small to read, so the type beside it carries the name.
 */
const SIZES = {
  sm: { seal: "h-9 w-9", name: "text-[12px]", sub: "text-[8px]", gap: "gap-2", pad: "p-[2px]" },
  md: { seal: "h-11 w-11", name: "text-[13px]", sub: "text-[9px]", gap: "gap-2.5", pad: "p-[3px]" },
  lg: { seal: "h-14 w-14", name: "text-base", sub: "text-[10px]", gap: "gap-3", pad: "p-1" },
  xl: { seal: "h-16 w-16", name: "text-lg", sub: "text-[10px]", gap: "gap-3", pad: "p-1" },
};

export default function AdminLogo({
  href = "/admin",
  size = "md",
  priority = false,
  // The mobile header already shows a page title next to this, so it can drop
  // the name and keep the mark alone.
  showName = true,
  className = "",
}) {
  const s = SIZES[size] || SIZES.md;

  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-white ${s.pad} shadow-sm ring-1 ring-brand-200`}
      >
        <Image
          src="/images/logo/cutis-seal-192.png"
          alt={showName ? "" : "Cutis Path Lab"}
          width={192}
          height={192}
          /* Next re-encodes at quality 75 by default, which softens the seal's
             fine lettering at this size. 90 is allow-listed in next.config. */
          quality={90}
          className={`${s.seal} rounded-full object-contain`}
          priority={priority}
        />
      </span>

      {showName ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className={`truncate font-bold tracking-tight text-brand-700 ${s.name}`}>
            CUTIS PATH LAB
          </span>
          <span
            className={`mt-1 truncate font-medium uppercase tracking-[0.14em] text-slate-400 ${s.sub}`}
          >
            Pvt. Ltd. &middot; Estd. 2017
          </span>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div className={`inline-flex min-w-0 items-center ${s.gap} ${className}`}>{content}</div>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex min-w-0 items-center ${s.gap} rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${className}`}
    >
      {content}
    </Link>
  );
}
