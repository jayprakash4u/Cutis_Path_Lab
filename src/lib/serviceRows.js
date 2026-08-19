import { toBool } from "@/lib/mysql";

/** Columns the services API reads. Kept in one place so both routes agree. */
export const SERVICE_COLUMNS = `\`id\`, \`name\`, \`description\`, \`longDescription\`, \`category\`,
       \`iconKey\`, \`imageUrl\`, \`isActive\`, \`sortOrder\``;

/** DB row → API shape. The icon resolver reads `icon`, so expose it under both names. */
export function normalizeService(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription,
    category: row.category,
    icon: row.iconKey,
    iconKey: row.iconKey,
    image: row.imageUrl,
    imageUrl: row.imageUrl,
    isActive: toBool(row.isActive),
    sortOrder: row.sortOrder,
  };
}
