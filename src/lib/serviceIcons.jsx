import {
  BloodTestsIcon,
  UrineTestsIcon,
  StoolTestsIcon,
  ClinicalBiochemistryIcon,
  MicrobiologyTestsIcon,
  HistopathologyIcon,
  CytologyIcon,
  HormoneTestingIcon,
  DiabetesTestingIcon,
  ThyroidTestingIcon,
  LipidProfileIcon,
  LiverFunctionIcon,
  KidneyFunctionIcon,
  VitaminTestsIcon,
  AllergyTestingIcon,
  CancerMarkerIcon,
  GeneticTestingIcon,
  PreventiveHealthIcon,
  FullBodyCheckupIcon,
  HomeSampleCollectionIcon,
} from "@/data/icons/PathologyIcons.jsx";

const ICON_BY_KEYWORD = [
  { match: ["urine"], Icon: UrineTestsIcon },
  { match: ["stool", "fecal"], Icon: StoolTestsIcon },
  { match: ["histo"], Icon: HistopathologyIcon },
  { match: ["cyto"], Icon: CytologyIcon },
  { match: ["microbio", "microbe", "infection"], Icon: MicrobiologyTestsIcon },
  { match: ["hormon", "infertil", "thyroid"], Icon: HormoneTestingIcon },
  { match: ["diabet", "sugar"], Icon: DiabetesTestingIcon },
  { match: ["lipid", "cholester"], Icon: LipidProfileIcon },
  { match: ["liver"], Icon: LiverFunctionIcon },
  { match: ["kidney", "renal", "electrolyte"], Icon: KidneyFunctionIcon },
  { match: ["vitamin"], Icon: VitaminTestsIcon },
  { match: ["allerg"], Icon: AllergyTestingIcon },
  { match: ["cancer", "tumor", "marker", "ihc", "immunohisto"], Icon: CancerMarkerIcon },
  {
    match: ["gene", "dna", "molecular", "cytogen", "newborn", "maternal", "microarray"],
    Icon: GeneticTestingIcon,
  },
  { match: ["blood", "coagulat", "serolog", "immuno", "flow", "bone marrow"], Icon: BloodTestsIcon },
  { match: ["chemic", "biochem", "tdm", "drug"], Icon: ClinicalBiochemistryIcon },
  { match: ["prevent", "checkup", "routine"], Icon: PreventiveHealthIcon },
  { match: ["full body"], Icon: FullBodyCheckupIcon },
  { match: ["home"], Icon: HomeSampleCollectionIcon },
  { match: ["thyroid"], Icon: ThyroidTestingIcon },
];

export function resolveServiceIcon(service) {
  const haystack = `${service?.name || ""} ${service?.icon || ""}`.toLowerCase();
  for (const entry of ICON_BY_KEYWORD) {
    if (entry.match.some((k) => haystack.includes(k))) return entry.Icon;
  }
  return GeneticTestingIcon;
}

export function shortServiceDescription(text, max = 72) {
  const clean = String(text || "").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
