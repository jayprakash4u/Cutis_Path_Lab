import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";

const SKY = "#3750A4";
const CORAL = "#C62F45";

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
          {/*
            Left 45% — two photographs in a fixed frame.

            This was a 4:5 portrait with a grey offset shape behind it and a
            second photo floating outside the column on a negative bottom
            offset. At 45% of the shell that portrait came to roughly 620x775,
            taller than the whole right-hand column, and the overhang needed
            pb-20 of dead space underneath while still clipping at the section
            edge. Both photos now sit inside one 4:3 frame — about 465px tall,
            which balances the content beside it — with nothing overflowing.
          */}
          <div className="relative mx-auto w-full max-w-lg pb-12 sm:pb-14 lg:max-w-none">
            {/* Soft offset shape behind the main image */}
            <div
              className="pointer-events-none absolute -left-4 -top-6 z-0 h-1/2 w-3/4 rounded-2xl bg-slate-200/50 sm:-left-6 sm:-top-8"
              aria-hidden
            />

            <div className="relative z-10">
              {/*
                4:3, not the 4:5 this was. At 45% of the shell that portrait
                came to roughly 620x775 — taller than the entire column beside
                it, which is what made the section read as one big photograph.
              */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-float">
                <Image
                  src="/images/home/AboutHomePage/main-image.png"
                  alt="Cutis Path Lab pathologist at work"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>

              {/*
                Floating secondary image, overlapping the corner. Anchored at
                right-0 then nudged out by translate-x-[20%] — a percentage
                transform is relative to the element's own width, so exactly
                80% of it sits over the main photo and 20% spills past the
                column's right edge into the gap before the text column.
              */}
              <div className="absolute -bottom-10 right-0 z-20 w-[46%] translate-x-[20%] overflow-hidden rounded-2xl border-[6px] border-white bg-white shadow-float sm:-bottom-12 sm:w-[42%]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/home/AboutHomePage/sub-image.png"
                    alt="Cutis Path Lab samples and equipment"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 20vw, 46vw"
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

            <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={item.id || item.title}
                  className="group flex gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 p-1.5 ring-1 ring-brand-100 transition duration-300 group-hover:bg-brand-100">
                    <AboutIcon iconKey={item.iconKey} index={idx} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={section?.ctaHref || "/about"}
              /* Matches the button the rest of the site settled on — the
                 rounded-full pill with a circled arrow inside a tinted disc was
                 the only one of its kind on the page. */
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {section?.ctaLabel || "Learn More About Us"}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
