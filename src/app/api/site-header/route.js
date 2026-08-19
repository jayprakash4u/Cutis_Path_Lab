import { siteSettingsHandlers } from "@/lib/siteSettingsRoute";

const { GET: get, PUT: put } = siteSettingsHandlers({
  table: "SiteHeader",
  label: "Header",
  columns: [
    "brandName",
    "region",
    "phone",
    "email",
    "facebookUrl",
    "instagramUrl",
    "xUrl",
    "whatsappUrl",
  ],
  flags: ["isActive"],
});

export const GET = get;
export const PUT = put;
