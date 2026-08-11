/**
 * The one section header used everywhere on the site.
 *
 * A monospace eyebrow, a title, and a hairline rule that runs from the title
 * out to the edge of the container — the ruled line off a lab report. It
 * replaces the floating coloured tab that every section used to carry its
 * own version of.
 */
export default function SectionHeader({
  eyebrow,
  title,
  lede = null,
  action = null,
  align = "left",
  tone = "light",
  className = "",
}) {
  const onDark = tone === "dark";

  return (
    <header
      className={`${align === "center" ? "text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow ${onDark ? "!text-clinical-200" : ""}`}>
          {eyebrow}
        </p>
      )}

      <div
        className={`mt-2.5 flex items-center gap-4 sm:gap-5 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <h2 className={`sec-title ${onDark ? "text-white" : ""}`}>{title}</h2>
        <span
          className={`sec-rule ${onDark ? "!bg-white/20" : ""}`}
          aria-hidden="true"
        />
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {lede && (
        <p
          className={`sec-lede ${onDark ? "!text-clinical-100/80" : ""} ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
