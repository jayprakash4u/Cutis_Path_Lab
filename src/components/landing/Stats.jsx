const steps = [
  {
    number: "01",
    color: "#FF6B6B",
    title: "Expert Team",
    desc: "Our team consists of highly skilled & experienced pathologists",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    )
  },
  {
    number: "02",
    color: "#FF6B6B",
    title: "Accurate Reports",
    desc: "We provide accurate and reliable test reports",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M12 2C9.24 2 7 4.24 7 7c0 2.08 1.23 3.87 3 4.72V20h4v-8.28A5.003 5.003 0 0017 7c0-2.76-2.24-5-5-5z"/>
      </svg>
    )
  },
  {
    number: "03",
    color: "#FF6B6B",
    title: "24/7 Support",
    desc: "We are available 24/7 for your support",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <path d="M9 13.5c-2.5 0-7.5 1.25-7.5 3.75V19h15v-1.75C16.5 14.75 11.5 13.5 9 13.5zm8-1c2.07 0 6.25.93 6.25 2.75V17h-5v-1.75c0-.92-.38-1.77-.99-2.42.56-.1 1.1-.33 1.74-.33zM9 12a3 3 0 100-6 3 3 0 000 6zm7.5-.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
      </svg>
    )
  },
  {
    number: "04",
    color: "#FF6B6B",
    title: "Quality Assurance",
    desc: "International quality standards with NABL accreditation",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#4a9aba">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#4a9aba" strokeWidth="1.5" fill="none"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#4a9aba" strokeWidth="1.5" fill="none"/>
      </svg>
    )
  }
];

export default function Stats() {
  return (
    <section className="py-4 sm:py-6 lg:py-10 bg-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-3 sm:mb-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
            Why to Choose Cutis Path Lab
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Image - Hidden on very small screens, visible on sm+ */}
          <div className="hidden sm:block relative rounded-xl overflow-hidden h-48 sm:h-64 lg:h-96">
            <img 
              src="/images/home/stats-image.jpg" 
              alt="LifeLine Lab Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <p className="text-xs sm:text-sm md:text-base font-medium">Best Pathology Lab in town</p>
            </div>
          </div>

          {/* Cards - Stacked on mobile */}
          <div className="space-y-3 sm:space-y-4 w-full">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
                <div className="min-w-[80px] sm:min-w-[100px] md:min-w-[120px] h-16 sm:h-20 flex flex-col items-center justify-center" style={{ background: s.color, clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}>
                  <span className="text-white text-sm sm:text-lg md:text-xl font-bold">{s.number}</span>
                </div>

                <div className="flex-1 p-2 sm:p-3">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mb-0.5">{s.title}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2">{s.desc}</p>
                </div>

                <div className="p-2 sm:p-3 flex-shrink-0 hidden sm:block">
                  {s.icon(s.color)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}