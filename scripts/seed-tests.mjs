/**
 * Seed all tests from src/data/staticData.js into CutisPathLab.dbo.Test
 * Run: node scripts/seed-tests.mjs
 */
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { tests } from "../src/data/staticData.js";

const execFileAsync = promisify(execFile);
const SERVER = process.env.SQLSERVER_HOST || "localhost\\SQLEXPRESS";
const DATABASE = process.env.SQLSERVER_DATABASE || "CutisPathLab";

function esc(value) {
  if (value == null) return "NULL";
  return `N'${String(value).replace(/'/g, "''")}'`;
}

function bit(value) {
  return value ? "1" : "0";
}

function num(value) {
  if (value == null || value === "") return "NULL";
  return String(Number(value));
}

async function main() {
  if (!Array.isArray(tests) || tests.length === 0) {
    throw new Error("No tests found in staticData.js");
  }

  const lines = [
    "SET NOCOUNT ON;",
    "-- Clear existing tests (bookings keep testId nullable; clear FK refs first)",
    "IF OBJECT_ID('dbo.CategoryTest', 'U') IS NOT NULL DELETE FROM dbo.CategoryTest;",
    "UPDATE dbo.Booking SET testId = NULL WHERE testId IS NOT NULL;",
    "UPDATE dbo.PackageTest SET testId = NULL WHERE testId IS NOT NULL;",
    "DELETE FROM dbo.Test;",
    "",
  ];

  for (const test of tests) {
    const id = String(test.id);
    lines.push(`
IF NOT EXISTS (SELECT 1 FROM dbo.Test WHERE code = ${esc(id)})
INSERT INTO dbo.Test
  (id, code, name, category, price, originalPrice, description, sampleType, fastingRequired, reportTime, parameters, popular)
VALUES
  (${esc(id)}, ${esc(id)}, ${esc(test.name)}, ${esc(test.category)},
   ${num(test.price)}, ${num(test.originalPrice)}, ${esc(test.description)},
   ${esc(test.sampleType)}, ${bit(test.fastingRequired)}, ${esc(test.reportTime)},
   ${num(test.parameters)}, ${bit(test.popular)});
`.trim());
  }

  lines.push("");
  lines.push("SELECT COUNT(*) AS totalTests FROM dbo.Test;");
  lines.push("SELECT category, COUNT(*) AS cnt FROM dbo.Test GROUP BY category ORDER BY category;");

  const sqlFile = path.join(tmpdir(), `cutis-seed-tests.sql`);
  await writeFile(sqlFile, lines.join("\n"), "utf8");

  console.log(`Seeding ${tests.length} tests into ${DATABASE}...`);

  const { stdout, stderr } = await execFileAsync(
    "sqlcmd",
    ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-b", "-i", sqlFile],
    { maxBuffer: 10 * 1024 * 1024 },
  );

  if (stderr && stderr.trim()) {
    console.error(stderr);
  }
  console.log(stdout);
  await unlink(sqlFile).catch(() => {});
  console.log("Done. All tests from the Tests page are now in the database.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
