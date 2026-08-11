import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * These are controls, not steps — so they are laid out as a grid of hairline
 * cells rather than a numbered sequence.
 */
const controls = [
  {
    title: "Pathologist review",
    desc: "Every abnormal result is read by a consultant pathologist before it leaves the lab.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    ),
  },
  {
    title: "Daily calibration",
    desc: "Analysers run internal quality controls each morning and are recalibrated against reference material.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 6V3m0 3a6 6 0 100 12 6 6 0 000-12zm0 12v3m6-9h3M3 12h3m11.657-5.657l2.122-2.122M4.221 19.779l2.122-2.122m0-11.314L4.221 4.221m15.558 15.558l-2.122-2.122"
      />
    ),
  },
  {
    title: "Tracked chain of custody",
    desc: "Barcodes are applied at collection and scanned at every handover, so no sample is ever unaccounted for.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M4 5v14M8 5v14M12 5v14M16 5v10M20 5v14"
      />
    ),
  },
  {
    title: "Accredited methods",
    desc: "Testing follows NABL and ISO 15189 protocols, with documented procedures for each assay.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
];

export default function Stats() {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <SectionHeader
          eyebrow="Quality control"
          title="What stands behind a number"
          lede="A result is only useful if it is reproducible. These are the four controls that make ours dependable."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
          <div className="relative hidden overflow-hidden rounded-lg sm:block">
            <Image
              src="/images/home/stats-image.jpg"
              alt="Technicians at work in the Cutis Path Lab processing area"
              width={880}
              height={1100}
              className="h-64 w-full object-cover lg:h-full"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="label !text-clinical-200/70">Processing floor</p>
              <p className="mt-1 text-sm font-semibold text-white">
                Mid-Baneshwor, Kathmandu
              </p>
            </div>
          </div>

          {/* Hairline grid — the report's ruling, used structurally */}
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {controls.map((c) => (
              <div key={c.title} className="bg-surface p-5 sm:p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-clinical-50 text-clinical-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {c.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink-900">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
