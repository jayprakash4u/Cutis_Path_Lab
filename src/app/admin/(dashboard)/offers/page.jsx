"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import AdminPagination, {
  ADMIN_PAGE_SIZE,
  paginate,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  BusyButton,
  ErrorBox,
  Field,
  PageHeader,
  SuccessBox,
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      const json = await adminFetch("/api/offers?active=false");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load offers");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        setMessage("Offer updated");
      } else {
        await adminFetch("/api/offers", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Offer created");
      }
      reset();
      await load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this offer?")) return;
    try {
      await adminFetch(`/api/offers/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Offer deleted");
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Offers"
        description="Special offer cards on the homepage — toggle active when a promo ends."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit offer (${editingId})` : "Add offer"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Name *"><input name="name" className={inputClass} value={form.name} onChange={onChange} /></Field>
          <Field label="Category *"><input name="category" className={inputClass} value={form.category} onChange={onChange} /></Field>
          <Field label="Original price *"><input name="originalPrice" type="number" className={inputClass} value={form.originalPrice} onChange={onChange} /></Field>
          <Field label="Discounted price *"><input name="discountedPrice" type="number" className={inputClass} value={form.discountedPrice} onChange={onChange} /></Field>
          <Field label="Discount %"><input name="discount" type="number" className={inputClass} value={form.discount} onChange={onChange} /></Field>
          <Field label="Sort order"><input name="sortOrder" type="number" className={inputClass} value={form.sortOrder} onChange={onChange} /></Field>
          <Field label="Reports"><input name="reportsTime" className={inputClass} value={form.reportsTime} onChange={onChange} /></Field>
          <Field label="Fasting"><input name="fasting" className={inputClass} value={form.fasting} onChange={onChange} /></Field>
          <Field label="Sample"><input name="sampleType" className={inputClass} value={form.sampleType} onChange={onChange} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 self-end">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
            Active on homepage
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <BusyButton busy={busy} onClick={save}>{editingId ? "Update offer" : "Create offer"}</BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-sm border border-slate-200">Cancel</button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All offers (${rows.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Discount</th>
                <th className="py-2 pr-3">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((o) => (
                <tr key={o.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{o.name}</td>
                  <td className="py-2 pr-3">₹{o.discountedPrice} <span className="line-through text-slate-400 text-xs">₹{o.originalPrice}</span></td>
                  <td className="py-2 pr-3">{o.discount}%</td>
                  <td className="py-2 pr-3">{o.isActive === false ? "No" : "Yes"}</td>
                  <td className="py-2 space-x-2 whitespace-nowrap">
                    <button type="button" className="text-sky-600 font-semibold" onClick={() => startEdit(o)}>Edit</button>
                    <button type="button" className="text-red-600 font-semibold" onClick={() => remove(o.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination
          page={paginate(rows, page, ADMIN_PAGE_SIZE).page}
          pageSize={ADMIN_PAGE_SIZE}
          total={rows.length}
          onPageChange={setPage}
        />
      </AdminCard>
    </div>
  );
}
