"use client";

export async function adminFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const err = new Error(json.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

export async function checkAdminSession() {
  try {
    const json = await adminFetch("/api/admin/auth");
    return json.data || null;
  } catch {
    return null;
  }
}

export async function adminLogin(username, password) {
  return adminFetch("/api/admin/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout() {
  return adminFetch("/api/admin/auth", { method: "DELETE" });
}

/** Multipart upload (do not set Content-Type — browser adds boundary). */
export async function adminUpload(url, formData) {
  const res = await fetch(url, {
    credentials: "include",
    method: "POST",
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const err = new Error(json.message || `Upload failed (${res.status})`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}
