"use client";

/** Contact / info blocks (contact page). */
export const InfoCard = ({ title, content, icon = null, className = "" }) => {
  return (
    <div
      className={`flex items-start gap-4 rounded-lg border border-line bg-surface p-5 transition hover:border-clinical-200 ${className}`}
    >
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-clinical-50 text-clinical-600">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-[0.9375rem] font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{content}</p>
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

  const rows = [
    ["Report", reportsTime],
    ["Fasting", fasting],
    ["Sample", sampleType],
  ].filter(([, v]) => Boolean(v));

  return (
    <a
      href={actionHref}
      className={`card card-hover flex flex-col overflow-hidden ${className}`}
    >
      <div className="border-b border-line px-4 py-3">
        {badge && <span className="chip-clinical">{badge}</span>}
        <h3
          className={`line-clamp-2 text-sm font-semibold text-ink-900 ${
            badge ? "mt-2" : ""
          }`}
        >
          {title}
        </h3>
      </div>

      {rows.length > 0 && (
        <dl className="divide-y divide-line px-4">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 py-2"
            >
              <dt className="label">{k}</dt>
              <dd className="mono text-right text-[11px] text-ink-700">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {includes && includes.length > 0 && (
        <div className="border-t border-line px-4 py-3">
          <p className="label">Includes</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {includes.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="chip-quiet !normal-case !tracking-normal"
              >
                {item}
              </span>
            ))}
            {includes.length > 3 && (
              <span className="mono text-[11px] text-ink-400">
                +{includes.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {price && (
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <span className="mono text-lg font-semibold text-ink-900">{price}</span>
          <button
            type="button"
            onClick={handleViewDetailsClick}
            className="btn-outline !px-3 !py-1.5 !text-[13px]"
          >
            View details
          </button>
        </div>
      )}
    </a>
  );
};
