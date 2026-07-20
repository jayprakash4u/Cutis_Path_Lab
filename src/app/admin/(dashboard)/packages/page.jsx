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
  code: "",
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  description: "",
  imageUrl: "",
  reportsTime: "24-48 hrs",
  fasting: "10-12 hrs",
  sampleType: "Blood",
  includesText: "",
};

export default function AdminPackagesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      const json = await adminFetch("/api/packages");
      setRows(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load packages");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      code: p.code || "",
      name: p.name || "",
      category: p.category || "",
      price: p.price ?? "",
      originalPrice: p.originalPrice ?? "",
      description: p.description || "",
      imageUrl: p.imageUrl || p.image || "",
      reportsTime: p.reportsTime || "24-48 hrs",
      fasting: p.fasting || "10-12 hrs",
      sampleType: p.sampleType || "Blood",
      includesText: (p.includes || []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const includes = form.includesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        code: form.code,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice === "" ? null : Number(form.originalPrice),
        description: form.description,
        imageUrl: form.imageUrl,
        reportsTime: form.reportsTime,
        fasting: form.fasting,
        sampleType: form.sampleType,
        includes,
      };
      if (editingId) {
        await adminFetch(`/api/packages/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage("Package updated");
      } else {
        await adminFetch("/api/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Package created");
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
    if (!confirm("Delete this package?")) return;
    try {
      await adminFetch(`/api/packages/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMessage("Package deleted");
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Packages"
        description="Packages and their included tests, shown on the public packages page."
      />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <AdminCard title={editingId ? `Edit package (${editingId})` : "Add package"}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Code *"><input name="code" className={inputClass} value={form.code} onChange={onChange} /></Field>
          <Field label="Name *"><input name="name" className={inputClass} value={form.name} onChange={onChange} /></Field>
          <Field label="Category *"><input name="category" className={inputClass} value={form.category} onChange={onChange} /></Field>
          <Field label="Price *"><input name="price" type="number" className={inputClass} value={form.price} onChange={onChange} /></Field>
          <Field label="Original price"><input name="originalPrice" type="number" className={inputClass} value={form.originalPrice} onChange={onChange} /></Field>
          <Field label="Image URL"><input name="imageUrl" className={inputClass} value={form.imageUrl} onChange={onChange} /></Field>
          <Field label="Reports time"><input name="reportsTime" className={inputClass} value={form.reportsTime} onChange={onChange} /></Field>
          <Field label="Fasting"><input name="fasting" className={inputClass} value={form.fasting} onChange={onChange} /></Field>
          <Field label="Sample type"><input name="sampleType" className={inputClass} value={form.sampleType} onChange={onChange} /></Field>
          <Field label="Description"><textarea name="description" rows={3} className={inputClass} value={form.description} onChange={onChange} /></Field>
          <Field label="Includes (one test name per line)">
            <textarea name="includesText" rows={5} className={inputClass} value={form.includesText} onChange={onChange} placeholder={"RBC Count\nWBC Count\nHemoglobin"} />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <BusyButton busy={busy} onClick={save}>{editingId ? "Update package" : "Create package"}</BusyButton>
          {editingId && (
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-sm border border-slate-200">Cancel</button>
          )}
        </div>
      </AdminCard>

      <AdminCard title={`All packages (${rows.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Includes</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginate(rows, page, ADMIN_PAGE_SIZE).items.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-mono text-xs">{p.code}</td>
                  <td className="py-2 pr-3">{p.name}</td>
                  <td className="py-2 pr-3">₹{p.price}</td>
                  <td className="py-2 pr-3">{(p.includes || []).length}</td>
                  <td className="py-2 space-x-2 whitespace-nowrap">
                    <button type="button" className="text-sky-600 font-semibold" onClick={() => startEdit(p)}>Edit</button>
                    <button type="button" className="text-red-600 font-semibold" onClick={() => remove(p.id)}>Delete</button>
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
