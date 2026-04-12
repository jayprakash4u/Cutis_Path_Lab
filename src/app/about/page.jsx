"use client";

// ========== LAYOUT COMPONENTS ==========
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


// ========== MAIN COMPONENT ==========

export default function AboutPage() {
  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-[80px] lg:pt-[88px]">
        {/* Hero Section - Banner image */}
        <section className="relative w-full mt-7">
          <img 
            src="/images/about-poster.png" 
            alt="Cutis Path Lab About Us"
            className="w-full h-auto block"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </section>

        {/* About Us Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-50 rounded-lg shadow-sm overflow-hidden">
              <div className="relative px-8 py-8">
                <div className="absolute left-0 right-0 top-1/2 border-t-4 border-[#FF6B6B] z-0"></div>
                <div className="relative z-10 inline-block bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    About Us
                  </h2>
                </div>
              </div>
              <div className="px-8 pb-8">
                <p className="text-slate-600 text-sm leading-relaxed">
                  LifeLine Laboratory is a premier diagnostic center dedicated to providing accurate, reliable, and timely medical testing services. With over 15 years of excellence in pathology and diagnostics, we have served over 500,000 patients with commitment to quality and care. Our state-of-the-art facilities are equipped with advanced technology and staffed by a team of highly skilled professionals, including pathologists, lab technicians, and support staff. We are committed to maintaining the highest standards of quality and accuracy in all our tests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="overflow-hidden">
              <div className="px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left Side - Image */}
                  <div className="relative order-2 md:order-1">
                    <img 
                      src="/images/mission-vision.png" 
                      alt="Our Mission"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>

                  {/* Right Side - Content with Header */}
                  <div className="order-1 md:order-2">
                    <div className="relative px-4 py-3 text-right">
                      <div className="absolute left-0 right-0 top-1/2 border-t-4 border-[#FF6B6B]"></div>
                      <div className="relative z-10 inline-block bg-sky-600 px-6 py-2 rounded-tr-xl rounded-bl-xl">
                        <h2 className="text-lg md:text-xl font-bold text-white">
                          Our Mission
                        </h2>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mt-6">
                      To provide accurate, reliable, and timely diagnostic services that empower healthcare providers and patients to make informed decisions about health and wellness. We are committed to delivering exceptional patient care through advanced technology and compassionate service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="overflow-hidden">
              <div className="px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left Side - Content with Header */}
                  <div>
                    <div className="relative px-4 py-2">
                      <div className="absolute left-0 right-0 top-1/2 border-t-4 border-[#FF6B6B] z-0"></div>
                      <div className="relative z-10 inline-block bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
                        <h2 className="text-lg md:text-xl font-bold text-white">
                          Our Vision
                        </h2>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mt-4">
                      To be the leading diagnostic laboratory in the region, recognized for excellence in quality, innovation, and patient-centric care. We strive to make advanced diagnostic services accessible to everyone while maintaining the highest standards of accuracy and reliability.
                    </p>
                  </div>

                  {/* Right Side - Image */}
                  <div>
                    <img 
                      src="/images/vision-image.png" 
                      alt="Our Vision"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Achievements Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative px-8 py-8">
                <div className="absolute left-0 right-0 top-1/2 border-t-4 border-[#FF6B6B] z-0"></div>
                <div className="relative z-10 inline-block bg-sky-600 px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    Our Achievements
                  </h2>
                </div>
              </div>
              <div className="px-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { number: "15+", label: "Years of Excellence" },
                    { number: "500K+", label: "Tests Performed" },
                    { number: "50+", label: "Expert Professionals" },
                    { number: "99.9%", label: "Accuracy Rate" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">{stat.number}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: "NABL Accredited", 
                      desc: "National Accreditation Board for Testing and Calibration Laboratories",
                      icon: (
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5"/>
                          <circle cx="65" cy="65" r="50" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3"/>
                          <path d="M65 22 L92 34 L92 60 Q92 80 65 92 Q38 80 38 60 L38 34 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round"/>
                          <path d="M65 29 L86 39 L86 60 Q86 76 65 86 Q44 76 44 60 L44 39 Z" fill="#fff" stroke="#0284c7" strokeWidth="1.8" strokeLinejoin="round"/>
                          <polyline points="52,61 61,72 78,50" fill="none" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="44" y="92" width="42" height="16" rx="8" fill="#0284c7"/>
                          <text x="65" y="104" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1.5">NABL</text>
                          <circle cx="65" cy="29" r="6" fill="#FF6B6B"/>
                        </svg>
                      )
                    },
                    { 
                      title: "ISO 15189:2012", 
                      desc: "Medical laboratories — Requirements for quality and competence",
                      icon: (
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5"/>
                          <circle cx="65" cy="65" r="50" fill="none" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="4 3"/>
                          <circle cx="65" cy="58" r="22" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.2"/>
                          <circle cx="65" cy="58" r="14" fill="#fff" stroke="#0284c7" strokeWidth="2"/>
                          <rect x="62" y="32" width="6" height="8" rx="2" fill="#0284c7"/>
                          <rect x="62" y="76" width="6" height="8" rx="2" fill="#0284c7"/>
                          <rect x="34" y="55" width="8" height="6" rx="2" fill="#0284c7"/>
                          <rect x="78" y="55" width="8" height="6" rx="2" fill="#0284c7"/>
                          <rect x="42" y="38" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(45 45 42)"/>
                          <rect x="76" y="38" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(-45 79 42)"/>
                          <rect x="42" y="68" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(-45 45 72)"/>
                          <rect x="76" y="68" width="6" height="8" rx="2" fill="#0284c7" transform="rotate(45 79 72)"/>
                          <text x="65" y="63" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FF6B6B" fontFamily="Arial,sans-serif">ISO</text>
                          <rect x="38" y="88" width="54" height="16" rx="8" fill="#FF6B6B"/>
                          <text x="65" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="Arial,sans-serif" letterSpacing="1">15189:2012</text>
                        </svg>
                      )
                    },
                    { 
                      title: "CAP Certified", 
                      desc: "College of American Pathologists accreditation for excellence",
                      icon: (
<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="65" cy="65" r="60" fill="#e8f4fd" stroke="#0284c7" strokeWidth="2.5"/>
                          <circle cx="65" cy="65" r="50" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3"/>
                          <circle cx="65" cy="50" r="26" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5"/>
                          <circle cx="65" cy="50" r="19" fill="#fff" stroke="#0284c7" strokeWidth="1.8"/>
                          <text x="65" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0284c7" fontFamily="Arial,sans-serif">CAP</text>
                          <path d="M50 72 L42 95 L55 87 L60 98 L65 76Z" fill="#FF6B6B" stroke="#FF6B6B" strokeLinejoin="round"/>
                          <path d="M80 72 L88 95 L75 87 L70 98 L65 76Z" fill="#0284c7" stroke="#0284c7" strokeLinejoin="round"/>
                          <circle cx="65" cy="50" r="8" fill="#FF6B6B" opacity="0.15"/>
                          <polygon points="65,38 67.5,46 76,46 69.5,51 72,59 65,54 58,59 60.5,51 54,46 62.5,46" fill="none" stroke="#FF6B6B" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      )
                    },
                  ].map((cert, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 border-l-4 border-l-[#FF6B6B]">
                      <div className="w-32 h-32 mx-auto flex items-center justify-center mb-3">
                        {cert.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 text-center">{cert.title}</h3>
                      <p className="text-sm text-slate-600">{cert.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}