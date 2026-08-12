import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PagePosterHero from "@/components/sections/PagePosterHero";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata = {
  title: "About Us",
  description:
    "Cutis Path Lab — an accredited diagnostic laboratory in Mid-Baneshwor, Kathmandu.",
};

const figures = [
  { value: "15+", label: "Years operating" },
  { value: "500K+", label: "Tests reported" },
  { value: "50+", label: "Staff on site" },
  { value: "99.9%", label: "QC pass rate" },
];

const accreditations = [
  {
    code: "NABL",
    title: "NABL accredited",
    tone: "chip-clinical",
    desc: "National Accreditation Board for Testing and Calibration Laboratories — audited quality systems and documented methods.",
  },
  {
    code: "ISO 15189:2012",
    title: "Medical laboratory competence",
    tone: "chip-assay",
    desc: "The international requirement set for quality and competence in medical laboratories.",
  },
  {
    code: "CAP",
    title: "CAP-aligned practice",
    tone: "chip-bloom",
    desc: "Reporting and review benchmarked against College of American Pathologists standards.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="pt-below-nav pb-24 lg:pb-0">
        <PagePosterHero
          src="/images/about-poster.png"
          alt="Cutis Path Lab About Us"
          width={6667}
          height={579}
        />

        {/* Who we are */}
        <section className="section bg-paper">
          <div className="shell">
            <SectionHeader
              eyebrow="About the lab"
              title="A diagnostic laboratory in Mid-Baneshwor"
              lede="Cutis Path Lab runs haematology, biochemistry, microbiology, histopathology and molecular testing from a single site in Kathmandu. Every method we offer is one we are accredited to perform, and every abnormal result is read by a consultant before it is released."
            />

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
              {figures.map((f) => (
                <div key={f.label} className="bg-surface px-5 py-6">
                  <dt className="label">{f.label}</dt>
                  <dd className="mono mt-2 text-2xl font-semibold leading-none text-ink-900 lg:text-3xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Mission */}
        <section className="section-tight border-y border-line bg-surface">
          <div className="shell">
            <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
              <div className="order-2 overflow-hidden rounded-lg border border-line md:order-1">
                <Image
                  src="/images/mission-vision.png"
                  alt="Cutis Path Lab team at work"
                  width={900}
                  height={640}
                  className="h-auto w-full"
                />
              </div>

              <div className="order-1 md:order-2">
                <SectionHeader
                  eyebrow="Mission"
                  title="Results people can act on"
                  lede="To return accurate, timely diagnostics that let clinicians and patients decide what happens next — with the reference intervals printed alongside every value, so a report explains itself."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="section-tight bg-paper">
          <div className="shell">
            <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeader
                  eyebrow="Vision"
                  title="Accessible testing, without compromise"
                  lede="To be the laboratory clinicians across the valley default to — with advanced diagnostics available at a price ordinary households can meet, and quality that never depends on who is paying."
                />
              </div>

              <div className="overflow-hidden rounded-lg border border-line">
                <Image
                  src="/images/vision-image.png"
                  alt="Analysers in the Cutis Path Lab processing area"
                  width={900}
                  height={640}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Accreditation */}
        <section className="section border-t border-line bg-surface">
          <div className="shell">
            <SectionHeader
              eyebrow="Credentials"
              title="What we are audited against"
              lede="Accreditation is not a badge — it is a recurring inspection of methods, calibration records and staff competence."
            />

            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
              {accreditations.map((a) => (
                <div key={a.code} className="bg-surface p-6">
                  <span className={a.tone}>{a.code}</span>
                  <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink-900">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
