"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminClient";
import AdminLogo from "@/components/admin/AdminLogo";
import { ErrorBox } from "@/components/admin/ui";

const LAB_HERO_IMAGE = "/images/home/abouthomepage/pathlab1.jpg";

function LockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 opacity-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

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
    <div className="admin-login-page grid lg:grid-cols-2">
      {/* Left — lab hero */}
      <section className="admin-login-hero" aria-hidden={false}>
        <div
          className="admin-login-hero__bg"
          style={{ backgroundImage: `url(${LAB_HERO_IMAGE})` }}
        />
        <div className="admin-login-hero__overlay" />

        <div className="admin-login-hero__logo-wrap">
          <AdminLogo href={null} size="lg" priority />
        </div>

        <div className="admin-login-hero__content">
          <p className="admin-login-hero__eyebrow">Laboratory operations</p>
          <h1 className="admin-login-hero__title">
            Staff workspace for bookings and catalog
          </h1>
          <p className="admin-login-hero__desc">
            Confirm appointments, update offers, and keep tests current — same brand as the
            public site.
          </p>
        </div>

        <p className="admin-login-hero__footer">
          <LockIcon />
          Staff access only · Secure session
        </p>
      </section>

      {/* Right — sign-in card */}
      <section className="admin-login-form-wrap">
        <form onSubmit={handleSubmit} className="admin-login-card admin-animate">
          <div className="admin-login-card__logo">
            <AdminLogo href="/" size="lg" priority className="justify-center [&_img]:object-center" />
          </div>

          <div className="mb-7">
            <p className="admin-login-card__eyebrow">Admin sign in</p>
            <h2 className="admin-login-card__title">Welcome back</h2>
            <p className="admin-login-card__subtitle">
              Use your admin credentials to open the operations desk.
            </p>
          </div>

          <ErrorBox message={error} />

          <div className="space-y-4">
            <label className="admin-login-field">
              <span className="admin-login-field__label">Username</span>
              <input
                className="admin-login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="admin-login-field">
              <span className="admin-login-field__label">Password</span>
              <input
                type="password"
                className="admin-login-input admin-login-input--password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={busy} className="admin-login-submit">
              {busy ? "Signing in…" : "Enter admin"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
