import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";

const steps = [
  {
    number: "01",
    color: "#FF6B6B",
    title: "Expert Team",
    desc: "Our team consists of highly skilled & experienced pathologists",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    )
  },
  {
    number: "02",
    color: "#FF6B6B",
    title: "Accurate Reports",
    desc: "We provide accurate and reliable test reports",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M12 2C9.24 2 7 4.24 7 7c0 2.08 1.23 3.87 3 4.72V20h4v-8.28A5.003 5.003 0 0017 7c0-2.76-2.24-5-5-5z"/>
      </svg>
    )
  },
  {
    number: "03",
    color: "#FF6B6B",
    title: "24/7 Support",
    desc: "We are available 24/7 for your support",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M9 13.5c-2.5 0-7.5 1.25-7.5 3.75V19h15v-1.75C16.5 14.75 11.5 13.5 9 13.5zm8-1c2.07 0 6.25.93 6.25 2.75V17h-5v-1.75c0-.92-.38-1.77-.99-2.42.56-.1 1.1-.33 1.74-.33zM9 12a3 3 0 100-6 3 3 0 000 6zm7.5-.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
      </svg>
    )
  },
  {
    number: "04",
    color: "#FF6B6B",
    title: "Quality Assurance",
    desc: "International quality standards with NABL accreditation",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#4a9aba" strokeWidth="1.5" fill="none"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#4a9aba" strokeWidth="1.5" fill="none"/>
      </svg>
    )
  }
];

export default function Stats() {
  return (
    <Section tone="white">
      <SectionHeading
        title="Why patients choose Cutis Path Lab"
        subtitle="Accredited processes, experienced people, and results you can act on."
      />

      <div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Image - Hidden on very small screens, visible on sm+ */}
          <div className="relative hidden h-48 overflow-hidden rounded-2xl shadow-card sm:block sm:h-64 lg:h-full lg:min-h-[420px]">
            <Image
              src="/images/home/stats-image.jpg"
              alt="Cutis Path Lab team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white sm:bottom-5 sm:left-5">
              <p className="text-sm font-semibold sm:text-base">Best pathology lab in town</p>
            </div>
          </div>

          {/* Cards - Stacked on mobile */}
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6B6B] text-sm font-bold text-white sm:text-base">
                  {s.number}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{s.desc}</p>
                </div>

                <div className="hidden shrink-0 sm:block">{s.icon(s.color)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}