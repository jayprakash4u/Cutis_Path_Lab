const TONES = ["clinical", "assay", "bloom", "flag"];

/** Stable colour assigned to a category name, so the same category
 *  (e.g. "Hematology") always reads the same accent across every page. */
export function categoryTone(category) {
  const str = String(category || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return TONES[hash % TONES.length];
}

export function categoryChipClass(category) {
  return `chip-${categoryTone(category)}`;
}
