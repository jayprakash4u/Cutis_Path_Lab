import { z } from "zod";

/** Digits only length after stripping phone formatting */
export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your phone number")
  .refine((v) => {
    const d = digitsOnly(v);
    return d.length >= 7 && d.length <= 15;
  }, "Please enter a valid phone number");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address")
  .email("Please enter a valid email address")
  .max(150, "Please use a shorter email address");

export const optionalEmailSchema = z.preprocess(
  (v) => (v == null ? "" : v),
  z
    .string()
    .trim()
    .max(150, "Please use a shorter email address")
    .refine(
      (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Please enter a valid email address",
    ),
);

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(150, "Please enter a shorter name")
  .refine(
    (v) => /[A-Za-z\u00C0-\u024F\u0900-\u097F]/.test(v),
    "Please enter a valid name",
  )
  .refine((v) => !/\d/.test(v), "Name cannot contain numbers");

export const personNamePartSchema = (label) =>
  z
    .string()
    .trim()
    .min(1, `Please enter your ${label}`)
    .max(80, `Please enter a shorter ${label}`)
    .refine(
      (v) => /[A-Za-z\u00C0-\u024F\u0900-\u097F]/.test(v),
      `Please enter a valid ${label}`,
    )
    .refine(
      (v) => !/\d/.test(v),
      `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot contain numbers`,
    );

export const optionalText = (max, label = "This") =>
  z.preprocess(
    (v) => (v == null ? "" : v),
    z
      .string()
      .trim()
      .max(max, `Please shorten your ${label.toLowerCase()}`),
  );

/**
 * Flatten Zod issues into { field: message } for forms.
 */
export function zodFieldErrors(error) {
  const out = {};
  if (!error?.issues) return out;
  for (const issue of error.issues) {
    const key = issue.path?.[0] != null ? String(issue.path[0]) : "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Map API field names to multi-step wizard field names.
 */
export function mapBookingApiErrorsToWizard(errors = {}) {
  const mapped = { ...errors };
  if (errors.preferredDate && !errors.date) mapped.date = errors.preferredDate;
  if (errors.preferredTime && !errors.time) mapped.time = errors.preferredTime;
  if (errors.name) {
    if (!mapped.firstName) mapped.firstName = "Please check your name";
    if (!mapped.lastName) mapped.lastName = "Please check your name";
  }
  return mapped;
}

/**
 * Safe-parse helper returning { ok, data, errors, message }.
 */
export function parseOrErrors(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data, errors: {}, message: "" };
  }
  const errors = zodFieldErrors(result.error);
  const first = result.error.issues[0]?.message || "Please check the highlighted fields";
  return { ok: false, data: null, errors, message: first };
}
