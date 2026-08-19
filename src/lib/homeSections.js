/**
 * Registry of the landing-page sections.
 *
 * The DB holds the copy; this file says what each section is, what it lets an
 * editor change, and which icon keys its cards may use. Both the admin screens
 * and the home page read it, so it stays free of DB and server-only imports.
 */

/** Sections whose cards come from the catalog — only the heading is editable. */
const HEADING_ONLY = { hasItems: false };

export const HOME_SECTIONS = [
  {
    key: "hero",
    label: "Hero banner",
    description:
      "The rotating banner: headline, strapline, button, and the slides themselves.",
    fields: ["title", "highlight", "subtitle", "cta"],
    hasItems: true,
    itemLabel: "Slide",
    itemFields: ["title", "imageUrl", "mobileImageUrl"],
    itemLabels: {
      title: "Alt text",
      imageUrl: "Desktop image",
      mobileImageUrl: "Mobile image",
    },
    itemHints: {
      title: "Describes the artwork for screen readers.",
      imageUrl: "Wide artwork, around 3:1 — 2172×724 matches the current set.",
      mobileImageUrl:
        "Phone artwork, around 2:1 (1024×506). Without one, the desktop file is used and phones download the large file.",
    },
  },
  {
    key: "quickActions",
    label: "Quick actions",
    description: "The four shortcut cards directly under the hero.",
    fields: [],
    hasItems: true,
    itemLabel: "Action",
    itemFields: ["title", "description", "linkUrl", "iconKey"],
    icons: ["reports", "collection", "callback", "lab"],
  },
  {
    key: "offers",
    label: "Tests in offers",
    description: "Heading above the discounted-tests carousel. Cards come from Offers.",
    fields: ["title", "subtitle"],
    ...HEADING_ONLY,
  },
  {
    key: "stats",
    label: "Why choose us",
    description: "The numbered reasons beside the team photo.",
    fields: ["title", "subtitle"],
    hasItems: true,
    itemLabel: "Reason",
    itemFields: ["badge", "title", "description", "iconKey"],
    icons: ["team", "report", "support", "quality"],
  },
  {
    key: "diseaseCategories",
    label: "Disease categories",
    description: "The condition chips that link into the tests page.",
    fields: ["title", "subtitle"],
    hasItems: true,
    itemLabel: "Category",
    itemFields: ["title", "imageUrl", "linkUrl"],
  },
  {
    key: "bookTest",
    label: "Book a test",
    description: "Heading above the booking form band.",
    fields: ["title", "subtitle"],
    ...HEADING_ONLY,
  },
  {
    key: "popular",
    label: "Popular tests & packages",
    description: "Heading above the most-booked carousel. Cards come from Tests and Packages.",
    fields: ["title", "subtitle"],
    ...HEADING_ONLY,
  },
  {
    key: "healthTips",
    label: "Health tips",
    description: "Preparation advice shown before a visit.",
    fields: ["title", "subtitle"],
    hasItems: true,
    itemLabel: "Tip",
    itemFields: ["title", "description", "iconKey"],
    icons: ["fasting", "hydration", "alcohol"],
  },
  {
    key: "labTechnology",
    label: "Lab technology",
    description: "The technology carousel on the dark band.",
    fields: ["title", "subtitle"],
    hasItems: true,
    itemLabel: "Technology",
    itemFields: ["title", "badge", "note", "description", "iconKey"],
    icons: ["ai", "digital", "molecular", "automation", "pcr", "tracking"],
    itemHints: {
      badge: "Small blue label under the title",
      note: "Grey label after the dot",
      description: "One bullet per line",
    },
  },
  {
    key: "about",
    label: "About the lab",
    description: "The two-column band with the lab photos and highlights.",
    fields: ["title", "subtitle", "cta"],
    hasItems: true,
    itemLabel: "Highlight",
    itemFields: ["title", "description", "iconKey"],
    icons: ["tech", "people", "quality", "timely"],
  },
  {
    key: "referrals",
    label: "Referral network",
    description: "Heading above the referring-doctors carousel. Cards come from Referral network.",
    fields: ["title", "subtitle"],
    ...HEADING_ONLY,
  },
  {
    key: "testimonials",
    label: "Patient testimonials",
    description: "Heading above the reviews carousel. Cards come from Testimonials.",
    fields: ["title", "subtitle"],
    ...HEADING_ONLY,
  },
  {
    key: "team",
    label: "Our team",
    description:
      "The people band. It stays off the home page until you add members — no invented staff.",
    fields: ["title", "subtitle", "cta"],
    hasItems: true,
    itemLabel: "Member",
    itemFields: ["title", "badge", "note", "description", "imageUrl", "linkUrl"],
    itemLabels: {
      title: "Name",
      badge: "Role",
      note: "Qualification",
      description: "Short bio",
      imageUrl: "Photo URL",
      linkUrl: "Profile link",
    },
    itemHints: {
      badge: "Consultant Pathologist, Lab Manager …",
      imageUrl: "Portrait crop works best; initials show while it is empty",
      linkUrl: "Optional — makes the whole card a link",
    },
  },
];

export const HOME_SECTION_KEYS = HOME_SECTIONS.map((s) => s.key);

export function getHomeSection(key) {
  return HOME_SECTIONS.find((s) => s.key === key) || null;
}

/** Turns a stored multi-line description into the bullet list a card renders. */
export function toLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
