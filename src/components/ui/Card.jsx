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
        <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
  description,
  price = null,
  badge = null,
  image = null,
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
      <div className="bg-[#FF6B6B] px-4 py-2">
        <h3 className="text-base font-medium text-white line-clamp-1">{title}</h3>
      </div>

      <div className="p-4">
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 mb-3">
            {badge}
          </span>
        )}

        {image ? (
          <div className="mb-3 rounded-lg overflow-hidden bg-slate-100 aspect-video relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        {description ? (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{description}</p>
        ) : null}

        <div className="space-y-1 mb-3 min-h-[70px]">
          {reportsTime && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Reports: {reportsTime}</span>
            </div>
          )}
          {fasting && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Fasting: {fasting}</span>
            </div>
          )}
          {sampleType && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Sample: {sampleType}</span>
            </div>
          )}
        </div>

        {includes && includes.length > 0 ? (
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">Includes:</p>
            <div className="flex flex-wrap gap-1">
              {includes.slice(0, 3).map((item, index) => (
                <span key={index} className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded">
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
          <div className="flex items-center justify-between pt-3 border-t border-sky-300">
            <span className="text-xl font-bold text-sky-600">{price}</span>
            <button
              type="button"
              onClick={handleViewDetailsClick}
              className="text-sm font-medium text-white bg-sky-600 px-3 py-1.5 rounded-md hover:bg-sky-700 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </a>
  );
};
