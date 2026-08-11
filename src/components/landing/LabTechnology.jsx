import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const technologies = [
  {
    title: "Digital pathology",
    claim: "Slides scanned whole, read on screen",
    points: ["Whole-slide imaging", "Remote second opinion", "Archived and retrievable"],
  },
  {
    title: "Molecular testing",
    claim: "DNA and RNA panels run in house",
    points: ["Infectious targets", "Oncology markers", "Clinician-ready reporting"],
  },
  {
    title: "Real-time PCR",
    claim: "High-sensitivity detection",
    points: ["Pathogen identification", "Viral load monitoring", "Outbreak response"],
  },
  {
    title: "Automated processing",
    claim: "Fewer hands on every sample",
    points: ["Robotic aliquoting", "Barcode tracking", "Stable throughput"],
  },
  {
    title: "Sample tracking",
    claim: "Visible from collection to report",
    points: ["Scan points at each handover", "Status updates", "Location history"],
  },
  {
    title: "Assisted review",
    claim: "Software flags, pathologists decide",
    points: ["Pattern recognition", "Priority queueing", "Nothing auto-released"],
  },
];

function TechIcon({ index, className = "" }) {
  const icons = [
    <svg key="digital" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <rect x="22" y="12" width="36" height="30" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="4" fill="currentColor" opacity="0.35" />
      <line x1="30" y1="50" x2="30" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="50" x2="40" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
      <rect x="25" y="58" width="30" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    <svg key="molecular" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path d="M32 12 Q26 18 32 26 Q40 32 32 40 Q26 48 32 56 Q40 64 32 72" stroke="currentColor" strokeWidth="2" />
      <path d="M48 12 Q54 18 48 26 Q40 32 48 40 Q54 48 48 56 Q40 64 48 72" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="20" r="2.5" fill="currentColor" />
      <circle cx="48" cy="28" r="2.5" fill="currentColor" />
      <circle cx="32" cy="44" r="2.5" fill="currentColor" />
      <circle cx="48" cy="52" r="2.5" fill="currentColor" />
      <line x1="32" y1="20" x2="48" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="44" x2="48" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>,
    <svg key="pcr" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path d="M10 56 Q16 48 22 56 Q28 64 34 56" stroke="currentColor" strokeWidth="2" />
      <path d="M30 42 Q37 28 44 42 Q51 56 58 42" stroke="currentColor" strokeWidth="2" />
      <path d="M52 30 Q60 14 68 30" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="66" x2="72" y2="66" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="22" cy="56" r="2" fill="currentColor" />
      <circle cx="44" cy="42" r="2" fill="currentColor" />
      <circle cx="60" cy="30" r="2" fill="currentColor" />
    </svg>,
    <svg key="automation" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="60" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="45" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="25" x2="20" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <line x1="40" y1="25" x2="40" y2="54" stroke="currentColor" strokeWidth="1.5" />
      <line x1="60" y1="25" x2="60" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="60" r="2.5" fill="currentColor" />
    </svg>,
    <svg key="tracking" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <rect x="14" y="22" width="40" height="42" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="28" width="28" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="48" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="48" r="3.5" fill="currentColor" opacity="0.35" />
      <circle cx="58" cy="26" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="68" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M56 29 Q62 22 68 14" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    </svg>,
    <svg key="ai" viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <circle cx="40" cy="22" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="25" cy="40" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="55" cy="40" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="58" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M38 28 L27 36" stroke="currentColor" strokeWidth="1.5" />
      <path d="M42 28 L53 36" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 46 L40 52" stroke="currentColor" strokeWidth="1.5" />
      <path d="M55 46 L40 52" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="22" r="3" fill="currentColor" />
    </svg>,
  ];

  return icons[index] ?? icons[0];
}

export default function LabTechnology() {
  return (
    <section className="section relative isolate overflow-hidden bg-ink-900">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,.5) 0 1px, transparent 1px 34px)",
        }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <SectionHeader
          tone="dark"
          eyebrow="Instrumentation"
          title="What we run on"
          lede="The equipment and workflows behind the numbers, and what each one is actually for."
          action={
            <Link
              href="/services"
              className="hidden text-[13px] font-medium text-clinical-200 transition-colors hover:text-white sm:inline-flex"
            >
              All services →
            </Link>
          }
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech, idx) => (
            <article
              key={tech.title}
              className="group bg-ink-900 p-6 transition-colors duration-300 hover:bg-ink-800"
            >
              <TechIcon
                index={idx}
                className="h-10 w-10 text-clinical-200/70 transition-colors duration-300 group-hover:text-clinical-200"
              />

              <h3 className="mt-5 text-base font-semibold text-white">
                {tech.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-clinical-100/60">
                {tech.claim}
              </p>

              <ul className="mono mt-4 space-y-1.5 border-t border-white/10 pt-4 text-[11px] text-clinical-100/50">
                {tech.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-assay-600"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Link
          href="/services"
          className="btn mt-8 !border !border-white/25 !text-white hover:!border-white/60 hover:!bg-white/5 sm:hidden"
        >
          All services →
        </Link>
      </div>
    </section>
  );
}
