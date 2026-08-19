import Link from "next/link";
import { Section } from "@/components/ui/Section";

const SKY = "#0284C7";
const CORAL = "#FF6B6B";

/**
 * Purpose-drawn icons on a shared 48px grid, matching the site's two-tone
 * language: sky line work with coral picking out the one detail that names the
 * action (the download, the sample box, the ring, the flask).
 *
 * Common geometry so the set reads as a family: 2px primary strokes, 1.8px
 * secondary, round caps and joins throughout.
 */
const ICON_ORDER = ["reports", "collection", "callback", "lab"];

function QuickIcon({ iconKey, index }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: "h-full w-full",
  };

  const icons = [
    // 1 — Reports: a results sheet with a bar chart, coral download badge
    <svg key="reports" {...common}>
      <path
        d="M10 4h14l8 8v26a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke={SKY}
        strokeWidth="2"
      />
      <path d="M24 4v8h8" stroke={SKY} strokeWidth="2" />
      <path d="M14 31v-5M20 31v-10M26 31v-3" stroke={SKY} strokeWidth="2" />
      <circle cx="36" cy="35" r="8" fill="#fff" stroke={CORAL} strokeWidth="2" />
      <path d="M36 31v7m0 0 3-3m-3 3-3-3" stroke={CORAL} strokeWidth="2" />
    </svg>,

    // 2 — Home collection: scooter with a coral sample box
    <svg key="collection" {...common}>
      <circle cx="13" cy="35" r="6" stroke={SKY} strokeWidth="2" />
      <circle cx="37" cy="35" r="6" stroke={SKY} strokeWidth="2" />
      <path d="M19 35h12" stroke={SKY} strokeWidth="2" />
      <path d="M31 35l5-12" stroke={SKY} strokeWidth="2" />
      <path d="M33 23h8" stroke={SKY} strokeWidth="2" />
      <path d="M14 29v-3" stroke={SKY} strokeWidth="1.8" />
      <rect x="7" y="14" width="15" height="12" rx="2" stroke={CORAL} strokeWidth="2" />
      <path d="M14.5 17.5v5M12 20h5" stroke={CORAL} strokeWidth="2" />
    </svg>,

    // 3 — Call back: handset with coral signal arcs
    <svg key="callback" {...common}>
      <path
        d="M15 10c-2.2 0-4 1.8-4 4 0 12.7 10.3 23 23 23 2.2 0 4-1.8 4-4v-3.6a2 2 0 0 0-1.7-2l-5.2-.9a2 2 0 0 0-2 .9l-1.5 2.4a20.6 20.6 0 0 1-9.3-9.3l2.4-1.5a2 2 0 0 0 .9-2l-.9-5.2a2 2 0 0 0-2-1.7H15Z"
        stroke={SKY}
        strokeWidth="2"
      />
      <path d="M30 5a12 12 0 0 1 12 12" stroke={CORAL} strokeWidth="2" />
      <path d="M30 12a5.5 5.5 0 0 1 5.5 5.5" stroke={CORAL} strokeWidth="2" />
    </svg>,

    // 4 — Nearest lab: location pin holding a coral specimen flask
    <svg key="lab" {...common}>
      <path
        d="M24 43c0 0 13-11.4 13-20a13 13 0 1 0-26 0c0 8.6 13 20 13 20Z"
        stroke={SKY}
        strokeWidth="2"
      />
      <path d="M20.5 13h7" stroke={CORAL} strokeWidth="2" />
      <path
        d="M22 13v5.5l-4.2 7.2A2 2 0 0 0 19.5 29h9a2 2 0 0 0 1.7-3.3L26 18.5V13"
        stroke={CORAL}
        strokeWidth="2"
      />
      <path d="M19.8 24.5h8.4" stroke={CORAL} strokeWidth="1.8" />
    </svg>,
  ];

  // Rows carry an icon key; anything unrecognised falls back to position.
  const byKey = ICON_ORDER.indexOf(iconKey);
  return icons[byKey >= 0 ? byKey : index] ?? icons[0];
}

/* Shown when the section has no rows — an empty table must not blank the page. */
const DEFAULT_ACTIONS = [
  {
    title: "Download Your Reports",
    description: "Your health records are available with us — click here to download.",
    // No reports portal exists yet; reports currently go out over WhatsApp/Gmail.
    linkUrl: "/contact",
    iconKey: "reports",
  },
  {
    title: "Book Home Sample Collection",
    description: "We're at your doorstep within the time frame, with aseptic precautions.",
    linkUrl: "#book-test",
    iconKey: "collection",
  },
  {
    title: "Request A Call Back",
    description: "Our customer support team will get in touch with you soon.",
    linkUrl: "/contact",
    iconKey: "callback",
  },
  {
    title: "Find Nearest Lab",
    description: "We're available at your nearest location — click here to find us.",
    linkUrl: "/contact",
    iconKey: "lab",
  },
];

/**
 * Quick-action strip directly beneath the hero. Deliberately has no
 * SectionHeading — it is a navigation shortcut row, not a content section, so a
 * headline above it would compete with the hero.
 */
export default function QuickActions({ items }) {
  const actions = items?.length ? items : DEFAULT_ACTIONS;

  return (
    <Section tone="white" size="compact">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, idx) => (
          <li key={action.id || action.title}>
            <Link
              href={action.linkUrl || "/contact"}
              className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6B6B] hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:p-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#FF6B6B] bg-white p-2 transition-colors duration-300 group-hover:bg-[#FF6B6B]/5">
                <QuickIcon iconKey={action.iconKey} index={idx} />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-slate-900">
                  {action.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-sky-600">
                  {action.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
