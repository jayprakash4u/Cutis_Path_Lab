import { escapeSql, newId, sqlExec } from "@/lib/sqlserver";

export function bit(value) {
  return value ? "1" : "0";
}

export function numOrNull(value) {
  if (value == null || value === "") return "NULL";
  const n = Number(value);
  if (!Number.isFinite(n)) return "NULL";
  return String(n);
}

export function intOr(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(fallback);
  return String(Math.trunc(n));
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

export async function replacePackageIncludes(packageId, includes) {
  const items = parseIncludes(includes);
  await sqlExec(`DELETE FROM dbo.PackageTest WHERE packageId = ${escapeSql(packageId)};`);
  for (const item of items) {
    await sqlExec(`
      INSERT INTO dbo.PackageTest (id, packageId, testId, testName, sortOrder)
      VALUES (
        ${escapeSql(newId())},
        ${escapeSql(packageId)},
        ${item.testId ? escapeSql(item.testId) : "NULL"},
        ${escapeSql(item.testName)},
        ${item.sortOrder}
      );
    `);
  }
}
