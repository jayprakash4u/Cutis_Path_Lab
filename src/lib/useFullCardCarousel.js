"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export const CAROUSEL_BREAKPOINTS = {
  standard: [
    { minWidth: 1024, cards: 3 },
    { minWidth: 640, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  // Thresholds are measured against the carousel's own viewport, not the
  // window. Every section is contained, so that viewport tops out at ~1376px
  // (1440 shell − 64 padding) — no step above that can ever fire.
  compact: [
    { minWidth: 1200, cards: 4 },
    { minWidth: 900, cards: 3 },
    { minWidth: 620, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  lab: [
    { minWidth: 1200, cards: 4 },
    { minWidth: 900, cards: 3 },
    { minWidth: 620, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  testimonials: [
    { minWidth: 1024, cards: 3 },
    { minWidth: 640, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  referrals: [
    { minWidth: 1280, cards: 4 },
    { minWidth: 900, cards: 3 },
    { minWidth: 620, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
};

export function useFullCardCarousel({
  gap = 24,
  breakpoints = CAROUSEL_BREAKPOINTS.standard,
  itemCount = 0,
  deps = [],
  // Single-card (mobile) view only: how much of the next card stays on screen,
  // as a fraction of one card. 0.5 leaves half the next card visible so it is
  // obvious the row scrolls. Set to 0 for the old edge-to-edge behaviour.
  peekRatio = 0.5,
  // Advance on its own. Pauses on hover, focus and touch, when the tab is
  // hidden, and entirely for users who ask for reduced motion.
  autoPlay = false,
  autoPlayInterval = 5000,
} = {}) {
  const scrollRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [cardWidth, setCardWidth] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollAmountRef = useRef(0);
  const prevCardsPerViewRef = useRef(1);

  const getCardsForWidth = useCallback(
    (width) => {
      for (const bp of breakpoints) {
        if (width >= bp.minWidth) return bp.cards;
      }
      return 1;
    },
    [breakpoints],
  );

  const recalc = useCallback(() => {
    const viewport = viewportRef.current;
    const container = scrollRef.current;
    if (!viewport || !container) return;

    const viewportWidth = viewport.clientWidth;
    if (viewportWidth === 0) return;

    const targetCards = getCardsForWidth(viewportWidth);
    const isSingle = targetCards === 1;
    const gapTotal = gap * (targetCards - 1);

    // Single card: leave `peekRatio` of the next card showing, so
    // cardWidth + gap + cardWidth * peekRatio === viewportWidth.
    const nextCardWidth = isSingle
      ? Math.floor((viewportWidth - gap) / (1 + Math.max(0, peekRatio)))
      : Math.floor((viewportWidth - gapTotal) / targetCards);

    // One swipe advances exactly one card (or one full page on wider screens).
    // The gap has to be included or the track drifts a few px per step.
    const pageWidth = isSingle
      ? nextCardWidth + gap
      : nextCardWidth * targetCards + gapTotal;

    if (targetCards !== prevCardsPerViewRef.current) {
      prevCardsPerViewRef.current = targetCards;
      setActiveIndex(0);
      container.scrollLeft = 0;
    }

    setCardsPerView(targetCards);
    setCardWidth(nextCardWidth);
    scrollAmountRef.current = pageWidth;

    const maxScroll = Math.max(0, container.scrollWidth - viewportWidth);
    if (container.scrollLeft > maxScroll) {
      container.scrollLeft = maxScroll;
    }
  }, [gap, getCardsForWidth, peekRatio]);

  useEffect(() => {
    recalc();
  }, [recalc, ...deps]);

  useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => recalc());
      if (viewportRef.current) ro.observe(viewportRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [recalc]);

  const totalDots = Math.max(1, Math.ceil(itemCount / cardsPerView));

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !scrollAmountRef.current) return;

    // With a peek the track stops before the last card can reach the left
    // edge, so rounding never reaches the final index. Treat "scrolled to the
    // end" as the last dot explicitly.
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0 && maxScroll - el.scrollLeft <= 4) {
      setActiveIndex(totalDots - 1);
      return;
    }

    if (cardsPerView === 1) {
      const cardStep = cardWidth ? cardWidth + gap : scrollAmountRef.current;
      const index = Math.round(el.scrollLeft / cardStep);
      setActiveIndex(Math.min(Math.max(index, 0), totalDots - 1));
      return;
    }

    const page = Math.round(el.scrollLeft / scrollAmountRef.current);
    setActiveIndex(Math.min(Math.max(page, 0), totalDots - 1));
  }, [cardsPerView, cardWidth, gap, totalDots]);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = scrollAmountRef.current || el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const scrollToDot = useCallback(
    (index) => {
      const el = scrollRef.current;
      if (!el) return;

      if (cardsPerView === 1 && cardWidth) {
        el.scrollTo({
          left: index * (cardWidth + gap),
          behavior: "smooth",
        });
        return;
      }

      const amount = scrollAmountRef.current || el.clientWidth;
      el.scrollTo({
        left: index * amount,
        behavior: "smooth",
      });
    },
    [cardsPerView, cardWidth, gap],
  );

  // Pause while the reader is engaged with the track, and while the tab is
  // backgrounded — otherwise slides advance unseen and the user returns to a
  // random position.
  useEffect(() => {
    if (!autoPlay) return undefined;
    const el = viewportRef.current;
    if (!el) return undefined;

    const pause = () => setIsPaused(true);
    const resume = () => setIsPaused(false);
    const onVisibility = () => setIsPaused(document.hidden);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
      el.removeEventListener("touchstart", pause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || isPaused || totalDots <= 1) return undefined;

    // Honour the OS-level reduced-motion setting: no self-moving content.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const id = setInterval(() => {
      scrollToDot((activeIndex + 1) % totalDots);
    }, autoPlayInterval);

    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, isPaused, activeIndex, totalDots, scrollToDot]);

  const cardWidthStyle = cardWidth ? { width: `${cardWidth}px` } : undefined;

  const scrollClassName =
    cardsPerView === 1
      ? "scrollbar-hide flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
      : "scrollbar-hide flex w-full overflow-x-hidden scroll-smooth";

  const cardClassName = cardsPerView === 1 ? "shrink-0 snap-start" : "shrink-0";

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < totalDots - 1;

  return {
    scrollRef,
    viewportRef,
    activeIndex,
    cardsPerView,
    cardWidthStyle,
    scrollClassName,
    cardClassName,
    totalDots,
    handleScroll,
    scroll,
    scrollToDot,
    canScrollLeft,
    canScrollRight,
    gap,
  };
}
