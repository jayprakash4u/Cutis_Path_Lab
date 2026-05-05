"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const scrollRef = useRef(null);

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-slate-50 relative shadow-lg shadow-slate-200/50">
      <div className="absolute top-0 left-0">
        <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
          <h2 className="text-lg md:text-xl font-bold text-white">
            Test by Disease Categories
          </h2>
        </div>
      </div>

      <div className="w-full pt-12">
        <div 
          ref={scrollRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "20px 24px",
            background: "#f8fafc",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            width: "100%",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {categories.map((cat, index) => (
            <Link 
              href={`/tests?category=${cat.slug}`}
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                flexShrink: 0,
                textDecoration: "none",
                marginRight: 24,
              }}
            >
              <div style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 1,
                overflow: "hidden",
              }}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={64}
                  height={64}
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div style={{
                background: "#FF6B6B",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                padding: "0 16px 0 20px",
                height: 44,
                display: "flex",
                alignItems: "center",
                borderRadius: "0 10px 10px 0",
                marginLeft: -10,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#FF6B6B"}
              >
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


