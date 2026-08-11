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
  address: "Mid-Baneshwor, opposite Ratna Rajya School, Kathmandu",
  phone: "+977-9825849435",
  phoneHref: "tel:+9779825849435",
  email: "cutislabpath@gmail.com",
  emailHref: "mailto:cutislabpath@gmail.com",
  hours: "Sat – Thu · 10:00 – 18:00",
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9779825849435",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[13px] text-clinical-100/80 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="band-deep relative isolate overflow-hidden text-clinical-100/75">
      <div
        className="absolute -right-40 -top-32 h-[26rem] w-[26rem] rounded-full bg-clinical-500/22 blur-[130px]"
        aria-hidden="true"
      />
      <div className="shell relative py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-white px-3 py-2"
            >
              <Image
                src="/images/cutis.png"
                alt="Cutis Path Lab"
                width={120}
                height={44}
                className="h-8 w-auto lg:h-9"
              />
            </Link>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-clinical-100/70">
              A pathology laboratory in Mid-Baneshwor running haematology,
              biochemistry, microbiology and molecular testing, with home
              collection across Kathmandu valley.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-clinical-300/20 text-clinical-100/70 transition-all hover:border-assay-400/60 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h2 className="label !text-clinical-300">Explore</h2>
              <ul className="mt-4 space-y-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label !text-clinical-300">Company</h2>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <h2 className="label !text-clinical-300">Visit &amp; contact</h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div>
                <dt className="sr-only">Address</dt>
                <dd className="text-clinical-100/70">{contact.address}</dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="label w-16 shrink-0 !text-clinical-300">Phone</dt>
                <dd>
                  <a
                    href={contact.phoneHref}
                    className="mono text-[13px] text-clinical-100/80 transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="label w-16 shrink-0 !text-clinical-300">Email</dt>
                <dd>
                  <a
                    href={contact.emailHref}
                    className="mono break-all text-[13px] text-clinical-100/80 transition-colors hover:text-white"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="label w-16 shrink-0 !text-clinical-300">Hours</dt>
                <dd className="mono text-[13px] text-clinical-100/70">
                  {contact.hours}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-clinical-300/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-[11px] text-clinical-200/85">
            © {new Date().getFullYear()} Cutis Path Lab
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-clinical-200/85">
            NABL accredited · ISO 15189:2012
          </p>
        </div>
      </div>
    </footer>
  );
}
