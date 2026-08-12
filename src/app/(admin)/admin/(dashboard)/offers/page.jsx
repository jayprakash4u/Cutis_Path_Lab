"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminModal, { ConfirmDialog } from "@/components/admin/AdminModal";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  BusyButton,
  EmptyState,
  ErrorBox,
  Field,
  Mono,
  PageHeader,
  SuccessBox,
  TableSkeleton,
  inputClass,
} from "@/components/admin/ui";

const emptyForm = {
  name: "",
  category: "",
  originalPrice: "",
  discountedPrice: "",
  discount: "",
  reportsTime: "24 hrs",
  fasting: "10-12 hrs",
  sampleType: "Blood",
  isActive: true,
  sortOrder: "0",
};

export default function AdminOffersPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const json = await adminFetch("/api/offers?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load offers. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setFormOpen(true);
  };

  const startEdit = (o) => {
    setEditingId(o.id);
    setForm({
      name: o.name || "",
      category: o.category || "",
      originalPrice: o.originalPrice ?? "",
      discountedPrice: o.discountedPrice ?? "",
      discount: o.discount ?? "",
      reportsTime: o.reportsTime || "24 hrs",
      fasting: o.fasting || "10-12 hrs",
      sampleType: o.sampleType || "Blood",
      isActive: o.isActive !== false,
      sortOrder: String(o.sortOrder ?? 0),
    });
    setError("");
    setFormOpen(true);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        name: form.name,
        category: form.category,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        discount: form.discount === "" ? undefined : Number(form.discount),
        reportsTime: form.reportsTime,
        fasting: form.fasting,
        sampleType: form.sampleType,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await adminFetch(`/api/offers/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage(`Updated ${payload.name}`);
      } else {
        await adminFetch("/api/offers", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage(`Added ${payload.name}`);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message || "Couldn't save this offer. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await adminFetch(`/api/offers/${encodeURIComponent(confirming.id)}`, {
        method: "DELETE",
      });
      setMessage(`Deleted ${confirming.name}`);
      if (editingId === confirming.id) closeForm();
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't delete this offer. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const { items, total, page: safePage } = useMemo(
    () => paginate(rows, page, ADMIN_PAGE_SIZE),
    [rows, page],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Offers"
        description="Promo cards on the homepage. Switch an offer inactive when it ends."
        actions={
          <button type="button" className="admin-btn-primary" onClick={startCreate}>
            Add offer
          </button>
        }
      />

      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={total === 1 ? "1 offer" : `${total} offers`}>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : total === 0 ? (
          <EmptyState
            title="No offers yet"
            body="Add an offer to feature a discounted package on the homepage."
            action={
              <button type="button" className="admin-btn-primary" onClick={startCreate}>
                Add offer
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <p className="font-medium text-slate-900">{o.name}</p>
                        <p className="text-xs text-slate-500">{o.category}</p>
                      </td>
                      <td className="whitespace-nowrap">
                        <Mono className="font-medium text-slate-900">₹{o.discountedPrice}</Mono>{" "}
                        <Mono className="text-xs text-slate-400 line-through">
                          ₹{o.originalPrice}
                        </Mono>
                      </td>
                      <td>
                        <Mono>{o.discount}%</Mono>
                      </td>
                      <td>
                        {o.isActive === false ? (
                          <span className="admin-pill admin-pill--cancelled">Inactive</span>
                        ) : (
                          <span className="admin-pill admin-pill--done">Active</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-right">
                        <button
                          type="button"
                          className="admin-btn-ghost !px-2.5 !py-1 !text-xs"
                          onClick={() => startEdit(o)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="admin-btn-danger !px-2.5 !py-1 !text-xs"
                          onClick={() => setConfirming(o)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={safePage}
              pageSize={ADMIN_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminCard>

      <AdminModal
        open={formOpen}
        onClose={busy ? () => {} : closeForm}
        title={editingId ? "Edit offer" : "Add offer"}
        description="Fields marked * are required."
        footer={
          <>
            <button type="button" className="admin-btn-ghost" onClick={closeForm} disabled={busy}>
              Cancel
            </button>
            <BusyButton busy={busy} onClick={save}>
              {editingId ? "Save changes" : "Add offer"}
            </BusyButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input
              name="name"
              className={inputClass}
              value={form.name}
              onChange={onChange}
              data-autofocus
            />
          </Field>
          <Field label="Category *">
            <input
              name="category"
              className={inputClass}
              value={form.category}
              onChange={onChange}
            />
          </Field>
          <Field label="Original price *">
            <input
              name="originalPrice"
              type="number"
              className={inputClass}
              value={form.originalPrice}
              onChange={onChange}
            />
          </Field>
          <Field label="Discounted price *">
            <input
              name="discountedPrice"
              type="number"
              className={inputClass}
              value={form.discountedPrice}
              onChange={onChange}
            />
          </Field>
          <Field label="Discount %" hint="Leave blank to calculate from the prices">
            <input
              name="discount"
              type="number"
              className={inputClass}
              value={form.discount}
              onChange={onChange}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers show first">
            <input
              name="sortOrder"
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={onChange}
            />
          </Field>
          <Field label="Report time">
            <input
              name="reportsTime"
              className={inputClass}
              value={form.reportsTime}
              onChange={onChange}
            />
          </Field>
          <Field label="Fasting">
            <input
              name="fasting"
              className={inputClass}
              value={form.fasting}
              onChange={onChange}
            />
          </Field>
          <Field label="Sample type">
            <input
              name="sampleType"
              className={inputClass}
              value={form.sampleType}
              onChange={onChange}
            />
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            Show on the homepage
          </label>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onCancel={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete this offer?"
        body={
          confirming
            ? `“${confirming.name}” will stop showing on the homepage. This can't be undone.`
            : ""
        }
      />
    </div>
  );
}
