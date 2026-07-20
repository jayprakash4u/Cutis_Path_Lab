/**
 * Link disease categories to relevant tests by name match.
 * Prerequisites: Category + Test rows exist.
 * Run: node scripts/seed-category-tests.mjs
 */
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const SERVER = process.env.SQLSERVER_HOST || "localhost\\SQLEXPRESS";
const DATABASE = process.env.SQLSERVER_DATABASE || "CutisPathLab";

function esc(value) {
  if (value == null) return "NULL";
  return `N'${String(value).replace(/'/g, "''")}'`;
}

/** Disease slug → name patterns (case-insensitive LIKE) */
const DISEASE_PATTERNS = {
  anemia: ["%CBC%", "%Hemoglobin%", "%Iron%", "%Ferritin%", "%RBC%", "%Peripheral Blood%", "%Platelet%"],
  diabetes: ["%Glucose%", "%HbA1c%", "%Insulin%", "%Sugar%", "%A1C%"],
  heart: ["%Lipid%", "%Cholesterol%", "%D-Dimer%", "%Troponin%", "%ECG%", "%Creatine Kinase%"],
  thyroid: ["%Thyroid%", "%TSH%", "%T3%", "%T4%"],
  kidney: ["%Kidney%", "%Creatinine%", "%BUN%", "%Urea%", "%Urinalysis%", "%Urine%", "%Uric Acid%", "%Electrolyte%"],
  liver: ["%Liver%", "%Bilirubin%", "%ALT%", "%AST%", "%ALP%", "%GGT%", "%Albumin%", "%Alanine%", "%Aspartate%", "%Alkaline Phosphatase%", "%Gamma-Glutamyl%"],
  bone: ["%Vitamin D%", "%Calcium%", "%Bone Marrow%", "%Alkaline Phosphatase%"],
  fever: ["%Dengue%", "%Malaria%", "%Typhoid%", "%ESR%", "%WBC%", "%Blood Culture%", "%CRP%", "%Fever%"],
  cancer: ["%PSA%", "%Pap Smear%", "%Histopathology%", "%Cytopathology%", "%Immunohistochemistry%", "%Flow Cytometry%", "%Molecular Pathology%", "%Prostate%"],
  "gut-health": ["%Stool%", "%Occult%", "%Helicobacter%", "%Gut%"],
};

async function sqlJson(query) {
  const outFile = path.join(tmpdir(), `cat-tests-json-${randomUUID()}.txt`);
  const sqlFile = path.join(tmpdir(), `cat-tests-sql-${randomUUID()}.sql`);
  const wrapped = `
SET NOCOUNT ON;
DECLARE @json NVARCHAR(MAX);
SET @json = (${query});
SELECT ISNULL(@json, N'[]');
`;
  try {
    await writeFile(sqlFile, wrapped, "utf8");
    await execFileAsync(
      "sqlcmd",
      ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-y", "0", "-i", sqlFile, "-o", outFile],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    const { readFile } = await import("fs/promises");
    const raw = await readFile(outFile, "utf8");
    const text = raw
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "NULL" && !/^-+$/.test(l))
      .join("");
    const start = text.indexOf("[");
    if (start < 0) return [];
    return JSON.parse(text.slice(start));
  } finally {
    await unlink(sqlFile).catch(() => {});
    await unlink(outFile).catch(() => {});
  }
}

async function main() {
  const categories = await sqlJson(`
    SELECT id, slug FROM dbo.Category FOR JSON PATH
  `);
  const tests = await sqlJson(`
    SELECT id, name FROM dbo.Test FOR JSON PATH
  `);

  if (!categories.length) throw new Error("No categories found. Run db:seed-home first.");
  if (!tests.length) throw new Error("No tests found. Run db:seed-tests first.");

  const lines = ["SET NOCOUNT ON;", "DELETE FROM dbo.CategoryTest;", ""];
  let linkCount = 0;

  for (const cat of categories) {
    const patterns = DISEASE_PATTERNS[cat.slug] || [];
    if (!patterns.length) continue;

    const matched = tests.filter((t) => {
      const name = String(t.name || "");
      return patterns.some((p) => {
        const needle = p.replace(/%/g, "").toLowerCase();
        return name.toLowerCase().includes(needle);
      });
    });

    matched.forEach((t, i) => {
      lines.push(
        `INSERT INTO dbo.CategoryTest (categoryId, testId, sortOrder) VALUES (${esc(cat.id)}, ${esc(t.id)}, ${i});`,
      );
      linkCount += 1;
    });
  }

  lines.push("SELECT COUNT(*) AS linked FROM dbo.CategoryTest;");

  const sqlFile = path.join(tmpdir(), `seed-category-tests-${randomUUID()}.sql`);
  await writeFile(sqlFile, lines.join("\n"), "utf8");

  try {
    const { stdout, stderr } = await execFileAsync(
      "sqlcmd",
      ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-b", "-i", sqlFile],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    if (stderr?.trim()) console.error(stderr);
    console.log(stdout);
    console.log(`Linked ${linkCount} category↔test rows across ${categories.length} diseases.`);
  } finally {
    await unlink(sqlFile).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
