/**
 * Page section primitives.
 *
 * Sections should not decide their own width, vertical rhythm, or background —
 * those live here so the whole page stays on one system. A section supplies
 * content and picks a `tone`; everything else is fixed.
 */

const TONES = {
  white: "bg-white",
  tint: "bg-surface-tint",
  muted: "bg-surface-muted",
};

const SIZES = {
  // Two steps only. `compact` is for dense strips (category rails, offers).
  default: "py-12 sm:py-16 lg:py-20",
  compact: "py-8 sm:py-10 lg:py-14",
};

const WIDTHS = {
  // Contained: capped at the shell width and centred.
  shell: "mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-8",
  // Full-bleed: edge padding only, no cap. For carousels that showcase breadth.
  full: "w-full px-4 sm:px-6 lg:px-8",
};

/**
 * Faint dot grid carried by every `tint` section. Deliberately near-invisible —
 * it stops the tint reading as flat paint without becoming decoration, and
 * because it lives on the tone it can never drift between sections.
 */
function TintTexture() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(55,80,164,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/[0.07] blur-3xl"
        aria-hidden="true"
      />
    </>
  );
}

export function Section({
  tone = "white",
  size = "default",
  width = "shell",
  className = "",
  innerClassName = "",
  // Full-bleed decoration rendered behind the content and outside the width
  // cap — angled colour panels, gradients, texture.
  backdrop,
  children,
  ...props
}) {
  return (
    <section
      className={`relative w-full overflow-hidden ${TONES[tone] ?? TONES.white} ${
        SIZES[size] ?? SIZES.default
      } ${className}`}
      {...props}
    >
      {tone === "tint" && !backdrop && <TintTexture />}
      {backdrop}
      <div className={`relative ${WIDTHS[width] ?? WIDTHS.shell} ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

/**
 * The single heading pattern for every section: a small eyebrow label, one
 * large h2, and optional subcopy. `actions` renders on the right from `lg` up
 * (carousel arrows, "view all" links).
 *
 * Exactly one h2 per section — several sections previously shipped two
 * competing ones, which is why nothing lined up as you scrolled.
 */
export function SectionHeading({
  title,
  subtitle,
  actions,
  align = "left",
  // Flip the type to light for sections sitting on a dark colour panel.
  onDark = false,
  className = "",
}) {
  const centered = align === "center";

  return (
    <div
      className={`mb-8 flex flex-col gap-5 sm:mb-10 ${
        actions ? "lg:flex-row lg:items-end lg:justify-between" : ""
      } ${className}`}
    >
      <div className={centered ? "mx-auto max-w-2xl text-center" : ""}>
        {/* One heading line. The eyebrow label that used to sit above this was
            restating the title in nine of ten sections. */}
        <h2
          className={`text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl ${
            onDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h2>

        <span
          className={`mt-4 block h-1 w-12 rounded-full bg-accent-500 ${
            centered ? "mx-auto" : ""
          }`}
          aria-hidden="true"
        />

        {subtitle && (
          <p
            className={`mt-4 text-sm leading-relaxed sm:text-base ${
              onDark ? "text-brand-100/90" : "text-slate-600"
            } ${centered ? "" : "max-w-2xl"}`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

/** Shared carousel arrow so all five carousels look and behave identically. */
export function CarouselButton({ direction = "right", disabled = false, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 md:h-11 md:w-11 ${
        disabled
          ? "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
          : "border-slate-200 bg-white text-slate-500 shadow-card hover:border-brand-300 hover:text-brand-600 hover:shadow-card-hover"
      }`}
    >
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

/** Dot pager, shared by every carousel. */
export function CarouselDots({ total, activeIndex, onSelect, onDark = false, className = "" }) {
  const active = onDark ? "bg-white" : "bg-brand-600";
  const idle = onDark ? "bg-white/35 hover:bg-white/60" : "bg-slate-300 hover:bg-slate-400";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex ? `w-8 ${active}` : `w-2 ${idle}`
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
