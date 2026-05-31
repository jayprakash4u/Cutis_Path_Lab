"use client";

import { 
  BloodTestsIcon, 
  UrineTestsIcon, 
  StoolTestsIcon, 
  ClinicalBiochemistryIcon,
  MicrobiologyTestsIcon,
  HistopathologyIcon,
  CytologyIcon,
  HormoneTestingIcon,
  DiabetesTestingIcon,
  ThyroidTestingIcon,
  LipidProfileIcon,
  LiverFunctionIcon,
  KidneyFunctionIcon,
  VitaminTestsIcon,
  AllergyTestingIcon,
  CancerMarkerIcon,
  GeneticTestingIcon,
  PreventiveHealthIcon,
  FullBodyCheckupIcon,
  HomeSampleCollectionIcon,
} from "@/data/icons/PathologyIcons.jsx";

const serviceList = [
  { name: "Blood Tests", description: "Complete blood count analysis", IconComponent: BloodTestsIcon },
  { name: "Urine Tests", description: "Urine analysis & culture", IconComponent: UrineTestsIcon },
  { name: "Stool Tests", description: "Stool examination", IconComponent: StoolTestsIcon },
  { name: "Biochemistry", description: "Biochemical analysis", IconComponent: ClinicalBiochemistryIcon },
  { name: "Microbiology", description: "Infection detection", IconComponent: MicrobiologyTestsIcon },
  { name: "Histopathology", description: "Tissue examination", IconComponent: HistopathologyIcon },
  { name: "Cytology", description: "Cell analysis", IconComponent: CytologyIcon },
  { name: "Hormone Testing", description: "Hormone level tests", IconComponent: HormoneTestingIcon },
  { name: "Diabetes Testing", description: "Blood sugar tests", IconComponent: DiabetesTestingIcon },
  { name: "Thyroid Testing", description: "Thyroid function tests", IconComponent: ThyroidTestingIcon },
  { name: "Lipid Profile", description: "Cholesterol tests", IconComponent: LipidProfileIcon },
  { name: "Liver Function", description: "Liver health check", IconComponent: LiverFunctionIcon },
  { name: "Kidney Function", description: "Kidney health check", IconComponent: KidneyFunctionIcon },
  { name: "Vitamin Tests", description: "Vitamin level tests", IconComponent: VitaminTestsIcon },
  { name: "Allergy Testing", description: "Allergen detection", IconComponent: AllergyTestingIcon },
  { name: "Cancer Markers", description: "Cancer screening", IconComponent: CancerMarkerIcon },
  { name: "Genetic Testing", description: "DNA analysis", IconComponent: GeneticTestingIcon },
  { name: "Preventive Checkup", description: "Full health check", IconComponent: PreventiveHealthIcon },
  { name: "Full Body Checkup", description: "Complete package", IconComponent: FullBodyCheckupIcon },
  { name: "Home Collection", description: "Free home service", IconComponent: HomeSampleCollectionIcon },
];

export default function ServicesGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="relative mb-8 md:mb-10">
          <div className="absolute top-0 left-0">
            <div className="bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
              <h2 className="text-lg md:text-xl font-bold text-white">Our Services</h2>
            </div>
          </div>
          <div className="pt-12">
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              We offer comprehensive pathology and diagnostic services including blood tests, urine tests, histopathology, genetic testing, and more.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mt-6 md:mt-10">
          {serviceList.map((service) => {
            const IconComponent = service.IconComponent;
            return (
              <div 
                key={service.name}
                className="flex flex-col items-center p-3 md:p-6 bg-white rounded-md border border-slate-200 border-t-4 border-t-[#FF6B6B] hover:border-[#FF6B6B] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-2 md:mb-4">
                  <IconComponent size={32} className="md:w-14 md:h-14" />
                </div>
                <h3 className="text-[10px] md:text-base font-semibold text-slate-800 text-center mb-1 md:mb-2 group-hover:text-[#FF6B6B] transition-colors">
                  {service.name}
                </h3>
                <p className="text-[9px] md:text-sm text-slate-500 text-center mb-2 md:mb-4">{service.description}</p>
                <button 
                  className="px-3 md:px-5 py-1 md:py-2.5 text-[9px] md:text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all duration-300"
                >
                  Know More <span className="text-[#FF6B6B] ml-1">{'>>'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}