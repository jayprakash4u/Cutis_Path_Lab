/**
 * Seed packages + included tests into CutisPathLab.
 * Run: node scripts/seed-packages.mjs
 */
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const SERVER = process.env.SQLSERVER_HOST || "localhost\\SQLEXPRESS";
const DATABASE = process.env.SQLSERVER_DATABASE || "CutisPathLab";

const PACKAGE_IMAGES = {
  1: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  2: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
  3: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=600&h=400&fit=crop",
  4: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
  5: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=600&h=400&fit=crop",
  6: "https://images.unsplash.com/photo-1581093458791-9d3a7c86d86f?w=600&h=400&fit=crop",
  7: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&h=400&fit=crop",
  8: "https://plus.unsplash.com/premium_photo-1663011406193-7beb9d225d31?w=600&h=400&fit=crop",
  9: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
  10: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop",
  11: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&h=400&fit=crop",
  12: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
  13: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop",
  14: "https://images.unsplash.com/photo-1579165466991-467135ad3114?w=600&h=400&fit=crop",
  15: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=600&h=400&fit=crop",
  16: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  17: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop",
  18: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
  19: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&h=400&fit=crop",
  20: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&h=400&fit=crop",
  21: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  22: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  23: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=600&h=400&fit=crop",
  24: "https://images.unsplash.com/photo-1609825488888-3a766db0551a?w=600&h=400&fit=crop",
  25: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
};

