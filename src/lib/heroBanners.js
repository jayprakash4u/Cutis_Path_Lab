import fs from "fs";
import path from "path";

/**
 * Discovers the homepage hero slides from disk.
 *
 * Server-only — imported by the homepage, which is a server component. The
 * result is passed to <Hero> as plain data, so `fs` never reaches the browser.
 *
 * Why scan instead of hardcoding paths: the banners get re-exported between
 * PNG and JPG as they are optimised, and a hardcoded extension turns into a
 * silent 404 the moment one changes — the carousel keeps rotating and simply
 * shows a blank slide, with no build error to catch it. Matching on the slide
 * number instead means the format can change freely.
 *
 * Desktop art:  public/images/banners/herohomepagebanner/<n>.<ext>
 * Phone art:    public/images/banners/mobile/homepageheromobile<n>.<ext>
 */

const DESKTOP_DIR = "images/banners/herohomepagebanner";
const MOBILE_DIR = "images/banners/mobile";
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const MOBILE_NAME = /^homepageheromobile(\d+)$/i;

/* The artwork carries its own wording; these describe it for screen readers
   and for the case where the image fails to load. */
const ALT_BY_SLIDE = {
  1: "Special care and dedicated doctors — your health, our priority",
  4: "Precision in every test, care in every result — Cutis Path Lab",
};

/* Last resort only, if the directory cannot be read at all. */
const FALLBACK = [1, 2, 3, 4, 5].map((n) => ({
  url: `/${DESKTOP_DIR}/${n}.png`,
  mobileUrl: `/${MOBILE_DIR}/homepageheromobile${n}.jpg`,
  alt: ALT_BY_SLIDE[n] || `Cutis Path Lab banner ${n}`,
}));

function readDir(dir) {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", dir));
  } catch {
    return [];
  }
}

function build() {
  const desktopBySlide = new Map();
  for (const file of readDir(DESKTOP_DIR)) {
    if (!IMAGE_EXT.test(file)) continue;
    const slide = Number(path.parse(file).name); // "2.jpg" -> 2
    if (Number.isInteger(slide) && slide > 0) desktopBySlide.set(slide, file);
  }

  const mobileBySlide = new Map();
  for (const file of readDir(MOBILE_DIR)) {
    if (!IMAGE_EXT.test(file)) continue;
    const match = MOBILE_NAME.exec(path.parse(file).name);
    if (match) mobileBySlide.set(Number(match[1]), file);
  }

  const slides = [...desktopBySlide.keys()]
    .sort((a, b) => a - b)
    .map((n) => ({
      url: `/${DESKTOP_DIR}/${desktopBySlide.get(n)}`,
      // A slide without phone art still works — it just uses the desktop file.
      mobileUrl: mobileBySlide.has(n) ? `/${MOBILE_DIR}/${mobileBySlide.get(n)}` : null,
      alt: ALT_BY_SLIDE[n] || `Cutis Path Lab banner ${n}`,
    }));

  return slides.length ? slides : FALLBACK;
}

// Cached in production, re-read every time in dev so dropping a new banner in
// shows up on refresh without restarting the server.
let cached = null;

export function getHeroBanners() {
  if (process.env.NODE_ENV !== "production") return build();
  if (!cached) cached = build();
  return cached;
}
