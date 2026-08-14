import Link from "next/link";

/**
 * Shared page header band — sky gradient with the page's own poster image
 * washed in behind it, carrying a breadcrumb trail, title and tagline.
 *
 * Every page uses the same min-height so the headers line up across the site,
 * regardless of how much text each one carries.
 *
 * @param {string}  image   Poster path used as the background wash
 * @param {Array}   crumbs  [{ label, href? }] — the last crumb renders as plain text
 * @param {string}  title   Page heading (rendered as the page h1)
 * @param {string} [tagline] Optional supporting line under the title
 */
export default function PageHeroBand({ image, crumbs = [], title, tagline }) {
  return (
    <section className="relative">
      <div className="sm:hidden absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400" />
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400">
        {/* Inline style rather than an arbitrary background-image utility:
            Tailwind resolves those at build time and cannot see a runtime prop. */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[7.5rem] lg:min-h-[9.5rem] max-w-7xl flex-col justify-center gap-1.5 px-6 py-6 lg:py-8">
        {crumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-white/80"
          >
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-white/50" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-xl lg:text-3xl font-bold text-white">{title}</h1>

        {tagline && (
          <p className="max-w-2xl text-xs sm:text-sm lg:text-base text-white/90">
            {tagline}
          </p>
        )}
      </div>
    </section>
  );
}
