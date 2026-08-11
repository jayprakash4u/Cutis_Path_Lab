import SectionHeader from "@/components/ui/SectionHeader";

const preparation = [
  {
    title: "Fast beforehand",
    tone: "clinical",
    window: "8–12 h",
    detail:
      "For lipid, glucose and liver panels, stop eating the evening before. Plain water is fine and encouraged.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Drink water",
    tone: "assay",
    window: "1–2 glasses",
    detail:
      "Hydrated veins are easier to draw from. It shortens the appointment and reduces bruising.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 3.5s6 6.6 6 10.3a6 6 0 11-12 0C6 10.1 12 3.5 12 3.5z"
      />
    ),
  },
  {
    title: "Skip alcohol",
    tone: "flag",
    window: "24 h before",
    detail:
      "Alcohol shifts liver enzymes and triglycerides enough to change how a result reads.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M7 4h10l-4 8v7m-3 0h6M5.5 5.5l13 13"
      />
    ),
  },
];

export default function HealthTips() {
  return (
    <section className="section-tight bg-paper">
      <div className="shell">
        <SectionHeader
          eyebrow="Before you come in"
          title="How to prepare"
          lede="Three things that keep a result clean. If you are unsure whether they apply to your test, call the lab and ask."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {preparation.map((p) => (
            <div
              key={p.title}
              className="card card-hover overflow-hidden p-5 sm:p-6"
              style={{
                borderTopColor: `var(--${p.tone}-600)`,
                borderTopWidth: "3px",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${
                    p.tone === "assay"
                      ? "bg-assay-100 text-assay-700"
                      : p.tone === "flag"
                        ? "bg-flag-100 text-flag-700"
                        : "bg-clinical-100 text-clinical-700"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </svg>
                </span>
                <span
                  className={
                    p.tone === "assay"
                      ? "chip-assay"
                      : p.tone === "flag"
                        ? "chip-flag"
                        : "chip-clinical"
                  }
                >
                  {p.window}
                </span>
              </div>

              <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink-900">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
