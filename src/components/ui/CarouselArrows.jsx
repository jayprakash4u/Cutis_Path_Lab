"use client";

/**
 * Prev/next controls for the section carousels. Sits at the top right of a
 * section header rather than floating over the card edges, so every carousel
 * on the site is driven from the same place.
 */
function Arrow({ direction, onClick, enabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-md transition-all duration-300 md:h-10 md:w-10 ${
        enabled
          ? "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg"
          : "cursor-not-allowed border-slate-100 bg-white text-slate-300 opacity-50"
      }`}
      aria-label={label}
    >
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

export default function CarouselArrows({
  scroll,
  canScrollLeft,
  canScrollRight,
  prevLabel = "Scroll left",
  nextLabel = "Scroll right",
  className = "",
}) {
  return (
    <div className={`flex shrink-0 items-center gap-2 ${className}`}>
      <Arrow
        direction="left"
        onClick={() => scroll("left")}
        enabled={canScrollLeft}
        label={prevLabel}
      />
      <Arrow
        direction="right"
        onClick={() => scroll("right")}
        enabled={canScrollRight}
        label={nextLabel}
      />
    </div>
  );
}
