"use client";

/**
 * Resolves which icon to show for a test.
 * Priority:
 * 1) uploaded iconUrl (png/svg file) — for admin-added tests later
 * 2) exact name match in testList SVG components
 * 3) fuzzy name match
 * 4) category default SVG
 * 5) global default SVG
 */
import {
  testList,
  CBCIcon,
  ThyroidPanelIcon,
  HIVIcon,
  BloodCultureIcon,
  HistopathologyIcon,
  LipidProfileIcon,
} from "@/data/testIcons";

const CATEGORY_DEFAULT_ICONS = {
  Hematology: CBCIcon,
  Biochemistry: LipidProfileIcon,
  Hormone: ThyroidPanelIcon,
  Immunology: HIVIcon,
  Microbiology: BloodCultureIcon,
  Pathology: HistopathologyIcon,
};

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreMatch(testName, iconName) {
  const a = normalize(testName);
  const b = normalize(iconName);
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) return 80;

  const aWords = a.split(" ").filter(Boolean);
  const bWords = b.split(" ").filter(Boolean);
  const overlap = aWords.filter((w) => bWords.includes(w)).length;
  if (overlap === 0) return 0;
  return Math.round((overlap / Math.max(aWords.length, bWords.length)) * 60);
}

export function resolveTestIcon(test) {
  if (test?.iconUrl) {
    return { type: "image", src: test.iconUrl };
  }

  const exact = testList.find(
    (item) => normalize(item.text) === normalize(test?.name),
  );
  if (exact?.icon) {
    return { type: "component", Component: exact.icon };
  }

  let best = null;
  let bestScore = 0;
  for (const item of testList) {
    const score = scoreMatch(test?.name, item.text);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  if (best?.icon && bestScore >= 40) {
    return { type: "component", Component: best.icon };
  }

  const categoryIcon = CATEGORY_DEFAULT_ICONS[test?.category];
  if (categoryIcon) {
    return { type: "component", Component: categoryIcon };
  }

  return { type: "component", Component: CBCIcon };
}

export function TestIconView({ test, size = 36, className = "" }) {
  const resolved = resolveTestIcon(test);

  if (resolved.type === "image") {
    return (
      <img
        src={resolved.src}
        alt={test?.name || "Test icon"}
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  const Icon = resolved.Component;
  return <Icon size={size} className={className} />;
}
