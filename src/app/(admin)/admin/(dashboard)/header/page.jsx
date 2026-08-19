"use client";

import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

const GROUPS = [
  {
    title: "Strip content",
    subtitle: "Left-hand side of the blue bar. Clear a field to drop it.",
    fields: [
      {
        name: "brandName",
        label: "Business name",
        placeholder: "Cutis Path Lab",
        hint: "Beside the building icon.",
      },
      {
        name: "region",
        label: "Region",
        placeholder: "Kathmandu, Bagmati, Nepal",
        hint: "Beside the map pin.",
      },
      {
        name: "phone",
        label: "Phone",
        placeholder: "+977 986-1848382",
        hint: "The tap-to-call link, shown at every width.",
      },
      { name: "email", label: "Email", placeholder: "info@cutispathlab.com" },
    ],
  },
  {
    title: "Social icons",
    subtitle: "Right-hand side of the bar. A blank field hides that icon.",
    fields: [
      { name: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/…" },
      { name: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/…" },
      { name: "xUrl", label: "X (Twitter) URL", placeholder: "https://x.com/…" },
      { name: "whatsappUrl", label: "WhatsApp link", placeholder: "https://wa.me/9779861848382" },
    ],
  },
];

export default function AdminHeaderPage() {
  return (
    <SiteSettingsForm
      endpoint="/api/site-header"
      eyebrow="Site chrome"
      title="Top header"
      description="The blue strip above the menu, on every page. Separate from the footer and the contact page — these values are used here only."
      groups={GROUPS}
      toggle={{
        name: "isActive",
        title: "Visibility",
        label: "Show the strip above the menu",
      }}
    />
  );
}
