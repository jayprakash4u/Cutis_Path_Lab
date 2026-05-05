"use client";

import { useRef } from "react";
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

export default function LabTechnology() {
  const scrollRef = useRef(null);

  return (
    <section className="py-12 bg-slate-50 ">
      <div className="max-w-full mx-auto px-4">
        <div className="border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="inline-block bg-sky-600 px-4 py-2 rounded-lg">
              <h2 className="text-lg md:text-xl font-normal text-white">
                Our Lab Technology
              </h2>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="overflow-x-auto"
            style={{
              display: "flex",
              gap: 32,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {technologies.map((tech) => (
              <div 
                key={tech.id} 
                className="flex flex-col items-center flex-shrink-0"
                style={{ minWidth: "120px" }}
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                  <Image src={tech.image} alt={tech.name} fill className="object-cover" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 text-center">{tech.name}</h3>
                <p className="text-xs text-slate-500 text-center">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
