import { randomUUID } from "crypto";
import { sqlExec } from "../src/lib/sqlserver.js";

const doctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    hospital: "City Heart Hospital",
    quote:
      "Cutis Path Lab delivers precise cardiac markers and lipid profiles with exceptional turnaround. I confidently refer all my patients for diagnostics.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    sortOrder: 0,
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Gynecologist",
    hospital: "Women Care Medical Center",
    quote:
      "From prenatal screening to hormone panels, their reports are accurate and timely. A trusted partner for women's health diagnostics.",
    imageUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    sortOrder: 1,
  },
  {
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    hospital: "Bone & Joint Institute",
    quote:
      "Bone density scans and inflammatory markers from Cutis Path Lab help me plan surgeries with confidence. Highly professional team.",
    imageUrl:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    sortOrder: 2,
  },
  {
    name: "Dr. Sunita Devi",
    specialization: "Pediatrician",
    hospital: "Children's Health Center",
    quote:
      "Gentle sample collection and reliable pediatric test results make Cutis Path Lab my go-to lab for young patients and their families.",
    imageUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    sortOrder: 3,
  },
  {
    name: "Dr. Mahesh Gupta",
    specialization: "Neurologist",
    hospital: "Brain & Spine Clinic",
    quote:
      "Advanced neuro-diagnostic testing with clear, detailed reports. Cutis Path Lab supports my clinical decisions every day.",
    imageUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    sortOrder: 4,
  },
  {
    name: "Dr. Anjali Singh",
    specialization: "Dermatologist",
    hospital: "Skin Care Institute",
    quote:
      "Allergy panels, biopsy pathology, and skin-related tests are handled with great care. I recommend them to all my patients.",
    imageUrl:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
    sortOrder: 5,
  },
  {
    name: "Dr. Vikram Joshi",
    specialization: "Gastroenterologist",
    hospital: "Digestive Health Center",
    quote:
      "From liver function to stool analysis, their gastroenterology panels are comprehensive and consistently accurate.",
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
    sortOrder: 6,
  },
  {
    name: "Dr. Meera Nair",
    specialization: "Endocrinologist",
    hospital: "Diabetes & Hormone Clinic",
    quote:
      "Hormone assays and diabetes monitoring from Cutis Path Lab are reliable. My patients appreciate the home collection service.",
    imageUrl:
      "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop",
    sortOrder: 7,
  },
  {
    name: "Dr. Suresh Reddy",
    specialization: "Pulmonologist",
    hospital: "Respiratory Care Center",
    quote:
      "Pulmonary function and sputum culture results arrive quickly, helping me treat respiratory conditions without delay.",
    imageUrl:
      "https://images.unsplash.com/photo-1612349316228-5942a9b489c4?w=400&h=400&fit=crop",
    sortOrder: 8,
  },
  {
    name: "Dr. Kavita Mishra",
    specialization: "Oncologist",
    hospital: "Cancer Care Hospital",
    quote:
      "Tumor markers and molecular diagnostics from Cutis Path Lab are critical to our oncology treatment plans. Truly dependable.",
    imageUrl:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop",
    sortOrder: 9,
  },
];

function esc(value) {
  if (value == null) return "NULL";
  return `N'${String(value).replace(/'/g, "''")}'`;
}

for (const d of doctors) {
  const id = randomUUID();
  await sqlExec(`
    INSERT INTO dbo.ReferralDoctor
      (id, name, specialization, hospital, quote, imageUrl, isActive, sortOrder)
    VALUES
      (${esc(id)}, ${esc(d.name)}, ${esc(d.specialization)}, ${esc(d.hospital)},
       ${esc(d.quote)}, ${esc(d.imageUrl)}, 1, ${d.sortOrder});
  `);
  console.log("Added:", d.name);
}

console.log(`Seeded ${doctors.length} referral doctors.`);
