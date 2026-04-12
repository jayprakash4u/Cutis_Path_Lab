"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const technologies = [
  { id: 1, name: "Hematology", desc: "Advanced blood analysis", image: "/images/lab-technology/hematology analyzer.jpg" },
  { id: 2, name: "Chemistry", desc: "Precision biochemistry", image: "/images/lab-technology/clinical chemistry.jpg" },
  { id: 3, name: "PCR Tech", desc: "Molecular DNA detection", image: "/images/lab-technology/PCR Technology.jpg" },
  { id: 4, name: "Immunoassay", desc: "Hormone detection", image: "/images/lab-technology/Immunoassay.jpg" },
  { id: 5, name: "Pathology", desc: "Digital tissue exam", image: "/images/lab-technology/Digital Pathology.jpg" },
  { id: 6, name: "Flow Cytometry", desc: "Cell analysis", image: "/images/lab-technology/Flow Cytometry.jpg" },
  { id: 7, name: "Microbiology", desc: "Bacterial culture", image: "/images/lab-technology/microbology.jpg" },
  { id: 8, name: "Serology", desc: "Immune testing", image: "/images/lab-technology/serology.jpg" },
  { id: 9, name: "Histopathology", desc: "Tissue analysis", image: "/images/lab-technology/histopathalogy.jpg" },
  { id: 10, name: "Genetics", desc: "DNA sequencing", image: "/images/lab-technology/genetic testing.jpg" },
  { id: 11, name: "Tumor Markers", desc: "Cancer detection", image: "/images/lab-technology/tumor markers.jpg" },
  { id: 12, name: "Hormones", desc: "Endocrine testing", image: "/images/lab-technology/hormone analysis.jpg" },
];

const VISIBLE = 6;

export default function LabTechnology() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const next = prev + VISIBLE;
        if (next >= technologies.length) {
          return 0;
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visible = technologies.slice(offset, offset + VISIBLE);

  return (
    <section className="py-8 shadow-lg shadow-slate-200/50 relative">
      <div className="absolute top-0 left-0">
        <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
          <h2 className="text-lg md:text-xl font-bold text-white">
            Our Lab Technology
          </h2>
        </div>
      </div>

      <div className="flex-1 pt-12 px-4">
          <div className="grid grid-cols-6 gap-4" key={offset}>
            {visible.map((tech) => (
              <div key={tech.id} className="flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-slate-400 shadow-md">
                  <Image src={tech.image} alt={tech.name} fill className="object-cover" />
                </div>
                <div className="bg-[#FF6B6B] px-3 py-1 rounded-full min-w-[100px]">
                  <h3 className="text-sm font-bold text-white text-center">{tech.name}</h3>
                </div>
                <p className="text-xs text-slate-600 text-center">{tech.desc}</p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
