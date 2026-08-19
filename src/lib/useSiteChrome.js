"use client";

import { useEffect, useState } from "react";

/**
 * The header strip and the footer are edited on separate admin screens and
 * stored in separate tables, so each has its own endpoint and its own defaults.
 *
 * Those defaults are the copy the components used to hard-code, and they are
 * the initial state rather than a loading placeholder: the first paint (and the
 * server-rendered HTML) matches what the site showed before, then the saved
 * values swap in. Nothing flashes empty, and a database outage degrades to the
 * old copy instead of a blank bar.
 */
export const HEADER_DEFAULTS = {
  brandName: "Cutis Path Lab",
  region: "Kathmandu, Bagmati, Nepal",
  phone: "+977 986-1848382",
  email: "info@cutispathlab.com",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  xUrl: "https://twitter.com",
  whatsappUrl: "https://wa.me/9779861848382",
  isActive: true,
};

export const FOOTER_DEFAULTS = {
  brandName: "Cutis Path Lab",
  tagline:
    "Accurate diagnostics, clear reports, and reliable pathology services for patients and partner clinicians across Kathmandu.",
  address: "Mid-Baneshwor, Opposite to Ratna Rajya School, Kathmandu",
  phone: "+977 986-1848382",
  email: "info@cutispathlab.com",
  hours: "Sat – Thu · 10:00 – 18:00",
  note: "Pathology lab · Kathmandu, Nepal",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  whatsappUrl: "https://wa.me/9779861848382",
};

/** `tel:` needs the digits, not the display formatting. */
export function telHref(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export function mailHref(email) {
  return email ? `mailto:${email}` : "#";
}

/* Header and footer mount on every page, so each response is cached at module
   level and concurrent callers share one request. */
const cache = new Map();
const inFlight = new Map();

function merge(defaults, data) {
  const merged = { ...defaults };
  for (const [key, value] of Object.entries(data || {})) {
    if (value !== null && value !== undefined && value !== "") merged[key] = value;
  }
  // A false flag is meaningful — the loop above skips only blanks, not booleans.
  if (data && data.isActive === false) merged.isActive = false;
  return merged;
}

function load(url, defaults) {
  if (cache.has(url)) return Promise.resolve(cache.get(url));
  if (!inFlight.has(url)) {
    inFlight.set(
      url,
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (!json?.success) throw new Error(json?.message || "Failed to load");
          const merged = merge(defaults, json.data);
          cache.set(url, merged);
          return merged;
        })
        .catch(() => defaults)
        .finally(() => inFlight.delete(url)),
    );
  }
  return inFlight.get(url);
}

function useSiteSettings(url, defaults) {
  const [settings, setSettings] = useState(cache.get(url) || defaults);

  useEffect(() => {
    let cancelled = false;
    load(url, defaults).then((data) => {
      if (!cancelled) setSettings(data);
    });
    return () => {
      cancelled = true;
    };
  }, [url, defaults]);

  return settings;
}

export function useSiteHeader() {
  return useSiteSettings("/api/site-header", HEADER_DEFAULTS);
}

export function useSiteFooter() {
  return useSiteSettings("/api/site-footer", FOOTER_DEFAULTS);
}
