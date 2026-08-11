import Link from "next/link";
import Image from "next/image";

const heroImage = {
  url: "/images/banners/hero-main.png",
  alt: "",
  width: 6400,
  height: 1428,
};

const accreditations = ["NABL accredited", "ISO 15189:2012", "Open 365 days"];

const promises = [
  { k: "Turnaround", v: "24 hours" },
  { k: "Collection", v: "At your door" },
  { k: "Delivery", v: "WhatsApp or email" },
];

/**
 * A single line off a finished report, rendered the way the lab renders it.
 * It is the most characteristic thing this business produces, so it opens
 * the page — and it doubles as an explanation of what a patient receives.
 */
function SpecimenCard() {
  const low = 13.0;
  const high = 17.0;
  const value = 14.2;
  const position = ((value - low) / (high - low)) * 100;

  return (
    <figure className="rise [animation-delay:320ms] w-full max-w-md rounded-lg bg-surface shadow-3 lg:justify-self-end">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="label !text-ink-500">
          Specimen{" "}
          <span className="mono text-[11px] font-medium tracking-normal text-ink-800">
            CPL-4471-08
          </span>
        </p>
        <span className="chip-assay">
          <span className="h-1.5 w-1.5 rounded-full bg-assay-600" aria-hidden="true" />
          Verified
        </span>
      </div>

      <div className="px-5 py-5">
        <p className="text-sm font-semibold text-ink-800">Haemoglobin</p>

        <p className="mt-1 flex items-baseline gap-1.5">
          <span className="mono text-[2.5rem] font-semibold leading-none text-ink-900">
            14.2
          </span>
          <span className="mono text-xs text-ink-400">g/dL</span>
        </p>

        {/* The reference interval, drawn. */}
        <div className="mt-6">
          <div className="relative h-1.5">
            <span className="absolute inset-0 rounded-full bg-surface-sunk" />
            <span className="trace absolute inset-y-0 left-0 right-0 rounded-full bg-assay-100" />
            <span
              className="assay-settle absolute top-1/2 h-3.5 w-3.5 rounded-full border-2 border-surface bg-assay-600 shadow-1"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="mono text-[11px] text-ink-400">{low.toFixed(1)}</span>
            <span className="label">Reference interval</span>
            <span className="mono text-[11px] text-ink-400">{high.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-lg border-t border-line bg-line">
        <div className="bg-surface px-5 py-3">
          <p className="label">Collected</p>
          <p className="mono mt-0.5 text-xs text-ink-700">07:20</p>
        </div>
        <div className="bg-surface px-5 py-3">
          <p className="label">Reported</p>
          <p className="mono mt-0.5 text-xs text-ink-700">13:05</p>
        </div>
      </div>
    </figure>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900">
      <Image
        src={heroImage.url}
        alt={heroImage.alt}
        width={heroImage.width}
        height={heroImage.height}
        priority
        unoptimized
        sizes="100vw"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/95 to-ink-900/75"
        aria-hidden="true"
      />
      {/* Faint ruling, like report stock */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,.5) 0 1px, transparent 1px 34px)",
        }}
        aria-hidden="true"
      />

      <div className="shell relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="rise eyebrow !text-clinical-200">
            Cutis Path Lab · Mid-Baneshwor, Kathmandu
          </p>

          <h1 className="rise [animation-delay:80ms] mt-4 max-w-[16ch] text-[2.125rem] font-bold leading-[1.05] text-white sm:text-[2.75rem] lg:text-[3.5rem]">
            Results your doctor can act on.
          </h1>

          <p className="rise [animation-delay:150ms] mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-clinical-100/75 sm:text-base">
            Pathology, haematology and molecular testing under one roof. We
            collect at your door and send the report back within 24 hours.
          </p>

          <div className="rise [animation-delay:220ms] mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="btn-primary !bg-white !px-6 !py-3 !text-ink-900 hover:!bg-clinical-100"
            >
              Book a test
            </Link>
            <Link
              href="/tests"
              className="btn !border !border-white/25 !px-6 !py-3 !text-white hover:!border-white/60 hover:!bg-white/5"
            >
              Browse all tests
            </Link>
          </div>

          <dl className="rise [animation-delay:290ms] mt-10 grid max-w-lg grid-cols-1 gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-3">
            {promises.map((p) => (
              <div key={p.k} className="bg-ink-900/60 px-4 py-3 backdrop-blur-sm">
                <dt className="label !text-clinical-200/70">{p.k}</dt>
                <dd className="mt-1 text-[13px] font-semibold text-white">
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="rise [animation-delay:360ms] mono mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-clinical-200/60">
            {accreditations.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span
                  className="h-1 w-1 rounded-full bg-assay-600"
                  aria-hidden="true"
                />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SpecimenCard />
          <p className="rise [animation-delay:420ms] ml-auto mt-4 max-w-md text-xs leading-relaxed text-clinical-100/55">
            Every result arrives like this — the value, its units, and the
            reference interval it sits in. No guesswork.
          </p>
        </div>
      </div>
    </section>
  );
}