const PACKAGES = [
  { id: "1", code: "PKG001", name: "Complete Blood Count", category: "Hematology", description: "Comprehensive blood analysis including RBC, WBC, platelets, hemoglobin, and hematocrit.", price: 350, includes: ["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"] },
  { id: "2", code: "PKG002", name: "Liver Function Test", category: "Biochemistry", description: "Tests for liver health including enzymes, bilirubin, and protein levels.", price: 800, includes: ["ALT", "AST", "Bilirubin", "Albumin", "Total Protein"] },
  { id: "3", code: "PKG003", name: "Kidney Function Test", category: "Biochemistry", description: "Evaluates kidney performance through blood urea and creatinine tests.", price: 700, includes: ["Creatinine", "BUN", "Uric Acid", "Electrolytes", "eGFR"] },
  { id: "4", code: "PKG004", name: "Thyroid Profile", category: "Hormone", description: "Complete thyroid function assessment including T3, T4, and TSH.", price: 1200, includes: ["T3", "T4", "TSH", "Free T3", "Free T4"] },
  { id: "5", code: "PKG005", name: "Blood Sugar Fasting", category: "Biochemistry", description: "Fasting blood glucose test for diabetes screening and management.", price: 200, includes: ["Fasting Glucose", "PP Glucose", "HbA1c"] },
  { id: "6", code: "PKG006", name: "Lipid Profile", category: "Biochemistry", description: "Cholesterol and triglyceride assessment for heart health.", price: 600, includes: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"] },
  { id: "7", code: "PKG007", name: "Hemoglobin A1C", category: "Diabetes", description: "Long-term blood sugar monitoring for diabetes management.", price: 500, includes: ["HbA1c", "Average Blood Glucose"] },
  { id: "8", code: "PKG008", name: "Vitamin D3", category: "Vitamins", description: "Test for Vitamin D deficiency and bone health assessment.", price: 1500, includes: ["Vitamin D3", "Vitamin D2", "Total Vitamin D"] },
  { id: "9", code: "PKG009", name: "Iron Studies", category: "Hematology", description: "Comprehensive iron deficiency and anemia workup.", price: 900, includes: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"] },
  { id: "10", code: "PKG010", name: "Dengue NS1 Antigen", category: "Microbiology", description: "Early detection test for dengue fever infection.", price: 800, includes: ["NS1 Antigen", "IgM Antibody", "IgG Antibody"] },
  { id: "11", code: "PKG011", name: "Urine Analysis", category: "Pathology", description: "Complete urine examination for kidney and urinary tract health.", price: 250, includes: ["pH", "Protein", "Glucose", "Ketones", "Microscopy"] },
  { id: "12", code: "PKG012", name: "ECG", category: "Cardiology", description: "Electrocardiogram for heart rhythm and function assessment.", price: 400, includes: ["Heart Rhythm", "Heart Rate", "Cardiac Axis", "Abnormalities"] },
  { id: "13", code: "PKG013", name: "Vitamin B12", category: "Vitamins", description: "Test for Vitamin B12 deficiency and neurological health.", price: 1200, includes: ["Vitamin B12", "Folate", "Homocysteine"] },
  { id: "14", code: "PKG014", name: "HbA1c & Glucose", category: "Diabetes", description: "Combined test for diabetes diagnosis and monitoring.", price: 650, includes: ["HbA1c", "Fasting Glucose", "PP Glucose"] },
  { id: "15", code: "PKG015", name: "Uric Acid", category: "Biochemistry", description: "Test for gout and kidney stone risk assessment.", price: 300, includes: ["Uric Acid", "Creatinine", "BUN"] },
  { id: "16", code: "PKG016", name: "ESR", category: "Hematology", description: "Erythrocyte sedimentation rate for inflammation detection.", price: 150, includes: ["ESR", "CRP", "WBC Count"] },
  { id: "17", code: "PKG017", name: "Malaria Antigen", category: "Microbiology", description: "Rapid test for malaria parasite detection.", price: 450, includes: ["Malaria Antigen", "P. falciparum", "P. vivax"] },
  { id: "18", code: "PKG018", name: "Pregnancy Test", category: "Hormone", description: "Beta HCG test for pregnancy confirmation.", price: 350, includes: ["Beta HCG", "Qualitative", "Quantitative"] },
  { id: "19", code: "PKG019", name: "Semen Analysis", category: "Pathology", description: "Complete semen examination for fertility assessment.", price: 500, includes: ["Count", "Motility", "Morphology", "Volume"] },
  { id: "20", code: "PKG020", name: "Stool Routine", category: "Pathology", description: "Complete stool examination for digestive health.", price: 200, includes: ["Color", "Consistency", "Microscopy", "Occult Blood"] },
  { id: "21", code: "PKG021", name: "Blood Group & Rh", category: "Hematology", description: "ABO blood group and Rh factor determination.", price: 250, includes: ["ABO Group", "Rh Factor", "Antibody Screen"] },
  { id: "22", code: "PKG022", name: "Coagulation Profile", category: "Hematology", description: "Blood clotting function assessment.", price: 800, includes: ["PT", "aPTT", "INR", "Fibrinogen"] },
  { id: "23", code: "PKG023", name: "Serum Electrolytes", category: "Biochemistry", description: "Electrolyte balance assessment for hydration status.", price: 400, includes: ["Sodium", "Potassium", "Chloride", "Bicarbonate"] },
  { id: "24", code: "PKG024", name: "Amylase & Lipase", category: "Biochemistry", description: "Pancreatic enzyme test for pancreatitis diagnosis.", price: 700, includes: ["Amylase", "Lipase", "Calcium"] },
  { id: "25", code: "PKG025", name: "Prostate Specific Antigen", category: "Hormone", description: "PSA test for prostate health screening.", price: 900, includes: ["Total PSA", "Free PSA", "PSA Ratio"] },
];

function esc(value) {
  if (value == null) return "NULL";
  return `N'${String(value).replace(/'/g, "''")}'`;
}

function num(value) {
  if (value == null || value === "") return "NULL";
  return String(Number(value));
}

async function fetchTests() {
  const outFile = path.join(tmpdir(), `cutis-tests-${randomUUID()}.txt`);
  const sqlFile = path.join(tmpdir(), `cutis-tests-${randomUUID()}.sql`);
  const wrapped = `
SET NOCOUNT ON;
DECLARE @json NVARCHAR(MAX);
SET @json = (SELECT id, name FROM dbo.Test FOR JSON PATH);
SELECT ISNULL(@json, N'[]');
`;
  try {
    await writeFile(sqlFile, wrapped, "utf8");
    await execFileAsync(
      "sqlcmd",
      ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-y", "0", "-i", sqlFile, "-o", outFile],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    const raw = await readFile(outFile, "utf8");
    const text = raw.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean).join("");
    const start = text.indexOf("[");
    return JSON.parse(start >= 0 ? text.slice(start) : "[]");
  } finally {
    await unlink(outFile).catch(() => {});
    await unlink(sqlFile).catch(() => {});
  }
}

function matchTest(tests, includeName) {
  const lower = includeName.toLowerCase().trim();
  let match = tests.find((t) => t.name.toLowerCase().trim() === lower);
  if (!match) {
    match = tests.find(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        lower.includes(t.name.toLowerCase()),
    );
  }
  return match || null;
}

async function main() {
  const dbTests = await fetchTests();
  console.log(`Loaded ${dbTests.length} tests for matching`);

  const lines = [
    "SET NOCOUNT ON;",
    "UPDATE dbo.Booking SET packageId = NULL WHERE packageId IS NOT NULL;",
    "DELETE FROM dbo.PackageTest;",
    "DELETE FROM dbo.Package;",
    "",
  ];

  let linked = 0;
  let totalIncludes = 0;

  for (const pkg of PACKAGES) {
    const imageUrl = PACKAGE_IMAGES[Number(pkg.id)] || null;
    lines.push(`INSERT INTO dbo.Package
  (id, code, name, category, description, price, originalPrice, imageUrl, reportsTime, fasting, sampleType)
VALUES
  (${esc(pkg.id)}, ${esc(pkg.code)}, ${esc(pkg.name)}, ${esc(pkg.category)},
   ${esc(pkg.description)}, ${num(pkg.price)}, NULL, ${esc(imageUrl)},
   N'24-48 hrs', N'10-12 hrs', N'Blood');`);

    const used = new Set();
    pkg.includes.forEach((testName, index) => {
      totalIncludes += 1;
      const matched = matchTest(dbTests, testName);
      let testId = null;
      if (matched && !used.has(matched.id)) {
        testId = matched.id;
        used.add(matched.id);
        linked += 1;
      }
      lines.push(`INSERT INTO dbo.PackageTest (id, packageId, testId, testName, sortOrder)
VALUES (${esc(randomUUID())}, ${esc(pkg.id)}, ${testId ? esc(testId) : "NULL"}, ${esc(testName)}, ${index});`);
    });
    lines.push("");
  }

  const sqlFile = path.join(tmpdir(), `seed-packages-${randomUUID()}.sql`);
  await writeFile(sqlFile, lines.join("\n"), "utf8");

  try {
    const { stdout, stderr } = await execFileAsync(
      "sqlcmd",
      ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-b", "-i", sqlFile],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    if (stderr && stderr.trim()) console.error(stderr);
    if (stdout) console.log(stdout.trim());
    console.log(
      `Seeded ${PACKAGES.length} packages, ${totalIncludes} includes (${linked} linked to Test rows)`,
    );
  } finally {
    await unlink(sqlFile).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
