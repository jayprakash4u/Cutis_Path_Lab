"use client";

/** Contact / info blocks (contact page). */
export const InfoCard = ({
  title,
  content,
  icon = null,
  className = "",
}) => {
  return (
    <div
      className={`flex items-start gap-4 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-body-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-small text-slate-600">{content}</p>
      </div>
    </div>
  );
};

/** Package listing card (packages page). */
export const PackageCard = ({
  title,
  price = null,
  badge = null,
  actionHref = null,
  reportsTime = null,
  fasting = null,
  sampleType = null,
  includes = null,
  onViewDetails = null,
  className = "",
}) => {
  const handleViewDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) onViewDetails();
  };

  return (
    <a
      href={actionHref}
      className={`block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="bg-accent-500 px-4 py-2">
        <h3 className="text-base font-medium text-white line-clamp-1">{title}</h3>
      </div>

      <div className="p-4">
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 mb-3">
            {badge}
          </span>
        )}

        <div className="space-y-1 mb-3 min-h-[70px]">
          {reportsTime && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-brand-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Reports: {reportsTime}</span>
            </div>
          )}
          {fasting && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-brand-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fasting: {fasting}</span>
            </div>
          )}
          {sampleType && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-brand-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Sample: {sampleType}</span>
            </div>
          )}
        </div>

        {includes && includes.length > 0 ? (
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">Includes:</p>
            <div className="flex flex-wrap gap-1">
              {includes.slice(0, 3).map((item, index) => (
                <span key={index} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
                  {item}
                </span>
              ))}
              {includes.length > 3 && (
                <span className="text-xs text-slate-500">+{includes.length - 3} more</span>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-3 min-h-[50px]" />
        )}

        {price && (
          <div className="flex items-center justify-between pt-3 border-t border-brand-300">
            <span className="text-xl font-bold text-brand-600">{price}</span>
            <button
              type="button"
              onClick={handleViewDetailsClick}
              className="text-sm font-medium text-white bg-brand-600 px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </a>
  );
};
