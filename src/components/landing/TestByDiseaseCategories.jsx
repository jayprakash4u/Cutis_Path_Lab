import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  { label: "Anemia", image: "/images/disease-categories/anemia.jpg", slug: "anemia" },
  { label: "Diabetes", image: "/images/disease-categories/diabetes.jpg", slug: "diabetes" },
  { label: "Heart", image: "/images/disease-categories/heart.jpg", slug: "heart" },
  { label: "Thyroid", image: "/images/disease-categories/thyroid.jpg", slug: "thyroid" },
  { label: "Kidney", image: "/images/disease-categories/kidney.jpg", slug: "kidney" },
  { label: "Liver", image: "/images/disease-categories/liver.jpg", slug: "liver" },
  { label: "Bone", image: "/images/disease-categories/bone.jpg", slug: "bone" },
  { label: "Fever", image: "/images/disease-categories/fever.jpg", slug: "fever" },
  { label: "Cancer", image: "/images/disease-categories/cancer.jpg", slug: "cancer" },
  { label: "Gut Health", image: "/images/disease-categories/gut-health.jpg", slug: "gut-health" },
];

export default function TestByDiseaseCategories() {
  return (
    <section className="section-tight border-y border-line bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Browse by condition"
          title="Not sure which test you need?"
          lede="Start from what you are being investigated for. Each area lists the panels a clinician would usually order."
        />
      </div>

      <div className="scrollbar-hide mt-7 overflow-x-auto">
        <ul className="shell flex min-w-max items-stretch gap-3">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/tests?category=${cat.slug}`}
                className="group flex w-[9.5rem] flex-col overflow-hidden rounded-lg border border-line bg-surface transition duration-200 hover:border-clinical-200 hover:shadow-2"
              >
                <span className="relative block h-20 w-full overflow-hidden bg-surface-sunk">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="152px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-ink-800 group-hover:text-clinical-700">
                    {cat.label}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-clinical-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
