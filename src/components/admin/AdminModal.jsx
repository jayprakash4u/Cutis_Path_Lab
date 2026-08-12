"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Form dialog for the admin console.
 *
 * Rendered in a portal so the shell's `overflow-hidden` grid can't clip it,
 * with the header and footer pinned and only the form body scrolling — long
 * forms otherwise push the save button off-screen.
 */
export default function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "lg",
}) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Escape to close, Tab cycles inside the dialog.
  useEffect(() => {
    if (!open) return undefined;

    restoreFocusRef.current = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the first real control rather than the close button.
    const raf = requestAnimationFrame(() => {
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      const target =
        panelRef.current?.querySelector("[data-autofocus]") ||
        (nodes && nodes.length > 1 ? nodes[1] : nodes?.[0]);
      target?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(raf);
      const restore = restoreFocusRef.current;
      if (restore && typeof restore.focus === "function") restore.focus();
    };
  }, [open, close]);

  if (!mounted || !open) return null;

  const maxWidth = { sm: "28rem", md: "36rem", lg: "48rem", xl: "62rem" }[size] || "48rem";

  // Mount inside .admin-app so design tokens and the next/font variables,
  // which are scoped to that element, still apply.
  const host = document.querySelector(".admin-app") || document.body;

  return createPortal(
    <div className="admin-modal" role="presentation">
      <div className="admin-modal__scrim" onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="admin-modal__panel"
        style={{ maxWidth }}
      >
        <header className="admin-modal__head">
          <div className="min-w-0">
            <h2 id={titleId} className="admin-display truncate text-base text-slate-900">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-0.5 text-xs text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            className="admin-modal__close"
            aria-label="Close dialog"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="admin-modal__body">{children}</div>

        {footer ? <footer className="admin-modal__foot">{footer}</footer> : null}
      </div>
    </div>,
    host,
  );
}

/** Destructive confirmation, so delete actions stop using window.confirm. */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = "Are you sure?",
  body,
  confirmLabel = "Delete",
  busy = false,
}) {
  return (
    <AdminModal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="admin-btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn-danger"
            onClick={onConfirm}
            disabled={busy}
            data-autofocus
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-600">
        {body || "This can't be undone."}
      </p>
    </AdminModal>
  );
}
