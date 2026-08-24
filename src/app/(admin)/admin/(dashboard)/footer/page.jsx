"use client";

import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

const GROUPS = [
  {
    title: "Intro",
    subtitle: "The block beside the footer logo, and the copyright line.",
    fields: [
      {
        name: "brandName",
        label: "Business name",
        placeholder: "Cutis Path Lab",
        hint: "Used in the copyright line.",
      },
      {
        name: "note",
        label: "Footer note",
        placeholder: "Pathology lab · Kathmandu, Nepal",
        hint: "Small line opposite the copyright.",
      },
      {
        name: "tagline",
        label: "Tagline",
        placeholder: "Accurate diagnostics, clear reports…",
        multiline: true,
        wide: true,
      },
    ],
  },
  {
    title: "Visit & contact",
    subtitle: "The right-hand column. Clear a field to drop that line.",
    fields: [
      {
        name: "address",
        label: "Address",
        placeholder: "Mid-Baneshwor, Opposite to Ratna Rajya School, Kathmandu",
        wide: true,
      },
      { name: "phone", label: "Phone", placeholder: "+977 986-1848382" },
      { name: "email", label: "Email", placeholder: "info@cutispathlab.com" },
      {
        name: "hours",
        label: "Opening hours",
        placeholder: "Sat – Thu · 10:00 – 18:00",
        wide: true,
      },
    ],
  },
  {
    title: "Social icons",
    subtitle: "A blank field hides that icon.",
    fields: [
      { name: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/…" },
      { name: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/…" },
      { name: "whatsappUrl", label: "WhatsApp link", placeholder: "https://wa.me/9779861848382" },
      { name: "tiktokUrl", label: "TikTok URL", placeholder: "https://tiktok.com/@…" },
    ],
  },
];

export default function AdminFooterPage() {
  return (
    <SiteSettingsForm
      endpoint="/api/site-footer"
      eyebrow="Site chrome"
      title="Footer"
      description="The dark footer on every page. Separate from the header and the contact page — these values are used here only. The Explore and Company link lists follow the site's own pages and stay in code."
      groups={GROUPS}
    />
  );
}
