"use client";

export function PageHeader({ eyebrow = "Cutis Admin", title, description, actions }) {
  return (
    <div className="admin-animate mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 mb-2">
          {eyebrow}
        </p>
        <h1 className="admin-display text-3xl sm:text-4xl text-slate-900 leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({ title, children, actions, className = "" }) {
  return (
    <section className={`admin-panel admin-animate ${className}`}>
      {(title || actions) && (
        <div className="px-5 py-4 border-b border-slate-100/90 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="admin-display text-xl text-slate-900">{title}</h2>
          ) : (
            <span />
          )}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass = "admin-input";

export function BusyButton({ busy, children, className = "", ...props }) {
  return (
    <button
      type="button"
      disabled={busy || props.disabled}
      className={`admin-btn-primary ${className}`}
      {...props}
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800">
      {message}
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    confirmed: "bg-sky-50 text-sky-800 border-sky-200",
    done: "bg-emerald-50 text-emerald-800 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
        map[status] || map.pending
      }`}
    >
      {status}
    </span>
  );
}
