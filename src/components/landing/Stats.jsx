const steps = [
  {
    number: "01",
    color: "#FF6B6B",
    title: "Expert Team",
    desc: "Our team consists of highly skilled & experienced pathologists",
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#0ea5e9">
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
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#0ea5e9">
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
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#0ea5e9">
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
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#0ea5e9">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#0ea5e9" strokeWidth="1.5" fill="none"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#0ea5e9" strokeWidth="1.5" fill="none"/>
      </svg>
    )
  }
];

const StepCard = ({ number, color, title, desc, icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', background: '#fff',
    borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
    overflow: 'hidden', marginBottom: 18, minHeight: 80,
  }}>
    <div style={{
      background: color, minWidth: 120, height: 80,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center',
      clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)',
      flexShrink: 0,
    }}>
      <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>{number}</span>
    </div>

    <div style={{ flex: 1, padding: '12px 16px' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 5 }}>{title}</h3>
      <p style={{ fontSize: 11, color: '#999', lineHeight: 1.6 }}>{desc}</p>
    </div>

    <div style={{ padding: '0 20px', flexShrink: 0 }}>
      {icon(color)}
    </div>
  </div>
);

export default function Stats() {
  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
            Why to Choose Cutis Path Lab
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96">
            <img 
              src="/images/home/stats-image.jpg" 
              alt="LifeLine Lab Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm sm:text-base font-medium">Best Pathology Lab in town</p>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: 580 }}>
            {steps.map((s, i) => <StepCard key={i} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}