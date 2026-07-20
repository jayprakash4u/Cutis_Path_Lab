import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const COOKIE = "cutis_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;

  if (isProduction()) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set in production. Generate a long random string.",
    );
  }

  return process.env.ADMIN_PASSWORD || "dev-only-change-me";
}

function getAdminUser() {
  return process.env.ADMIN_USER || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(payloadB64) {
  return createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

function encodeSession(username) {
  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      exp: Date.now() + MAX_AGE_SEC * 1000,
    }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token) {
  if (!token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data?.u || !data?.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(username, password) {
  const expectedUser = getAdminUser();
  const expectedPass = getAdminPassword();
  if (!expectedPass) {
    return { ok: false, message: "Authentication is temporarily unavailable" };
  }
  if (username !== expectedUser || password !== expectedPass) {
    return { ok: false, message: "Invalid username or password" };
  }
  return { ok: true };
}

export function createAdminSessionCookie(username) {
  const value = encodeSession(username);
  return {
    name: COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export function clearAdminSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export function getAdminSession(request) {
  const token = request.cookies.get(COOKIE)?.value;
  return decodeSession(token);
}

/** Returns null if authorized, otherwise a NextResponse error. */
export function requireAdmin(request) {
  if (!getAdminPassword()) {
    return NextResponse.json(
      { success: false, message: "Authentication is temporarily unavailable" },
      { status: 503 },
    );
  }
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  return null;
}

export { COOKIE as ADMIN_COOKIE_NAME };
