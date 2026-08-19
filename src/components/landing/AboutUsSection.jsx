import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";

const SKY = "#0284C7";
const CORAL = "#FF6B6B";

/**
 * Same construction as QuickIcon and TechIcon: 48px grid, 2px primary strokes,
 * 1.8px secondary, round caps and joins, sky line work with coral marking the
 * one detail that names the point.
 */
const ICON_ORDER = ["tech", "people", "quality", "timely"];

function AboutIcon({ iconKey, index }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: "h-full w-full",
  };

  const icons = [
    // 1 — Advanced Technology: microscope, coral slide on the stage
    <svg key="tech" {...common}>
      <path d="M10 41h28" stroke={SKY} strokeWidth="2" />
      <path d="M18 41c-3.5-2.6-5.5-6.6-5.5-11 0-4.6 2.4-8.7 6-11" stroke={SKY} strokeWidth="2" />
      <rect
        x="22"
        y="6"
        width="9"
        height="17"
        rx="2.5"
        transform="rotate(18 22 6)"
        stroke={SKY}
        strokeWidth="2"
      />
      <path d="M20.5 25.5l6.5 2" stroke={SKY} strokeWidth="2" />
      <path d="M22 41h14" stroke={SKY} strokeWidth="1.8" />
      <path d="M16 33h16" stroke={CORAL} strokeWidth="2" />
      <path d="M22 30v3" stroke={CORAL} strokeWidth="1.8" />
    </svg>,

    // 2 — Expert Professionals: clinician with a coral badge
    <svg key="people" {...common}>
      <circle cx="20" cy="14" r="7" stroke={SKY} strokeWidth="2" />
      <path d="M7 40v-3a11 11 0 0 1 11-11h4a11 11 0 0 1 11 11v3" stroke={SKY} strokeWidth="2" />
      <path d="M34 20a5.5 5.5 0 1 0-4-9.3" stroke={SKY} strokeWidth="1.8" />
      <path d="M38 40v-2.5a8.5 8.5 0 0 0-5-7.7" stroke={SKY} strokeWidth="1.8" />
      <rect x="24" y="30" width="7" height="9" rx="1.5" stroke={CORAL} strokeWidth="2" />
      <path d="M27.5 33v3M26 34.5h3" stroke={CORAL} strokeWidth="1.8" />
    </svg>,

    // 3 — Quality Assurance: accreditation shield with a coral seal
    <svg key="quality" {...common}>
      <path
        d="M24 5l14 5v11c0 9.4-6 16.6-14 19-8-2.4-14-9.6-14-19V10l14-5Z"
        stroke={SKY}
        strokeWidth="2"
      />
      <path d="M17 22h14M17 28h9" stroke={SKY} strokeWidth="1.8" />
      <circle cx="30" cy="30" r="6" fill="#fff" stroke={CORAL} strokeWidth="2" />
      <path d="M27.5 30l1.8 1.8 3.2-3.4" stroke={CORAL} strokeWidth="2" />
    </svg>,

    // 4 — Timely & Reliable: clock with coral hands and motion marks
    <svg key="timely" {...common}>
      <circle cx="26" cy="24" r="15" stroke={SKY} strokeWidth="2" />
      <path d="M26 10.5v3M26 34.5v3M39.5 24h-3M15.5 24h-3" stroke={SKY} strokeWidth="1.8" />
      <path d="M26 15.5V24l6 4" stroke={CORAL} strokeWidth="2" />
      <path d="M9 17h6M6 24h4M9 31h6" stroke={CORAL} strokeWidth="1.8" />
    </svg>,
  ];

  // Rows carry an icon key; anything unrecognised falls back to position.
  const byKey = ICON_ORDER.indexOf(iconKey);
  return icons[byKey >= 0 ? byKey : index] ?? icons[0];
}

/* Shown when the section has no rows — an empty table must not blank the page. */
const DEFAULT_HIGHLIGHTS = [
  {
    title: "Advanced Technology",
    description:
      "Modern equipment and digital workflows for precise, reliable results.",
    iconKey: "tech",
  },
  {
    title: "Expert Professionals",
    description:
      "Qualified pathologists and technicians with years of hands-on experience.",
    iconKey: "people",
  },
  {
    title: "Quality Assurance",
    description:
      "NABL accredited and ISO 15189:2012 compliant to maintain the highest testing standards.",
    iconKey: "quality",
  },
  {
    title: "Timely & Reliable",
    description:
      "Quick turnaround without compromising accuracy, because every result matters.",
    iconKey: "timely",
  },
];

export default function AboutUsSection({ section, items }) {
  const highlights = items?.length ? items : DEFAULT_HIGHLIGHTS;

  return (
    <Section tone="white">
      <div>
        <div className="grid items-center gap-12 lg:grid-cols-[45fr_55fr] lg:gap-14 xl:gap-20">
          {/* Left 45% — image collage */}
          <div className="relative mx-auto w-full max-w-lg pb-16 sm:pb-20 lg:max-w-none">
            {/* Soft offset shape behind the main image */}
            <div
              className="pointer-events-none absolute -left-4 -top-6 z-0 h-1/2 w-3/4 rounded-2xl bg-slate-200/50 sm:-left-6 sm:-top-8"
              aria-hidden
            />

            <div className="relative z-10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-float">
                <Image
                  src="/images/home/abouthomepage/pathlab1.jpg"
                  alt="Cutis Path Lab pathologist at work"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              {/* Floating secondary image */}
              <div className="absolute -bottom-12 right-0 z-20 w-[56%] overflow-hidden rounded-2xl border-[6px] border-white bg-white shadow-float sm:-bottom-14 sm:w-[52%] sm:translate-x-[10%]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/home/abouthomepage/pathlab2.jpg"
                    alt="Cutis Path Lab samples and equipment"
                    fill
                    className="object-cover object-center"
                    sizes="300px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right 55% — content */}
          <div>
            <SectionHeading
              title={section?.title || "Advanced technology, trusted professionals"}
              subtitle={section?.subtitle || "We combine modern diagnostic technology with a team of dedicated specialists to deliver accurate, reliable and timely results. Your health is our priority, and excellence is our commitment."}
              className="!mb-0"
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {highlights.map((item, idx) => (
                <div
                  key={item.id || item.title}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-card-hover"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 p-2 ring-1 ring-sky-100 transition duration-300 group-hover:bg-sky-100">
                    <AboutIcon iconKey={item.iconKey} index={idx} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={section?.ctaHref || "/about"}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-sky-600 py-2.5 pl-7 pr-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/25 transition duration-300 hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:text-base"
            >
              {section?.ctaLabel || "Learn More About Us"}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition duration-300 group-hover:translate-x-0.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
