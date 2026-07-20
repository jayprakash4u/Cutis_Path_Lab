/**
 * Seed offers, testimonials, categories for homepage.
 * Run: node scripts/seed-home-content.mjs
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

function num(value) {
  return String(Number(value));
}

function bit(value) {
  return value ? "1" : "0";
}

const OFFERS = [
  { name: "Complete Body Checkup", category: "Full Body", originalPrice: 3500, discountedPrice: 2499, discount: 28, reportsTime: "24 hrs", fasting: "10-12 hrs", sampleType: "Blood" },
  { name: "Diabetes Screening", category: "Diabetes", originalPrice: 1200, discountedPrice: 799, discount: 33, reportsTime: "24 hrs", fasting: "8-10 hrs", sampleType: "Blood" },
  { name: "Heart Health Package", category: "Cardiology", originalPrice: 2800, discountedPrice: 1999, discount: 28, reportsTime: "24 hrs", fasting: "10-12 hrs", sampleType: "Blood" },
  { name: "Thyroid Profile", category: "Hormone", originalPrice: 1200, discountedPrice: 899, discount: 25, reportsTime: "24 hrs", fasting: "8-10 hrs", sampleType: "Blood" },
  { name: "Iron Deficiency Test", category: "Hematology", originalPrice: 900, discountedPrice: 599, discount: 33, reportsTime: "24 hrs", fasting: "8-10 hrs", sampleType: "Blood" },
  { name: "Liver Function Test", category: "Liver", originalPrice: 1800, discountedPrice: 1299, discount: 28, reportsTime: "24 hrs", fasting: "10-12 hrs", sampleType: "Blood" },
  { name: "Kidney Function Test", category: "Kidney", originalPrice: 1500, discountedPrice: 999, discount: 33, reportsTime: "24 hrs", fasting: "10-12 hrs", sampleType: "Blood" },
  { name: "Lipid Profile", category: "Cardiology", originalPrice: 1100, discountedPrice: 749, discount: 32, reportsTime: "24 hrs", fasting: "10-12 hrs", sampleType: "Blood" },
  { name: "CBC Test", category: "Hematology", originalPrice: 800, discountedPrice: 549, discount: 31, reportsTime: "24 hrs", fasting: "8-10 hrs", sampleType: "Blood" },
  { name: "Vitamin D Test", category: "Hormone", originalPrice: 2000, discountedPrice: 1499, discount: 25, reportsTime: "48 hrs", fasting: "8-10 hrs", sampleType: "Blood" },
];

const TESTIMONIALS = [
  { name: "Ramesh Kumar", role: "Patient", rating: 5, content: "Excellent service! The staff was very professional and the test results were delivered on time. Highly recommend Cutis Path Lab for all diagnostic needs.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Sita Devi", role: "Regular Patient", rating: 5, content: "I've been using Cutis Path Lab for years. The home collection service is very convenient and the reports are always accurate. Great experience every time.", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "Dr. Amit Sharma", role: "Physician", rating: 5, content: "As a referring physician, I trust Cutis Path Lab for all my patients. Their accuracy and turnaround time are exceptional. Highly recommended.", imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" },
  { name: "Priya Patel", role: "Patient", rating: 4, content: "Very clean and well-maintained facility. The staff was friendly and explained everything clearly. Will definitely come back for future tests.", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { name: "Mahesh Thapa", role: "Corporate Client", rating: 5, content: "We use Cutis Path Lab for our employee health checkups. Professional service, competitive pricing, and excellent reporting. Very satisfied with their service.", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { name: "Anita Gurung", role: "Patient", rating: 5, content: "The online booking system is so convenient! Got my appointment easily and the sample collection was done at my home. Great experience overall.", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
];

const CATEGORIES = [
  { label: "Anemia", slug: "anemia", imageUrl: "/images/disease-categories/anemia.jpg" },
  { label: "Diabetes", slug: "diabetes", imageUrl: "/images/disease-categories/diabetes.jpg" },
  { label: "Heart", slug: "heart", imageUrl: "/images/disease-categories/heart.jpg" },
  { label: "Thyroid", slug: "thyroid", imageUrl: "/images/disease-categories/thyroid.jpg" },
  { label: "Kidney", slug: "kidney", imageUrl: "/images/disease-categories/kidney.jpg" },
  { label: "Liver", slug: "liver", imageUrl: "/images/disease-categories/liver.jpg" },
  { label: "Bone", slug: "bone", imageUrl: "/images/disease-categories/bone.jpg" },
  { label: "Fever", slug: "fever", imageUrl: "/images/disease-categories/fever.jpg" },
  { label: "Cancer", slug: "cancer", imageUrl: "/images/disease-categories/cancer.jpg" },
  { label: "Gut Health", slug: "gut-health", imageUrl: "/images/disease-categories/gut-health.jpg" },
];

async function main() {
  const lines = [
    "SET NOCOUNT ON;",
    "IF OBJECT_ID('dbo.CategoryTest', 'U') IS NOT NULL DELETE FROM dbo.CategoryTest;",
    "DELETE FROM dbo.Offer;",
    "DELETE FROM dbo.Testimonial;",
    "DELETE FROM dbo.Category;",
    "",
  ];

  OFFERS.forEach((o, i) => {
    lines.push(`INSERT INTO dbo.Offer
  (id, name, category, originalPrice, discountedPrice, discountPercent, reportsTime, fasting, sampleType, isActive, sortOrder)
VALUES
  (${esc(String(i + 1))}, ${esc(o.name)}, ${esc(o.category)}, ${num(o.originalPrice)}, ${num(o.discountedPrice)},
   ${num(o.discount)}, ${esc(o.reportsTime)}, ${esc(o.fasting)}, ${esc(o.sampleType)}, 1, ${i});`);
  });
  lines.push("");

  TESTIMONIALS.forEach((t, i) => {
    lines.push(`INSERT INTO dbo.Testimonial
  (id, name, role, content, rating, imageUrl, featured, isActive, sortOrder)
VALUES
  (${esc(String(i + 1))}, ${esc(t.name)}, ${esc(t.role)}, ${esc(t.content)}, ${num(t.rating)},
   ${esc(t.imageUrl)}, 1, 1, ${i});`);
  });
  lines.push("");

  CATEGORIES.forEach((c, i) => {
    lines.push(`INSERT INTO dbo.Category
  (id, label, slug, imageUrl, isActive, sortOrder)
VALUES
  (${esc(String(i + 1))}, ${esc(c.label)}, ${esc(c.slug)}, ${esc(c.imageUrl)}, 1, ${i});`);
  });

  const sqlFile = path.join(tmpdir(), `seed-home-${randomUUID()}.sql`);
  await writeFile(sqlFile, lines.join("\n"), "utf8");

  try {
    await execFileAsync(
      "sqlcmd",
      ["-S", SERVER, "-E", "-C", "-d", DATABASE, "-b", "-i", sqlFile],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    console.log(
      `Seeded ${OFFERS.length} offers, ${TESTIMONIALS.length} testimonials, ${CATEGORIES.length} categories`,
    );
  } finally {
    await unlink(sqlFile).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
