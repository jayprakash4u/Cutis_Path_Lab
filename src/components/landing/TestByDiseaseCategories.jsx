import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";

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
    <Section tone="tint" size="compact">
      <SectionHeading
        title="Find the right test for your condition"
        subtitle="Browse our most requested diagnostic panels by health concern."
      />

      {/*
        A grid, not a scroll strip. Ten items never overflow a desktop viewport,
        so the old horizontal rail simply ran out halfway across and left a void.
        Five per row fills the shell and wraps cleanly down to two on mobile.
      */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/tests?category=${cat.slug}`}
              className="group flex h-full items-center gap-3 rounded-full border border-slate-200 bg-white p-2 pr-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-card-hover"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FF6B6B]/25 transition-all duration-300 group-hover:ring-sky-500/40 sm:h-14 sm:w-14">
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-sky-700">
                {cat.label}
              </span>

              <svg
                className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-sky-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}


