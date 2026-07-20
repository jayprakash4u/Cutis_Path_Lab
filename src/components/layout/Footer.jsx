import Link from "next/link";
import Image from "next/image";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Tests", href: "/tests" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Book a Test", href: "/book" },
];

const contact = {
  address: "Mid-Baneshwor, Opposite to Ratna Rajya School, Kathmandu",
  phone: "+977-9825849435",
  phoneHref: "tel:+9779825849435",
  email: "cutislabpath@gmail.com",
  emailHref: "mailto:cutislabpath@gmail.com",
  hours: "Sat – Thu · 10:00 AM – 6:00 PM",
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9779825849435",
    icon: (
      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[11px] text-slate-400 transition-colors hover:text-white sm:text-sm"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        {/* Mobile / tablet: compact stacked layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-sm"
            >
              <Image
                src="/images/cutis.png"
                alt="Cutis Path Lab"
                width={100}
                height={36}
                className="h-6 w-auto sm:h-8"
              />
            </Link>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-sky-500 hover:bg-sky-600 hover:text-white sm:h-8 sm:w-8"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-5 sm:gap-4">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-400">
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
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-400">
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

          <div className="mt-3 space-y-1 border-t border-slate-800/80 pt-3 text-[11px] leading-snug text-slate-400 sm:mt-5 sm:space-y-1.5 sm:pt-4 sm:text-sm">
            <p className="line-clamp-2">{contact.address}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <a href={contact.phoneHref} className="hover:text-white">
                {contact.phone}
              </a>
              <span className="text-slate-700" aria-hidden="true">
                ·
              </span>
              <a href={contact.emailHref} className="truncate hover:text-white">
                {contact.email}
              </a>
            </div>
            <p className="text-slate-500">{contact.hours}</p>
          </div>

          <p className="mt-2.5 border-t border-slate-800/80 pt-2.5 text-center text-[10px] text-slate-500 sm:mt-4 sm:pt-3 sm:text-xs">
            © {new Date().getFullYear()} Cutis Path Lab · Kathmandu, Nepal
          </p>
        </div>

        {/* Desktop: keep spacious original layout */}
        <div className="hidden lg:block">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm"
              >
                <Image
                  src="/images/cutis.png"
                  alt="Cutis Path Lab"
                  width={120}
                  height={44}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Accurate diagnostics, clear reports, and reliable pathology
                services for patients and partner clinicians across Kathmandu.
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-sky-500 hover:bg-sky-600 hover:text-white"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
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
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
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
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                Visit & contact
              </h3>
              <ul className="mt-4 space-y-3.5 text-sm text-slate-400">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-[#FF6B6B]" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>{contact.address}</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-[#FF6B6B]" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <a href={contact.phoneHref} className="transition-colors hover:text-white">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-[#FF6B6B]" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <a href={contact.emailHref} className="transition-colors hover:text-white">
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-[#FF6B6B]" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span>{contact.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-slate-800/80 pt-6">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Cutis Path Lab. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">Pathology lab · Kathmandu, Nepal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
