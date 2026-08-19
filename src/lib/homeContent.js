import { sqlQuery, toBool } from "@/lib/mysql";
import { HOME_SECTIONS } from "@/lib/homeSections";

/**
 * Server-side loader for the landing page.
 *
 * The home page is a server component, so it reads the section rows straight
 * from MySQL instead of round-tripping through /api — no request waterfall and
 * no loading flash on first paint.
 *
 * If the database is unreachable the page still renders: every section falls
 * back to the copy baked into its component, in the order listed in the
 * registry.
 */

const SECTION_COLUMNS = `\`sectionKey\`, \`label\`, \`title\`, \`highlight\`, \`subtitle\`,
       \`ctaLabel\`, \`ctaHref\`, \`isActive\`, \`sortOrder\``;

const ITEM_COLUMNS = `\`id\`, \`sectionKey\`, \`title\`, \`description\`, \`badge\`, \`note\`,
       \`iconKey\`, \`imageUrl\`, \`mobileImageUrl\`, \`linkUrl\`, \`isActive\`, \`sortOrder\``;

export function normalizeSection(row) {
  return {
    key: row.sectionKey,
    label: row.label,
    title: row.title,
    highlight: row.highlight,
    subtitle: row.subtitle,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    isActive: toBool(row.isActive),
    sortOrder: row.sortOrder,
  };
}

export function normalizeItem(row) {
  return {
    id: row.id,
    sectionKey: row.sectionKey,
    title: row.title,
    description: row.description,
    badge: row.badge,
    note: row.note,
    iconKey: row.iconKey,
    imageUrl: row.imageUrl,
    mobileImageUrl: row.mobileImageUrl,
    linkUrl: row.linkUrl,
    isActive: toBool(row.isActive),
    sortOrder: row.sortOrder,
  };
}

export { SECTION_COLUMNS, ITEM_COLUMNS };

/** The registry order, used when the table is empty or unreachable. */
function fallbackSections() {
  return HOME_SECTIONS.map((s, i) => ({
    key: s.key,
    label: s.label,
    title: null,
    highlight: null,
    subtitle: null,
    ctaLabel: null,
    ctaHref: null,
    isActive: true,
    sortOrder: i,
    items: [],
  }));
}

/**
 * Active sections in display order, each with its active items attached.
 * Never throws — a database outage degrades to the components' own copy.
 */
export async function getHomeSections({ activeOnly = true } = {}) {
  try {
    const where = activeOnly ? "WHERE `isActive` = 1" : "";
    const sections = await sqlQuery(
      `SELECT ${SECTION_COLUMNS} FROM \`HomeSection\` ${where} ORDER BY \`sortOrder\``,
    );
    if (sections.length === 0) return fallbackSections();

    const items = await sqlQuery(
      `SELECT ${ITEM_COLUMNS} FROM \`HomeSectionItem\` ${where} ORDER BY \`sortOrder\``,
    );

    const bySection = new Map();
    for (const row of items) {
      if (!bySection.has(row.sectionKey)) bySection.set(row.sectionKey, []);
      bySection.get(row.sectionKey).push(normalizeItem(row));
    }

    return sections.map((row) => ({
      ...normalizeSection(row),
      items: bySection.get(row.sectionKey) || [],
    }));
  } catch (error) {
    console.error("[home] falling back to built-in section copy:", error?.message || error);
    return fallbackSections();
  }
}
