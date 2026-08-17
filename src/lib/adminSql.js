import { newId, sqlOne, sqlTransaction } from "@/lib/mysql";

/** MySQL stores booleans as TINYINT(1). */
export function toBit(value) {
  return value ? 1 : 0;
}

export function toNumOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function toIntOr(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/**
 * Build a parameterized `SET` clause from an allowlisted column→value map.
 * Callers pass only column names they control, never user input.
 */
export function buildUpdate(fields) {
  const columns = Object.keys(fields);
  return {
    clause: columns.map((c) => `\`${c}\` = ?`).join(", "),
    params: columns.map((c) => fields[c]),
    count: columns.length,
  };
}

export function parseIncludes(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return { testName: item.trim(), testId: null, sortOrder: index };
      }
      return {
        testName: String(item.testName || item.name || "").trim(),
        testId: item.testId ? String(item.testId).trim() : null,
        sortOrder: Number.isFinite(Number(item.sortOrder))
          ? Number(item.sortOrder)
          : index,
      };
    })
    .filter((item) => item.testName);
}

/** Replace a package's included tests atomically. */
export async function replacePackageIncludes(packageId, includes) {
  const items = parseIncludes(includes);

  await sqlTransaction(async (tx) => {
    await tx.exec("DELETE FROM `PackageTest` WHERE `packageId` = ?", [packageId]);
    for (const item of items) {
      await tx.exec(
        "INSERT INTO `PackageTest` (`id`, `packageId`, `testId`, `testName`, `sortOrder`) VALUES (?, ?, ?, ?, ?)",
        [newId(), packageId, item.testId, item.testName, item.sortOrder],
      );
    }
  });
}

/** True when a row with the given id exists. `table` is caller-controlled, never user input. */
export async function rowExists(table, id) {
  const row = await sqlOne(`SELECT 1 AS found FROM \`${table}\` WHERE \`id\` = ? LIMIT 1`, [id]);
  return row != null;
}
