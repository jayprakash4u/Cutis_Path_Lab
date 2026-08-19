/**
 * Service categories drive the filter chips on /services and the admin form.
 * `category` is a real column now, but rows created before it existed (or left
 * blank) still resolve by name so nothing falls out of the filters.
 */
export const SERVICE_CATEGORIES = [
  { id: "genetics", name: "Genetics" },
  { id: "pathology", name: "Pathology" },
  { id: "imaging", name: "Imaging" },
  { id: "health", name: "Health Check" },
];

const CATEGORY_KEYWORDS = {
  genetics: ["gene", "dna", "maternal", "newborn", "molecular", "cytogen", "microarray"],
  pathology: [
    "pathology",
    "histo",
    "cyto",
    "blood",
    "urine",
    "microbio",
    "serolog",
    "immuno",
    "coagulat",
    "chemic",
    "marker",
    "allergy",
    "bone marrow",
    "flow",
  ],
  imaging: ["x-ray", "scan", "ultrasound", "mri"],
};

const VALID = new Set(SERVICE_CATEGORIES.map((c) => c.id));

export function resolveServiceCategory(service) {
  const stored = String(service?.category || "").trim().toLowerCase();
  if (VALID.has(stored)) return stored;

  const name = String(service?.name || "").toLowerCase();
  for (const [id, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => name.includes(keyword))) return id;
  }
  return "health";
}

export function serviceCategoryLabel(id) {
  return SERVICE_CATEGORIES.find((c) => c.id === id)?.name || "Health Check";
}
