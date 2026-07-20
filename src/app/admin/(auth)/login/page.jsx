"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminClient";
import AdminLogo from "@/components/admin/AdminLogo";
import { ErrorBox, Field, inputClass } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin(username.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
      <div className="min-h-screen grid lg:grid-cols-2">
        <section className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-sky-500 text-white">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&h=1800&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-sky-800/35 to-sky-700/20" />

          <div className="relative z-10">
            <div className="inline-flex items-center rounded-2xl bg-white px-4 py-3 mb-10 shadow-sm">
              <AdminLogo href={null} size="lg" priority />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100 mb-4">
              Laboratory operations
            </p>
            <h1 className="admin-display text-4xl xl:text-5xl leading-[1.1] max-w-md">
              Staff workspace for bookings and catalog
            </h1>
            <p className="mt-5 text-sky-50/90 text-base leading-relaxed max-w-sm">
              Confirm appointments, update offers, and keep tests current — same brand as the
              public site.
            </p>
          </div>

          <p className="relative z-10 text-xs text-sky-100/80 tracking-wide">
            Staff access only · Secure session
          </p>
        </section>

        <section className="flex items-center justify-center px-4 py-12 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="admin-panel admin-animate w-full max-w-md p-7 sm:p-9"
          >
            <div className="mb-8">
              <div className="mb-5">
                <AdminLogo href="/" size="lg" priority />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 mb-2">
                Admin sign in
              </p>
              <h2 className="admin-display text-3xl text-slate-900 mb-2">Welcome back</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Use your admin credentials to open the operations desk.
              </p>
            </div>

            <ErrorBox message={error} />

            <div className="space-y-4">
              <Field label="Username">
                <input
                  className={inputClass}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
              <button type="submit" disabled={busy} className="admin-btn-primary w-full mt-2">
                {busy ? "Signing in…" : "Enter admin"}
              </button>
            </div>
          </form>
        </section>
      </div>
  );
}
