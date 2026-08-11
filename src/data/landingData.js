// ─────────────────────────────────────────────────────────────────────────
// Landing page content — static sample data, no API calls.
// Swap these arrays for real records when the catalogue is wired up.
// ─────────────────────────────────────────────────────────────────────────

/** Discounted tests shown in the "This month's offers" rail. */
export const offers = [
  {
    id: "OF01",
    name: "Complete Blood Count",
    code: "CBC",
    category: "Haematology",
    parameters: 28,
    reportsTime: "24 hours",
    fasting: "Not required",
    sampleType: "Whole blood",
    originalPrice: 450,
    discountedPrice: 350,
  },
  {
    id: "OF02",
    name: "Lipid Profile",
    code: "LIPID",
    category: "Biochemistry",
    parameters: 8,
    reportsTime: "24 hours",
    fasting: "10–12 hours",
    sampleType: "Serum",
    originalPrice: 1200,
    discountedPrice: 800,
  },
  {
    id: "OF03",
    name: "Thyroid Profile (T3 T4 TSH)",
    code: "TFT",
    category: "Endocrinology",
    parameters: 3,
    reportsTime: "24 hours",
    fasting: "Not required",
    sampleType: "Serum",
    originalPrice: 1100,
    discountedPrice: 750,
  },
  {
    id: "OF04",
    name: "Liver Function Test",
    code: "LFT",
    category: "Biochemistry",
    parameters: 11,
    reportsTime: "24 hours",
    fasting: "8 hours",
    sampleType: "Serum",
    originalPrice: 1400,
    discountedPrice: 950,
  },
  {
    id: "OF05",
    name: "HbA1c",
    code: "HBA1C",
    category: "Diabetology",
    parameters: 1,
    reportsTime: "12 hours",
    fasting: "Not required",
    sampleType: "Whole blood",
    originalPrice: 900,
    discountedPrice: 600,
  },
  {
    id: "OF06",
    name: "Vitamin D (25-OH)",
    code: "VITD",
    category: "Biochemistry",
    parameters: 1,
    reportsTime: "48 hours",
    fasting: "Not required",
    sampleType: "Serum",
    originalPrice: 2200,
    discountedPrice: 1500,
  },
];

/** Most-ordered tests and bundled panels. */
export const popularItems = [
  {
    id: "T001",
    kind: "test",
    name: "Complete Blood Count",
    code: "CBC",
    parameters: 28,
    reportsTime: "24 hours",
    fasting: "Not required",
    sampleType: "Whole blood",
    price: 350,
    originalPrice: 450,
  },
  {
    id: "P001",
    kind: "package",
    name: "Full Body Checkup",
    code: "FBC-84",
    parameters: 84,
    reportsTime: "48 hours",
    fasting: "10–12 hours",
    sampleType: "Blood, urine",
    price: 3800,
    originalPrice: 5600,
  },
  {
    id: "T014",
    kind: "test",
    name: "Thyroid Profile",
    code: "TFT",
    parameters: 3,
    reportsTime: "24 hours",
    fasting: "Not required",
    sampleType: "Serum",
    price: 750,
    originalPrice: 1100,
  },
  {
    id: "P002",
    kind: "package",
    name: "Diabetes Care Panel",
    code: "DIA-12",
    parameters: 12,
    reportsTime: "24 hours",
    fasting: "10 hours",
    sampleType: "Blood, urine",
    price: 1650,
    originalPrice: 2400,
  },
  {
    id: "T021",
    kind: "test",
    name: "Lipid Profile",
    code: "LIPID",
    parameters: 8,
    reportsTime: "24 hours",
    fasting: "10–12 hours",
    sampleType: "Serum",
    price: 800,
    originalPrice: 1200,
  },
  {
    id: "P003",
    kind: "package",
    name: "Women's Wellness Panel",
    code: "WWP-36",
    parameters: 36,
    reportsTime: "48 hours",
    fasting: "10 hours",
    sampleType: "Blood, urine",
    price: 2900,
    originalPrice: 4100,
  },
  {
    id: "T033",
    kind: "test",
    name: "Kidney Function Test",
    code: "KFT",
    parameters: 9,
    reportsTime: "24 hours",
    fasting: "8 hours",
    sampleType: "Serum",
    price: 900,
    originalPrice: 1300,
  },
  {
    id: "P004",
    kind: "package",
    name: "Cardiac Risk Panel",
    code: "CRP-18",
    parameters: 18,
    reportsTime: "48 hours",
    fasting: "12 hours",
    sampleType: "Serum",
    price: 2400,
    originalPrice: 3300,
  },
];

