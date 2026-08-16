import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Expert Lab Technicians",
    description:
      "Trained medical laboratory technicians with quality-focused workflows and a patient-first mindset.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "NABL Accredited",
    tag: "Lab Quality Accreditation",
    description:
      "National Accreditation Board recognition for medical testing — validated quality systems you can trust.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "ISO 15189:2012 Compliant",
    tag: "Quality Certification",
    description:
      "Structured processes, calibrated equipment, and consistent diagnostic accuracy to the international standard.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "CAP Pathology Standards",
    tag: "Clinical Certification",
    description:
      "Benchmarked against College of American Pathologists practices — rigorous review and quality controls.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
];

function DotPattern({ className = "", cols = 6, rows = 6 }) {
  return (
    <div
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      aria-hidden
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i % 3 === 0 ? "bg-[#FF6B6B]/30" : "bg-sky-300/60"
          }`}
        />
      ))}
    </div>
  );
}

export default function AboutUsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F7FE] via-[#F7FAFF] to-white py-10 sm:py-14 md:py-20">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#FF6B6B]/10 blur-3xl"
        aria-hidden
      />
      <DotPattern
        className="pointer-events-none absolute right-6 top-8 hidden xl:grid"
        cols={7}
        rows={4}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[45fr_55fr] lg:gap-12 xl:gap-16">
          {/* Left 45% — image collage with decorative shapes */}
          <div className="relative mx-auto w-full max-w-lg pb-16 sm:pb-20 lg:max-w-none">
            {/* Blue organic blob */}
            <div
              className="pointer-events-none absolute -left-4 top-8 z-0 h-40 w-40 rounded-[48%_52%_40%_60%/55%_45%_55%_45%] bg-gradient-to-br from-sky-600 to-sky-500 sm:-left-8 sm:h-52 sm:w-52"
              aria-hidden
            />
            {/* Red organic blob */}
            <div
              className="pointer-events-none absolute bottom-10 right-0 z-0 h-32 w-32 rounded-[55%_45%_50%_50%/45%_55%_45%_55%] bg-[#FF6B6B] sm:h-44 sm:w-44"
              aria-hidden
            />
            <DotPattern className="absolute -left-1 top-16 z-10 sm:-left-3 sm:top-24" cols={5} rows={5} />

            <div className="relative z-10 ml-6 sm:ml-12 lg:ml-10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[5rem] shadow-2xl ring-1 ring-white/60 sm:rounded-[2.5rem] sm:rounded-tr-[7rem]">
                <Image
                  src="/images/home/abouthomepage/pathlab1.jpg"
                  alt="Cutis Path Lab facility"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              {/* Floating secondary image */}
              <div className="absolute bottom-0 right-0 z-20 w-[48%] translate-x-[8%] translate-y-[24%] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl sm:w-[46%] sm:rounded-3xl sm:border-[6px]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/home/abouthomepage/pathlab2.jpg"
                    alt="Cutis Path Lab team and equipment"
                    fill
                    className="object-cover object-center"
                    sizes="260px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right 55% — content */}
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full bg-sky-600 px-5 py-2.5 shadow-lg shadow-sky-600/20">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                About Cutis Path Lab
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Advanced Technology.
              <br />
              <span className="text-sky-600">Trusted Professionals.</span>
            </h2>

            <div className="mt-5 h-1.5 w-16 rounded-full bg-[#FF6B6B]" aria-hidden />

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
              At Cutis Path Lab, we combine advanced technology with a team of dedicated experts to
              deliver accurate, reliable, and timely diagnostic results. Your health is our priority,
              and excellence is our commitment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group flex gap-4 rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-600/10 sm:p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    {item.tag && (
                      <span className="mb-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:text-base"
            >
              Learn More About Us
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
