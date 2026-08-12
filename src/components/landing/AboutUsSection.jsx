import Image from "next/image";

const highlights = [
  {
    title: "Medical Laboratory Technicians",
    description:
      "Our lab technicians are the backbone of Cutis Path Lab. With hands-on training, quality-focused workflows, and a patient-first mindset, they deliver reliable results every day.",
    iconBg: "bg-sky-600 shadow-sky-600/20",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "NABL Accredited Laboratory",
    tag: "Lab Quality Accreditation",
    description:
      "National Accreditation Board recognition for medical testing — validated quality systems, trained staff, and dependable reports you can trust.",
    iconBg: "bg-[#FF6B6B] shadow-[#FF6B6B]/25",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "ISO 15189:2012 Compliant",
    tag: "Quality Certification",
    description:
      "International standard for medical laboratory competence — structured processes, calibrated equipment, and consistent diagnostic accuracy.",
    iconBg: "bg-sky-600 shadow-sky-600/20",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "CAP Certified Pathology Standards",
    tag: "Clinical Certification",
    description:
      "Benchmarked against College of American Pathologists practices — rigorous review, quality controls, and excellence in pathology services.",
    iconBg: "bg-[#FF6B6B] shadow-[#FF6B6B]/25",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
];

function DotPattern({ className = "" }) {
  return (
    <div className={`grid grid-cols-6 gap-2 ${className}`} aria-hidden>
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i % 3 === 0 ? "bg-[#FF6B6B]/35" : "bg-sky-300/50"
          }`}
        />
      ))}
    </div>
  );
}

export default function AboutUsSection() {
  return (
    <section className="section-y relative overflow-x-hidden bg-white">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#FF6B6B]/10 blur-3xl"
        aria-hidden
      />

      <div className="section-shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Left — image collage */}
          <div className="relative mx-auto w-full max-w-lg overflow-visible pb-14 sm:pb-16 md:pb-20 lg:max-w-none">
            <DotPattern className="absolute -left-2 top-0 z-0 sm:-left-4 sm:top-2" />

            <div className="relative z-10 ml-4 overflow-visible sm:ml-10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200/80 sm:rounded-3xl">
                <Image
                  src="/images/home/abouthomepage/pathlab1.jpg"
                  alt="Cutis Path Lab facility"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 right-0 z-20 w-[46%] translate-y-[18%] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl sm:w-[44%] sm:translate-y-[22%] sm:rounded-3xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/home/abouthomepage/pathlab2.jpg"
                    alt="Cutis Path Lab team and equipment"
                    fill
                    className="object-cover object-center"
                    sizes="220px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 inline-block rounded-tr-2xl rounded-bl-2xl bg-sky-600 px-4 py-2">
                <span className="text-sm font-bold text-white sm:text-base">About Us</span>
              </div>

              <h2 className="max-w-md text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Advanced Technology.{" "}
                <span className="text-sky-600">Trusted Teams.</span>
              </h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                Accurate diagnostics, accredited quality, and patient-first care at Cutis Path Lab.
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    {item.tag && (
                      <span className="mb-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 sm:text-[11px]">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
