import { NextResponse } from "next/server";

const GENERIC =
  process.env.NODE_ENV === "production"
    ? "Something went wrong. Please try again later."
    : null;

/**
 * Log server-side detail; return a safe message to clients in production.
 */
export function apiErrorResponse(error, fallback, status = 500, logLabel = "") {
  if (logLabel) {
    console.error(logLabel, error);
  } else {
    console.error(error);
  }

  const message =
    process.env.NODE_ENV === "production"
      ? GENERIC
      : error?.message || fallback;

  return NextResponse.json({ success: false, message: message || fallback }, { status });
}
