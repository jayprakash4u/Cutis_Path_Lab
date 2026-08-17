"use client";

export default function AdminPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  if (total <= pageSize) {
    return total > 0 ? (
      <p className="mt-4 text-xs text-slate-400">
        Showing all {total} item{total === 1 ? "" : "s"}
      </p>
    ) : null;
  }

  const pages = [];
  const window = 2;
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= safePage - window && i <= safePage + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const pageButton = (active) =>
    `admin-mono min-w-[2rem] rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-[var(--admin-sky)] text-white"
        : "text-slate-600 hover:bg-[var(--admin-subtle)] hover:text-slate-900"
    }`;

  return (
    <nav
      className="mt-5 flex flex-col gap-3 border-t border-[var(--admin-line-soft)] pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-xs text-slate-500">
        <span className="admin-mono font-semibold text-slate-700">
          {from}–{to}
        </span>{" "}
        of <span className="admin-mono font-semibold text-slate-700">{total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="admin-btn-ghost !px-2.5 !py-1.5 !text-xs"
        >
          Previous
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`gap-${idx}`} className="px-1 text-xs text-slate-300">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === safePage ? "page" : undefined}
              className={pageButton(p === safePage)}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="admin-btn-ghost !px-2.5 !py-1.5 !text-xs"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export const ADMIN_PAGE_SIZE = 10;

export function paginate(items, page, pageSize = ADMIN_PAGE_SIZE) {
  const list = Array.isArray(items) ? items : [];
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    items: list.slice(start, start + pageSize),
    total: list.length,
    pageSize,
  };
}
