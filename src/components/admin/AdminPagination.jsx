"use client";

export default function AdminPagination({
  page,
  pageSize,
  total,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  if (total <= pageSize) {
    return total > 0 ? (
      <p className="mt-4 text-xs text-slate-500">
        Showing {total} item{total === 1 ? "" : "s"}
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

  return (
    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white disabled:opacity-40 hover:border-sky-300 hover:text-sky-700"
        >
          Prev
        </button>
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`e-${idx}`} className="px-1 text-slate-400 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-8 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                p === safePage
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-700"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white disabled:opacity-40 hover:border-sky-300 hover:text-sky-700"
        >
          Next
        </button>
      </div>
    </div>
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
