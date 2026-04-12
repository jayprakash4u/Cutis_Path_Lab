"use client";

const teamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Chief Executive Officer & Medical Director",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    qualification: "MD, Pathology",
    experience: "15+ Years Experience",
    bio: "Dr. Sarah leads LifeLine Laboratory with a vision to provide world-class diagnostic services. With her extensive background in pathology, she ensures the highest quality standards in all our operations.",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder & Director",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    qualification: "MBA, Healthcare Management",
    experience: "20+ Years Experience",
    bio: "Michael founded LifeLine Laboratory with a mission to make quality healthcare accessible. His strategic leadership has helped grow the company to serve thousands of patients.",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 3,
    name: "Dr. Emily Roberts",
    role: "Head of Pathology",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    qualification: "MD, Clinical Pathology",
    experience: "12+ Years Experience",
    bio: "Dr. Emily oversees all pathology operations, ensuring accurate and timely test results. Her expertise in clinical pathology has been instrumental in maintaining our high standards.",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    role: "Laboratory Director",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    qualification: "PhD, Biochemistry",
    experience: "18+ Years Experience",
    bio: "Dr. James manages our state-of-the-art laboratory facilities, implementing cutting-edge technologies and quality control measures to deliver precise diagnostic results.",
    linkedin: "#",
    twitter: "#",
  },
];

export default function Team() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-white relative overflow-hidden">
      {/* Animated background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-space-2xl">
          <h2 className="text-h2 md:text-h2 lg:text-h2 font-bold text-slate-900 mb-space-md">
            Meet Our <span className="text-sky-600">Team</span>
          </h2>
          <p className="text-body text-slate-600 max-w-2xl mx-auto">
            Experienced professionals dedicated to excellence in pathology
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="text-center group"
            >
              {/* Circular Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-space-md rounded-full overflow-hidden border-4 border-sky-100 group-hover:border-sky-300 transition-all duration-300 shadow-lg shadow-sky-100/50">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="px-2">
                <h3 className="text-h4 font-bold text-slate-900 mb-space-sm">
                  {member.name}
                </h3>
                <p className="text-sky-600 font-medium text-small mb-space-md">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <a 
                    href={member.linkedin}
                    className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/30"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.twitter}
                    className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-sky-600/30"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
