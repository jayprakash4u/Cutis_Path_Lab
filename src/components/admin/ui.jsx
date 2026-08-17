"use client";

import { useEffect, useState } from "react";

/* ── Page header ──────────────────────────────────────────────────── */

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="admin-animate mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="admin-eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="admin-display text-2xl sm:text-[1.75rem] text-slate-900 leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────────── */

export function AdminCard({ title, subtitle, children, actions, className = "" }) {
  return (
    <section className={`admin-panel admin-animate ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-line-soft)] px-5 py-3.5">
          <div className="min-w-0">
            {title ? (
              <h2 className="admin-display truncate text-[0.95rem] text-slate-900">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ── Form field ───────────────────────────────────────────────────── */

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export const inputClass = "admin-input";

/* ── Buttons ──────────────────────────────────────────────────────── */

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Keeps its label while working — swapping the text for "Please wait…" hid
 * which action was in flight.
 */
export function BusyButton({ busy, children, className = "", variant = "primary", ...props }) {
  const base =
    variant === "ghost"
      ? "admin-btn-ghost"
      : variant === "danger"
        ? "admin-btn-danger"
        : "admin-btn-primary";

  return (
    <button
      type="button"
      disabled={busy || props.disabled}
      aria-busy={busy || undefined}
      className={`${base} ${className}`}
      {...props}
    >
      {busy ? <Spinner /> : null}
      {children}
    </button>
  );
}

/* ── Feedback ─────────────────────────────────────────────────────── */

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="admin-note admin-note--error admin-animate mb-4" role="alert">
      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v5a1 1 0 11-2 0V5zm1 10a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

/** Confirmations clear themselves — a stale "Saved" banner misreports state. */
export function SuccessBox({ message, timeout = 4000 }) {
  const [dismissed, setDismissed] = useState(false);
  const [seen, setSeen] = useState(message);

  // Reset on a new message by adjusting state during render, which avoids the
  // extra commit an effect would cause.
  if (message !== seen) {
    setSeen(message);
    setDismissed(false);
  }

  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => setDismissed(true), timeout);
    return () => clearTimeout(t);
  }, [message, timeout]);

  if (!message || dismissed) return null;

  return (
    <div className="admin-note admin-note--success admin-animate mb-4" role="status">
      <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

/* ── Status ───────────────────────────────────────────────────────── */

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  done: "Done",
  cancelled: "Cancelled",
};

export function StatusPill({ status }) {
  const key = STATUS_LABEL[status] ? status : "pending";
  return <span className={`admin-pill admin-pill--${key}`}>{STATUS_LABEL[key]}</span>;
}

/* ── Empty state ──────────────────────────────────────────────────── */

export function EmptyState({ title, body, action }) {
  return (
    <div className="admin-empty">
      <span className="admin-empty__icon" aria-hidden="true">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 7h16M4 12h16M4 17h9" strokeLinecap="round" />
        </svg>
      </span>
      <p className="admin-empty__title">{title}</p>
      {body ? <p className="admin-empty__body">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* ── Loading ──────────────────────────────────────────────────────── */

export function Skeleton({ className = "" }) {
  return <span className={`admin-skeleton block ${className}`} aria-hidden="true" />;
}

/** Placeholder rows that match the table's rhythm, so nothing jumps on load. */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-3 border-b border-[var(--admin-line-soft)] pb-3 last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className={`h-4 ${c === 0 ? "w-3/4" : "w-1/2"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Identifiers ──────────────────────────────────────────────────── */

/** Phone numbers, IDs, dates — tabular figures so columns line up. */
export function Mono({ children, className = "" }) {
  return <span className={`admin-mono ${className}`}>{children}</span>;
}
