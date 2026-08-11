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
        <p className={`eyebrow ${onDark ? "!text-clinical-300" : ""}`}>
          {eyebrow}
        </p>
      )}

      <div
        className={`mt-2.5 flex items-center gap-4 sm:gap-5 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <h2 className={`sec-title ${onDark ? "text-white" : ""}`}>{title}</h2>
        {/* The rule picks up the accent at its start, then fades out */}
        <span
          className={`h-px flex-1 ${
            onDark
              ? "bg-gradient-to-r from-assay-400/70 via-clinical-300/35 to-transparent"
              : "bg-gradient-to-r from-clinical-500/50 via-line to-line"
          }`}
          aria-hidden="true"
        />
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {lede && (
        <p
          className={`sec-lede ${onDark ? "!text-clinical-100/85" : ""} ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
