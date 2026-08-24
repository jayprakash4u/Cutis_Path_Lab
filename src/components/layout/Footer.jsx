"use client";

import Link from "next/link";
import Image from "next/image";
import { mailHref, telHref, useSiteFooter } from "@/lib/useSiteChrome";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Tests", href: "/tests" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Book a Test", href: "/book" },
];

/* Artwork stays in code; the URLs come from the saved footer settings, and a
   network with no URL saved drops out of the row. */
const SOCIAL_ICONS = [
  {
    name: "Facebook",
    field: "facebookUrl",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    field: "instagramUrl",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    field: "whatsappUrl",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    field: "tiktokUrl",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.58-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[11px] text-brand-100 transition-colors hover:text-white sm:text-sm"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const site = useSiteFooter();
  const socialLinks = SOCIAL_ICONS.map((social) => ({
    ...social,
    href: site[social.field],
  })).filter((social) => social.href);

  return (
    <footer className="relative overflow-hidden bg-brand-600 text-brand-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-shell px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        {/* Mobile / tablet: compact stacked layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="inline-flex min-w-0 shrink items-center gap-2.5"
            >
              {/* Round plate — the seal is blue to its own edge, so on a blue
                  footer it needs something to sit against. Same lockup as the
                  navbar: mark, then the name in type. */}
              <span className="flex shrink-0 items-center justify-center rounded-full bg-white p-[3px] shadow-sm">
                <Image
                  src="/images/logo/cutis-seal-192.png"
                  alt=""
                  width={192}
                  height={192}
                  quality={90}
                  className="h-9 w-9 rounded-full sm:h-11 sm:w-11"
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate text-[13px] font-bold tracking-tight text-white sm:text-[15px]">
                  CUTIS PATH LAB
                </span>
                <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-brand-200">
                  Pvt. Ltd. &middot; Estd. 2017
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-accent-500 bg-accent-500 text-white transition-colors hover:bg-accent-600 hover:border-accent-600 sm:h-8 sm:w-8"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-5 sm:gap-4">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-300">
                Explore
              </h3>
              <ul className="mt-1.5 space-y-1 sm:mt-2.5 sm:space-y-1.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-300">
                Company
              </h3>
              <ul className="mt-1.5 space-y-1 sm:mt-2.5 sm:space-y-1.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-3 space-y-1 border-t border-white/15 pt-3 text-[11px] leading-snug text-brand-100 sm:mt-5 sm:space-y-1.5 sm:pt-4 sm:text-sm">
            <p className="line-clamp-2">{site.address}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <a href={telHref(site.phone)} className="hover:text-white">
                {site.phone}
              </a>
              <span className="text-brand-300" aria-hidden="true">
                ·
              </span>
              <a href={mailHref(site.email)} className="truncate hover:text-white">
                {site.email}
              </a>
            </div>
            <p className="text-brand-200">{site.hours}</p>
          </div>

          <p className="mt-2.5 border-t border-white/15 pt-2.5 text-center text-[10px] text-brand-200 sm:mt-4 sm:pt-3 sm:text-xs">
            © {new Date().getFullYear()} {site.brandName}
          </p>
        </div>

        {/* Desktop: keep spacious original layout */}
        <div className="hidden lg:block">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <span className="flex shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm">
                  <Image
                    src="/images/logo/cutis-seal-192.png"
                    alt=""
                    width={192}
                    height={192}
                    quality={90}
                    className="h-16 w-16 rounded-full"
                  />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-xl font-bold tracking-tight text-white">
                    CUTIS PATH LAB
                  </span>
                  <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-200">
                    Pvt. Ltd. &middot; Estd. 2017
                  </span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100">
                {site.tagline}
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-500 bg-accent-500 text-white transition-colors hover:bg-accent-600 hover:border-accent-600"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                Explore
              </h3>
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                Visit & contact
              </h3>
              <ul className="mt-4 space-y-3.5 text-sm text-brand-100">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-brand-200" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>{site.address}</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-brand-200" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <a href={telHref(site.phone)} className="transition-colors hover:text-white">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-brand-200" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <a href={mailHref(site.email)} className="transition-colors hover:text-white">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-brand-200" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span>{site.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-6">
            <p className="text-sm text-brand-200">
              © {new Date().getFullYear()} {site.brandName}. All rights reserved.
            </p>
            <p className="text-sm text-brand-200">{site.note}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
