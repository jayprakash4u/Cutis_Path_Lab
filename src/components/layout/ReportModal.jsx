"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Matches the `lg:` breakpoint the navbar switches its layout at. */
const POPOVER_MQ = "(min-width: 1024px)";
const GAP_BELOW_TRIGGER = 10;
const MIN_VIEWPORT_MARGIN = 12;

const LAB_WHATSAPP = "9779861848382";
const LAB_PHONE_DISPLAY = "+977 986-1848382";
const LAB_PHONE_TEL = "+9779861848382";
const LAB_EMAIL = "info@cutispathlab.com";
const LAB_HOURS = "Sat - Thu, 10:00 - 18:00";

/** Digits only — people type +977, spaces and dashes. */
const digitsOf = (value) => String(value || "").replace(/\D/g, "");

/**
 * "Download Report" dialog for the navbar.
 *
 * The nav button used to link to /download-report, which was never built, so it
 * 404'd. There is no reports table yet either — nothing in the schema stores a
 * patient's PDF — so this collects the mobile number the report is filed under
 * and hands off to the lab on WhatsApp rather than pretending to look one up.
 *
 * When a real lookup exists, only `handleSubmit` needs to change: swap the
 * WhatsApp handoff for a fetch and render the result in the success branch.
 *
 * Mounted only while open (the navbar guards it), so these useState
 * initialisers double as the reset — a previous request is never still on
 * screen the next time it opens, without an effect that resets state on a prop
 * change.
 */
export default function ReportModal({ onClose, anchorRef }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const errorId = useId();

  /*
    `onClose` is typically an inline arrow from the navbar, so it changes
    identity on every render. Keying this effect on it would tear the listener
    down and re-run the focus logic after each keystroke — the same bug that hit
    AdminModal, where a field dropped focus after one character.
  */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  /*
    Pins the panel directly under the Report button from lg up. Written to
    `style` rather than held in state: this is a DOM write, so it needs no
    re-render, and reading a rect into state inside an effect is the cascading
    -render pattern ESLint rejects.

    Below lg the trigger lives inside the mobile drawer, which has already
    closed by the time this opens — there is nothing to anchor to, so the
    inline values are cleared and the CSS bottom-sheet rules take over.
  */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const place = () => {
      const anchor = anchorRef?.current;
      if (!anchor || !window.matchMedia(POPOVER_MQ).matches) {
        panel.style.top = "";
        panel.style.right = "";
        return;
      }
      const rect = anchor.getBoundingClientRect();
      panel.style.top = `${rect.bottom + GAP_BELOW_TRIGGER}px`;
      // Right-aligned to the button, but never off the edge of the window.
      panel.style.right = `${Math.max(MIN_VIEWPORT_MARGIN, window.innerWidth - rect.right)}px`;
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [anchorRef]);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current?.();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    /*
      Sheet only. Locking the body at lg would remove the scrollbar, which
      narrows the viewport and shifts the navbar — and with it the button this
      popover was just measured against.
    */
    const isSheet = !window.matchMedia(POPOVER_MQ).matches;
    const previousOverflow = document.body.style.overflow;
    if (isSheet) document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      if (isSheet) document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
      const restore = restoreFocusRef.current;
      if (restore && typeof restore.focus === "function") restore.focus();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const digits = digitsOf(phone);
    if (!digits) {
      setError("Please enter your mobile number.");
      inputRef.current?.focus();
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setError("That doesn't look like a valid mobile number.");
      inputRef.current?.focus();
      return;
    }

    setError("");

    const lines = [
      "Hello Cutis Path Lab, I'd like to receive my test report.",
      `Mobile number: ${phone.trim()}`,
    ];
    if (name.trim()) lines.push(`Patient name: ${name.trim()}`);

    window.open(
      `https://wa.me/${LAB_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  // `document` is absent during SSR, and this dialog is client-only by nature.
  if (typeof document === "undefined") return null;

  /*
    Portalled to <body>. The navbar carries `backdrop-blur`, which makes it the
    containing block for any `position: fixed` descendant — that is what made
    the mobile drawer invisible until it was moved out of the <nav>.
  */
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/*
        Dimmed behind the sheet on phones. As a popover it's just a click
        catcher — dimming the whole page for a panel hanging off the navbar
        reads far heavier than the interaction deserves.
      */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none"
        onClick={() => closeRef.current?.()}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        /* `top`/`right` come from the layout effect at lg; below that the
           inset-x/bottom classes hold it against the bottom edge. */
        /* No `overflow-hidden` here — it would clip the caret. The corner
           rounding lives on the header band and the scroll area instead. */
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-2xl animate-report-panel lg:inset-x-auto lg:bottom-auto lg:w-[24rem] lg:max-h-[calc(100vh-11rem)] lg:rounded-2xl lg:ring-1 lg:ring-slate-900/5"
      >
        {/* Caret into the Report button — popover only */}
        <div
          className="absolute -top-1.5 right-10 hidden h-3 w-3 rotate-45 rounded-[2px] bg-brand-600 lg:block"
          aria-hidden="true"
        />
        {/* Brand band — the site's two colours, coral underline on sky */}
        <div className="relative rounded-t-2xl bg-brand-600 px-5 pb-5 pt-5 sm:px-6">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-500" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-bold text-white sm:text-xl">
                Get Your Report
              </h2>
              <p id={descId} className="mt-1 text-sm leading-relaxed text-brand-100">
                Enter the mobile number your test was registered under and we&apos;ll
                send the report to you on WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => closeRef.current?.()}
              aria-label="Close"
              className="flex-none rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                <svg className="h-7 w-7 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">WhatsApp opened</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Send the message we&apos;ve prepared and our team will reply with your
                report. If WhatsApp didn&apos;t open, call us on{" "}
                <a href={`tel:${LAB_PHONE_TEL}`} className="font-semibold text-brand-600 hover:underline">
                  {LAB_PHONE_DISPLAY}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => closeRef.current?.()}
                className="mt-5 w-full rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="report-phone" className="block text-sm font-semibold text-slate-700">
                Mobile number <span className="text-accent-500">*</span>
              </label>
              <input
                id="report-phone"
                ref={inputRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
                placeholder="98XXXXXXXX"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
                  error
                    ? "border-accent-500 focus:border-accent-500 focus:ring-accent-500/20"
                    : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/20"
                }`}
              />
              {error ? (
                <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-accent-500">
                  {error}
                </p>
              ) : null}

              <label
                htmlFor="report-name"
                className="mt-4 block text-sm font-semibold text-slate-700"
              >
                Patient name <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="report-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Helps us find your report faster"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
                </svg>
                Request on WhatsApp
              </button>

              {/* A phone in hand isn't always a phone with WhatsApp on it. */}
              <p className="mt-4 border-t border-slate-100 pt-4 text-center text-xs leading-relaxed text-slate-500">
                Prefer to call?{" "}
                <a href={`tel:${LAB_PHONE_TEL}`} className="font-semibold text-brand-600 hover:underline">
                  {LAB_PHONE_DISPLAY}
                </a>{" "}
                &middot;{" "}
                <a href={`mailto:${LAB_EMAIL}`} className="font-semibold text-brand-600 hover:underline">
                  {LAB_EMAIL}
                </a>
                <br />
                <span className="text-slate-400">{LAB_HOURS}</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
