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
} from "@/data/icons/PathologyIcons";

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
        <div className="bg-slate-50 rounded-lg shadow-sm overflow-hidden">
          <div className="relative px-8 py-8">
            <div className="absolute left-0 right-0 top-1/2 border-t border-[#FF6B6B] z-0"></div>
            <div className="relative z-10 inline-block bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Our Services
              </h2>
            </div>
          </div>
          
          <div className="px-8 pb-8">
            <p className="text-slate-600 text-sm leading-relaxed">
              We offer comprehensive pathology and diagnostic services including blood tests, urine tests, histopathology, genetic testing, and more. Our state-of-the-art laboratory ensures accurate results with quick turnaround time. With advanced technology and experienced professionals, we provide reliable diagnostics for all your healthcare needs. From routine checkups to specialized testing, our services cover a wide range of medical diagnostics to ensure you receive the best care possible.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
          {serviceList.map((service) => {
            const IconComponent = service.IconComponent;
            return (
              <div 
                key={service.name}
                className="flex flex-col items-center p-6 bg-white rounded-md border border-slate-200 border-t-4 border-t-[#FF6B6B] hover:border-[#FF6B6B] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-4">
                  <IconComponent size={56} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 text-center mb-2 group-hover:text-[#FF6B6B] transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-500 text-center mb-4">{service.description}</p>
                <button className="px-5 py-2.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all duration-300">
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