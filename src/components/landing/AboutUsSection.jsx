import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const credentials = [
  {
    body: "NABL accredited laboratory",
    standard: "NABL",
    tone: "chip-clinical",
    detail:
      "National Accreditation Board recognition for medical testing — validated quality systems and audited procedures.",
  },
  {
    body: "Medical laboratory competence",
    standard: "ISO 15189:2012",
    tone: "chip-assay",
    detail:
      "The international standard for calibration, method validation and consistency between runs.",
  },
  {
    body: "Pathology practice benchmark",
    standard: "CAP aligned",
    tone: "chip-bloom",
    detail:
      "Reporting and review follow College of American Pathologists practice, including mandatory second reads.",
  },
];

export default function AboutUsSection() {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Images */}
          <div className="grid grid-cols-5 grid-rows-5 gap-3 sm:gap-4">
            <div className="col-span-5 row-span-4 overflow-hidden rounded-lg sm:col-span-4">
              <Image
                src="/images/home/abouthomepage/pathlab1.jpg"
                alt="The Cutis Path Lab testing floor"
                width={900}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-3 row-span-1 hidden overflow-hidden rounded-lg sm:col-span-2 sm:block">
              <Image
                src="/images/home/abouthomepage/pathlab2.jpg"
                alt="Analyser bay at Cutis Path Lab"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="band-deep col-span-2 row-span-1 hidden items-center rounded-lg p-4 sm:col-span-3 sm:flex">
              <div>
                <p className="mono text-2xl font-semibold leading-none text-assay-400">
                  15+
                </p>
                <p className="label mt-1.5 !text-clinical-300">
                  Technicians on staff
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <SectionHeader
              eyebrow="About the lab"
              title="Accredited, and audited on it"
              lede="Cutis Path Lab runs haematology, biochemistry, microbiology and molecular testing from a single site in Mid-Baneshwor. Every method we offer is one we are certified to perform."
            />

            <ul className="mt-9 space-y-px overflow-hidden rounded-lg border border-line bg-line">
              {credentials.map((c) => (
                <li key={c.standard} className="bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <span className={c.tone}>{c.standard}</span>
                    <span className="sec-rule" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-[0.9375rem] font-semibold text-ink-900">
                    {c.body}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                    {c.detail}
                  </p>
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn-outline mt-6">
              More about how we work
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
