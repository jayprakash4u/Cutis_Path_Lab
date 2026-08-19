import { siteSettingsHandlers } from "@/lib/siteSettingsRoute";

const { GET: get, PUT: put } = siteSettingsHandlers({
  table: "SiteFooter",
  label: "Footer",
  columns: [
    "brandName",
    "tagline",
    "address",
    "phone",
    "email",
    "hours",
    "note",
    "facebookUrl",
    "instagramUrl",
    "whatsappUrl",
  ],
});

export const GET = get;
export const PUT = put;
