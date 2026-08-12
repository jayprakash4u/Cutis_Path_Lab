/**
 * Seed the Cutis Path Lab catalog + site content into MySQL.
 * Replaces the old sqlcmd seed scripts (tests, packages, home content, referrals, category links).
 *
 * Run: npm run db:seed
 *
 * Bookings and contact messages are never touched — only catalog/content tables
 * are cleared and rebuilt, so the seed is safe to re-run.
 */
import { randomUUID } from "crypto";
import { connect, describeTarget } from "./db.mjs";
import { tests as staticTests } from "../src/data/staticData.js";

// ── Packages ──────────────────────────────────────────────────────
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

// ── Homepage content ──────────────────────────────────────────────
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

const REFERRAL_DOCTORS = [
  { name: "Dr. Rajesh Kumar", specialization: "Cardiologist", hospital: "City Heart Hospital", quote: "Cutis Path Lab delivers precise cardiac markers and lipid profiles with exceptional turnaround. I confidently refer all my patients for diagnostics.", imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
  { name: "Dr. Priya Sharma", specialization: "Gynecologist", hospital: "Women Care Medical Center", quote: "From prenatal screening to hormone panels, their reports are accurate and timely. A trusted partner for women's health diagnostics.", imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },
  { name: "Dr. Amit Patel", specialization: "Orthopedic Surgeon", hospital: "Bone & Joint Institute", quote: "Bone density scans and inflammatory markers from Cutis Path Lab help me plan surgeries with confidence. Highly professional team.", imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
  { name: "Dr. Sunita Devi", specialization: "Pediatrician", hospital: "Children's Health Center", quote: "Gentle sample collection and reliable pediatric test results make Cutis Path Lab my go-to lab for young patients and their families.", imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
  { name: "Dr. Mahesh Gupta", specialization: "Neurologist", hospital: "Brain & Spine Clinic", quote: "Advanced neuro-diagnostic testing with clear, detailed reports. Cutis Path Lab supports my clinical decisions every day.", imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop" },
  { name: "Dr. Anjali Singh", specialization: "Dermatologist", hospital: "Skin Care Institute", quote: "Allergy panels, biopsy pathology, and skin-related tests are handled with great care. I recommend them to all my patients.", imageUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop" },
  { name: "Dr. Vikram Joshi", specialization: "Gastroenterologist", hospital: "Digestive Health Center", quote: "From liver function to stool analysis, their gastroenterology panels are comprehensive and consistently accurate.", imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop" },
  { name: "Dr. Meera Nair", specialization: "Endocrinologist", hospital: "Diabetes & Hormone Clinic", quote: "Hormone assays and diabetes monitoring from Cutis Path Lab are reliable. My patients appreciate the home collection service.", imageUrl: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop" },
  { name: "Dr. Suresh Reddy", specialization: "Pulmonologist", hospital: "Respiratory Care Center", quote: "Pulmonary function and sputum culture results arrive quickly, helping me treat respiratory conditions without delay.", imageUrl: "https://images.unsplash.com/photo-1612349316228-5942a9b489c4?w=400&h=400&fit=crop" },
  { name: "Dr. Kavita Mishra", specialization: "Oncologist", hospital: "Cancer Care Hospital", quote: "Tumor markers and molecular diagnostics from Cutis Path Lab are critical to our oncology treatment plans. Truly dependable.", imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop" },
];

const GALLERY = [
  { imageUrl: "/images/gallery/9e641ac2-a36c-4939-93e4-514b0861ffe6.jpg", title: "Our Laboratory", altText: "Cutis Path Lab laboratory" },
  { imageUrl: "/images/banners/1.jpg", title: "Sample Collection", altText: "Sample collection area" },
  { imageUrl: "/images/banners/2.jpg", title: "Diagnostics", altText: "Diagnostic equipment" },
  { imageUrl: "/images/banners/3.jpg", title: "Lab Technology", altText: "Modern lab technology" },
  { imageUrl: "/images/banners/4.jpg", title: "Our Team", altText: "Cutis Path Lab team" },
  { imageUrl: "/images/banners/5.jpg", title: "Reception", altText: "Reception and waiting area" },
  { imageUrl: "/images/home/stats-image.jpg", title: "Trusted Care", altText: "Patient care at Cutis Path Lab" },
];

/** Disease slug → test-name fragments (same rules the old sqlcmd seeder used). */
const DISEASE_PATTERNS = {
  anemia: ["CBC", "Hemoglobin", "Iron", "Ferritin", "RBC", "Peripheral Blood", "Platelet"],
  diabetes: ["Glucose", "HbA1c", "Insulin", "Sugar", "A1C"],
  heart: ["Lipid", "Cholesterol", "D-Dimer", "Troponin", "ECG", "Creatine Kinase"],
  thyroid: ["Thyroid", "TSH", "T3", "T4"],
  kidney: ["Kidney", "Creatinine", "BUN", "Urea", "Urinalysis", "Urine", "Uric Acid", "Electrolyte"],
  liver: ["Liver", "Bilirubin", "ALT", "AST", "ALP", "GGT", "Albumin", "Alanine", "Aspartate", "Alkaline Phosphatase", "Gamma-Glutamyl"],
  bone: ["Vitamin D", "Calcium", "Bone Marrow", "Alkaline Phosphatase"],
  fever: ["Dengue", "Malaria", "Typhoid", "ESR", "WBC", "Blood Culture", "CRP", "Fever"],
  cancer: ["PSA", "Pap Smear", "Histopathology", "Cytopathology", "Immunohistochemistry", "Flow Cytometry", "Molecular Pathology", "Prostate"],
  "gut-health": ["Stool", "Occult", "Helicobacter", "Gut"],
};

function matchTest(tests, includeName) {
  const lower = includeName.toLowerCase().trim();
  return (
    tests.find((t) => t.name.toLowerCase().trim() === lower) ||
    tests.find(
      (t) =>
        t.name.toLowerCase().includes(lower) || lower.includes(t.name.toLowerCase()),
    ) ||
    null
  );
}

async function bulkInsert(conn, table, columns, rows) {
  if (!rows.length) return 0;
  const cols = columns.map((c) => `\`${c}\``).join(", ");
  const [result] = await conn.query(
    `INSERT INTO \`${table}\` (${cols}) VALUES ?`,
    [rows],
  );
  return result.affectedRows;
}

async function main() {
  const conn = await connect({ multipleStatements: true });
  console.log(`Seeding ${describeTarget()} ...\n`);

  try {
    // Clear catalog + content. Bookings/ContactMessage are preserved; their
    // FKs are ON DELETE SET NULL so stale references simply go null.
    await conn.query(`
      DELETE FROM \`CategoryTest\`;
      DELETE FROM \`PackageTest\`;
      DELETE FROM \`GalleryImage\`;
      DELETE FROM \`ReferralDoctor\`;
      DELETE FROM \`Testimonial\`;
      DELETE FROM \`Offer\`;
      DELETE FROM \`Category\`;
      DELETE FROM \`Package\`;
      DELETE FROM \`Test\`;
    `);

    // ── Tests ────────────────────────────────────────────────────
    const testRows = staticTests.map((t) => [
      String(t.id),
      String(t.id),
      t.name,
      t.category,
      Number(t.price),
      t.originalPrice == null ? null : Number(t.originalPrice),
      t.description ?? null,
      t.sampleType ?? null,
      t.fastingRequired ? 1 : 0,
      t.reportTime ?? null,
      t.parameters == null ? null : Number(t.parameters),
      t.popular ? 1 : 0,
    ]);
    const testCount = await bulkInsert(
      conn,
      "Test",
      ["id", "code", "name", "category", "price", "originalPrice", "description", "sampleType", "fastingRequired", "reportTime", "parameters", "popular"],
      testRows,
    );
    console.log(`  Tests............. ${testCount}`);

    const dbTests = staticTests.map((t) => ({ id: String(t.id), name: t.name }));

    // ── Packages + includes ──────────────────────────────────────
    const packageRows = PACKAGES.map((p) => [
      p.id,
      p.code,
      p.name,
      p.category,
      p.description ?? null,
      Number(p.price),
      null,
      PACKAGE_IMAGES[Number(p.id)] ?? null,
      "24-48 hrs",
      "10-12 hrs",
      "Blood",
    ]);
    const pkgCount = await bulkInsert(
      conn,
      "Package",
      ["id", "code", "name", "category", "description", "price", "originalPrice", "imageUrl", "reportsTime", "fasting", "sampleType"],
      packageRows,
    );

    const packageTestRows = [];
    let linked = 0;
    for (const pkg of PACKAGES) {
      const used = new Set();
      pkg.includes.forEach((testName, index) => {
        const matched = matchTest(dbTests, testName);
        let testId = null;
        if (matched && !used.has(matched.id)) {
          testId = matched.id;
          used.add(matched.id);
          linked += 1;
        }
        packageTestRows.push([randomUUID(), pkg.id, testId, testName, index]);
      });
    }
    const ptCount = await bulkInsert(
      conn,
      "PackageTest",
      ["id", "packageId", "testId", "testName", "sortOrder"],
      packageTestRows,
    );
    console.log(`  Packages.......... ${pkgCount} (${ptCount} includes, ${linked} linked to tests)`);

    // ── Disease categories ───────────────────────────────────────
    const categoryRows = CATEGORIES.map((c, i) => [
      String(i + 1),
      c.label,
      c.slug,
      c.imageUrl,
      1,
      i,
    ]);
    const catCount = await bulkInsert(
      conn,
      "Category",
      ["id", "label", "slug", "imageUrl", "isActive", "sortOrder"],
      categoryRows,
    );

    const categoryTestRows = [];
    for (let i = 0; i < CATEGORIES.length; i += 1) {
      const patterns = DISEASE_PATTERNS[CATEGORIES[i].slug] || [];
      if (!patterns.length) continue;
      const matched = dbTests.filter((t) =>
        patterns.some((p) => t.name.toLowerCase().includes(p.toLowerCase())),
      );
      matched.forEach((t, order) => {
        categoryTestRows.push([String(i + 1), t.id, order]);
      });
    }
    const ctCount = await bulkInsert(
      conn,
      "CategoryTest",
      ["categoryId", "testId", "sortOrder"],
      categoryTestRows,
    );
    console.log(`  Categories........ ${catCount} (${ctCount} test links)`);

    // ── Offers ───────────────────────────────────────────────────
    const offerRows = OFFERS.map((o, i) => [
      String(i + 1),
      o.name,
      o.category,
      Number(o.originalPrice),
      Number(o.discountedPrice),
      Number(o.discount),
      o.reportsTime,
      o.fasting,
      o.sampleType,
      1,
      i,
    ]);
    const offerCount = await bulkInsert(
      conn,
      "Offer",
      ["id", "name", "category", "originalPrice", "discountedPrice", "discountPercent", "reportsTime", "fasting", "sampleType", "isActive", "sortOrder"],
      offerRows,
    );
    console.log(`  Offers............ ${offerCount}`);

    // ── Testimonials ─────────────────────────────────────────────
    const testimonialRows = TESTIMONIALS.map((t, i) => [
      String(i + 1),
      t.name,
      t.role,
      t.content,
      Number(t.rating),
      t.imageUrl,
      1,
      1,
      i,
    ]);
    const testimonialCount = await bulkInsert(
      conn,
      "Testimonial",
      ["id", "name", "role", "content", "rating", "imageUrl", "featured", "isActive", "sortOrder"],
      testimonialRows,
    );
    console.log(`  Testimonials...... ${testimonialCount}`);

    // ── Referral doctors ─────────────────────────────────────────
    const referralRows = REFERRAL_DOCTORS.map((d, i) => [
      randomUUID(),
      d.name,
      d.specialization,
      d.hospital,
      d.quote,
      d.imageUrl,
      1,
      i,
    ]);
    const referralCount = await bulkInsert(
      conn,
      "ReferralDoctor",
      ["id", "name", "specialization", "hospital", "quote", "imageUrl", "isActive", "sortOrder"],
      referralRows,
    );
    console.log(`  Referral doctors.. ${referralCount}`);

    // ── Gallery ──────────────────────────────────────────────────
    const galleryRows = GALLERY.map((g, i) => [
      randomUUID(),
      g.title ?? null,
      null,
      g.imageUrl,
      g.altText ?? null,
      1,
      i,
    ]);
    const galleryCount = await bulkInsert(
      conn,
      "GalleryImage",
      ["id", "title", "caption", "imageUrl", "altText", "isActive", "sortOrder"],
      galleryRows,
    );
    console.log(`  Gallery images.... ${galleryCount}`);

    console.log("\nSeed complete.");
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("\nSeed failed:", err.code || "", err.message);
  process.exit(1);
});