/** Clinicians who refer patients to the lab. */
export const referrals = [
  {
    id: "D01",
    name: "Dr. Anjana Shrestha",
    specialization: "Endocrinology",
    hospital: "Norvic International Hospital",
    since: "2019",
    quote:
      "Thyroid and HbA1c results come back the same day, which means I can adjust a dose at the first consultation instead of the second.",
  },
  {
    id: "D02",
    name: "Dr. Bikash Karki",
    specialization: "Internal Medicine",
    hospital: "Grande International Hospital",
    since: "2020",
    quote:
      "Reference intervals are printed on every panel and the flagging is consistent. My patients understand their own reports.",
  },
  {
    id: "D03",
    name: "Dr. Sunita Maharjan",
    specialization: "Obstetrics & Gynaecology",
    hospital: "Om Hospital, Chabahil",
    since: "2018",
    quote:
      "Home collection matters for my antenatal patients. The phlebotomists arrive on time and the samples hold up.",
  },
  {
    id: "D04",
    name: "Dr. Rajan Thapa",
    specialization: "Nephrology",
    hospital: "Bir Hospital",
    since: "2021",
    quote:
      "Creatinine and electrolyte trends are easy to follow across visits because the reporting format never changes.",
  },
  {
    id: "D05",
    name: "Dr. Prakriti Adhikari",
    specialization: "Paediatrics",
    hospital: "Kanti Children's Hospital",
    since: "2022",
    quote:
      "Small-volume paediatric draws are handled properly here. I have not had to repeat a sample in two years.",
  },
];

/** Patient and clinician feedback. */
export const testimonials = [
  {
    id: "R01",
    name: "Sabina Gurung",
    role: "Patient · Baneshwor",
    rating: 5,
    content:
      "Booked at nine, the phlebotomist was at my flat by ten, and the report reached my inbox before dinner. The reference ranges were printed next to every value so I could actually read it.",
  },
  {
    id: "R02",
    name: "Dr. Nabin Rai",
    role: "Referring physician",
    rating: 5,
    content:
      "I send my diabetic patients here specifically for the HbA1c turnaround. Consistent numbers, consistent format, no chasing the lab for results.",
  },
  {
    id: "R03",
    name: "Krishna Bhandari",
    role: "Patient · Koteshwor",
    rating: 4,
    content:
      "Full body checkup for my father, who is 74. Home collection meant he did not have to travel. Staff explained the fasting requirement clearly the day before.",
  },
  {
    id: "R04",
    name: "Meera Tuladhar",
    role: "Patient · Lalitpur",
    rating: 5,
    content:
      "Pricing was exactly what the website said, no additions at the counter. The WhatsApp copy of the report was useful when I saw a second doctor.",
  },
  {
    id: "R05",
    name: "Dr. Sanjay Pradhan",
    role: "Consultant cardiologist",
    rating: 5,
    content:
      "Lipid panels and cardiac markers are reliable and repeat testing tracks well. That consistency is what I need when I am titrating treatment.",
  },
];

/** Health packages listed on /packages. */
export const packages = [
  {
    id: "P001",
    name: "Full Body Checkup",
    category: "Preventive",
    price: 3800,
    originalPrice: 5600,
    description:
      "An 84-parameter screen covering blood counts, liver and kidney function, lipids, thyroid, blood sugar and urine. The panel most people start with.",
    includes: [
      "Complete Blood Count",
      "Liver Function Test",
      "Kidney Function Test",
      "Lipid Profile",
      "Thyroid Profile",
      "Fasting Blood Sugar",
      "Urine Routine",
      "Serum Electrolytes",
    ],
    reportsTime: "48 hours",
    fasting: "10–12 hours",
    sampleType: "Blood, urine",
  },
  {
    id: "P002",
    name: "Diabetes Care Panel",
    category: "Diabetology",
    price: 1650,
    originalPrice: 2400,
    description:
      "For monitoring an existing diagnosis or confirming a suspected one. Covers long-term control alongside same-day glucose.",
    includes: [
      "HbA1c",
      "Fasting Blood Sugar",
      "Post-Prandial Blood Sugar",
      "Urine Microalbumin",
      "Serum Creatinine",
    ],
    reportsTime: "24 hours",
    fasting: "10 hours",
    sampleType: "Blood, urine",
  },
  {
    id: "P003",
    name: "Women's Wellness Panel",
    category: "Preventive",
    price: 2900,
    originalPrice: 4100,
    description:
      "Thyroid, iron studies, vitamin D and B12 alongside a full blood count — the deficiencies most often missed in routine testing.",
    includes: [
      "Complete Blood Count",
      "Thyroid Profile",
      "Iron Studies",
      "Vitamin D (25-OH)",
      "Vitamin B12",
      "Calcium",
    ],
    reportsTime: "48 hours",
    fasting: "10 hours",
    sampleType: "Blood",
  },
  {
    id: "P004",
    name: "Cardiac Risk Panel",
    category: "Cardiology",
    price: 2400,
    originalPrice: 3300,
    description:
      "Lipid fractions plus inflammatory and homocysteine markers, for patients with a family history or existing risk factors.",
    includes: [
      "Lipid Profile",
      "hs-CRP",
      "Homocysteine",
      "Apolipoprotein A1 / B",
      "Lipoprotein(a)",
    ],
    reportsTime: "48 hours",
    fasting: "12 hours",
    sampleType: "Serum",
  },
  {
    id: "P005",
    name: "Liver Care Panel",
    category: "Hepatology",
    price: 1900,
    originalPrice: 2700,
    description:
      "Enzymes, bilirubin fractions and protein levels, with hepatitis screening included.",
    includes: [
      "Liver Function Test",
      "Prothrombin Time",
      "HBsAg",
      "Anti-HCV",
      "Serum Albumin",
    ],
    reportsTime: "48 hours",
    fasting: "8 hours",
    sampleType: "Serum",
  },
  {
    id: "P006",
    name: "Senior Citizen Panel",
    category: "Preventive",
    price: 4200,
    originalPrice: 6000,
    description:
      "A broader screen for patients over 60, adding prostate or bone markers and a cardiac baseline to the standard full body workup.",
    includes: [
      "Complete Blood Count",
      "Liver Function Test",
      "Kidney Function Test",
      "Lipid Profile",
      "HbA1c",
      "Vitamin D (25-OH)",
      "PSA / Bone Profile",
      "ECG",
    ],
    reportsTime: "48 hours",
    fasting: "10–12 hours",
    sampleType: "Blood, urine",
  },
  {
    id: "P007",
    name: "Fever Workup",
    category: "Infectious disease",
    price: 1450,
    originalPrice: 2100,
    description:
      "Run when a fever has not settled in three days. Screens the common causes seen in the valley before narrowing further.",
    includes: [
      "Complete Blood Count",
      "Dengue NS1 Antigen",
      "Malaria Antigen",
      "Widal Test",
      "Urine Routine",
      "ESR",
    ],
    reportsTime: "24 hours",
    fasting: "Not required",
    sampleType: "Blood, urine",
  },
  {
    id: "P008",
    name: "Thyroid & Hormone Panel",
    category: "Endocrinology",
    price: 2200,
    originalPrice: 3100,
    description:
      "Full thyroid function with antibody testing, for unexplained weight change, fatigue or hair loss.",
    includes: [
      "T3, T4, TSH",
      "Free T3, Free T4",
      "Anti-TPO Antibody",
      "Prolactin",
    ],
    reportsTime: "48 hours",
    fasting: "Not required",
    sampleType: "Serum",
  },
];

