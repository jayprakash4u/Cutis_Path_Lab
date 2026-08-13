"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export const CAROUSEL_BREAKPOINTS = {
  standard: [
    { minWidth: 1024, cards: 3 },
    { minWidth: 640, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  compact: [
    { minWidth: 1280, cards: 5 },
    { minWidth: 1024, cards: 4 },
    { minWidth: 640, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
  // NOTE: these minWidths are matched against the carousel's own container
  // width, not the window width. The container tops out near 1100px
  // (max-w-7xl minus the section and carousel padding), so a threshold
  // above that can never match.
  lab: [
    { minWidth: 1000, cards: 2.5 },
    { minWidth: 620, cards: 1.5 },
    { minWidth: 0, cards: 1 },
  ],
  testimonials: [
    { minWidth: 1024, cards: 3 },
    { minWidth: 640, cards: 2 },
    { minWidth: 0, cards: 1 },
  ],
};

export function useFullCardCarousel({
  gap = 24,
  breakpoints = CAROUSEL_BREAKPOINTS.standard,
  itemCount = 0,
  deps = [],
} = {}) {
  const scrollRef = useRef(null);
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [stepCards, setStepCards] = useState(1);
  const [cardWidth, setCardWidth] = useState(null);
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

    // A fractional count (e.g. 2.5) deliberately shows a partial card as a
    // scroll affordance. That changes two things: 2.5 cards have 2 visible
    // gaps rather than 1.5, and a slide advances by whole cards so the row
    // never drifts out of alignment. Integer counts keep their original math.
    const isFractional = !Number.isInteger(targetCards);
    const visibleGaps = isFractional
      ? Math.floor(targetCards)
      : targetCards - 1;
    const step = isFractional ? Math.floor(targetCards) : targetCards;

    const gapTotal = gap * visibleGaps;
    const nextCardWidth = Math.floor((viewportWidth - gapTotal) / targetCards);
    const pageWidth = isFractional
      ? step * (nextCardWidth + gap)
      : nextCardWidth * targetCards + gapTotal;

    if (targetCards !== prevCardsPerViewRef.current) {
      prevCardsPerViewRef.current = targetCards;
      setActiveIndex(0);
      container.scrollLeft = 0;
    }

    setCardsPerView(targetCards);
    setStepCards(step);
    setCardWidth(nextCardWidth);
    scrollAmountRef.current = pageWidth;

    const maxScroll = Math.max(0, container.scrollWidth - viewportWidth);
    if (container.scrollLeft > maxScroll) {
      container.scrollLeft = maxScroll;
    }
  }, [gap, getCardsForWidth]);

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

  // Dots track how far a slide advances, which is the whole-card step —
  // not the fractional number of cards on screen.
  const totalDots = Math.max(1, Math.ceil(itemCount / stepCards));

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !scrollAmountRef.current) return;

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