/**
 * Disease areas used by the "browse by condition" rail. `match` holds the
 * keywords a test name or description has to contain to appear under that
 * heading — the local stand-in for the old ?disease= query.
 */
export const diseaseCategories = [
  { slug: "anemia", label: "Anemia", match: ["hemoglobin", "blood count", "iron", "ferritin", "rbc", "cbc"] },
  { slug: "diabetes", label: "Diabetes", match: ["sugar", "glucose", "hba1c", "insulin", "diabet"] },
  { slug: "heart", label: "Heart", match: ["lipid", "cholesterol", "triglyceride", "cardiac", "troponin", "ecg", "homocysteine"] },
  { slug: "thyroid", label: "Thyroid", match: ["thyroid", "tsh", "t3", "t4"] },
  { slug: "kidney", label: "Kidney", match: ["kidney", "creatinine", "urea", "urine", "electrolyte", "uric"] },
  { slug: "liver", label: "Liver", match: ["liver", "bilirubin", "sgpt", "sgot", "alkaline", "albumin", "hepat"] },
  { slug: "bone", label: "Bone", match: ["calcium", "vitamin d", "phosphor", "bone", "alkaline"] },
  { slug: "fever", label: "Fever", match: ["dengue", "malaria", "widal", "typhoid", "esr", "crp", "culture"] },
  { slug: "cancer", label: "Cancer", match: ["psa", "marker", "biopsy", "histopath", "cytolog", "ca-125", "cea"] },
  { slug: "gut-health", label: "Gut health", match: ["stool", "amylase", "lipase", "h. pylori", "pylori", "occult"] },
];

/** Facility photographs shown on /gallery. */
export const galleryItems = [
  {
    id: "G01",
    title: "Reception and sample collection",
    imageUrl: "/images/gallery/9e641ac2-a36c-4939-93e4-514b0861ffe6.jpg",
  },
  {
    id: "G02",
    title: "Processing floor",
    imageUrl: "/images/home/stats-image.jpg",
  },
  {
    id: "G03",
    title: "Analyser bay",
    imageUrl: "/images/home/abouthomepage/pathlab2.jpg",
  },
  {
    id: "G04",
    title: "Main laboratory",
    imageUrl: "/images/home/abouthomepage/pathlab1.jpg",
  },
  {
    id: "G05",
    title: "Home collection kit",
    imageUrl: "/images/home/home-collection.png",
  },
];

/** Options for the quick booking form. */
export const bookableTests = [
  { id: "T001", name: "Complete Blood Count", price: 350 },
  { id: "T014", name: "Thyroid Profile (T3 T4 TSH)", price: 750 },
  { id: "T021", name: "Lipid Profile", price: 800 },
  { id: "T033", name: "Kidney Function Test", price: 900 },
  { id: "T040", name: "Liver Function Test", price: 950 },
  { id: "T052", name: "HbA1c", price: 600 },
  { id: "T061", name: "Vitamin D (25-OH)", price: 1500 },
  { id: "T070", name: "Vitamin B12", price: 1200 },
  { id: "P001", name: "Full Body Checkup (84 parameters)", price: 3800 },
  { id: "P002", name: "Diabetes Care Panel", price: 1650 },
];
