import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  optionalEmailSchema,
  optionalText,
  personNamePartSchema,
  phoneSchema,
} from "./common";

export const BOOKING_STATUSES = /** @type {const} */ ([
  "pending",
  "confirmed",
  "done",
  "cancelled",
]);

const idOrNull = z
  .union([z.string().trim().min(1).max(50), z.null(), z.literal("")])
  .transform((v) => (v === "" || v == null ? null : v));

/**
 * API create booking payload (POST /api/bookings)
 */
export const bookingCreateSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    email: optionalEmailSchema.default(""),
    address: optionalText(500, "address").default(""),
    preferredDate: z
      .string()
      .trim()
      .min(1, "Please choose a preferred date")
      .max(50, "Please choose a valid date"),
    preferredTime: z
      .string()
      .trim()
      .min(1, "Please select a preferred time")
      .max(50, "Please select a valid time"),
    notes: optionalText(4000, "notes").default(""),
    testId: idOrNull.optional().default(null),
    packageId: idOrNull.optional().default(null),
    offerId: idOrNull.optional().default(null),
  })
  .superRefine((data, ctx) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(`${data.preferredDate}T00:00:00`);
      if (Number.isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferredDate"],
          message: "Please choose a valid date",
        });
      } else if (d < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferredDate"],
          message: "Please choose today or a future date",
        });
      }
    }
  });

/**
 * Multi-step book page — personal details (step 2)
 */
export const bookingDetailsSchema = z.object({
  firstName: personNamePartSchema("first name"),
  lastName: personNamePartSchema("last name"),
  email: emailSchema,
  phone: phoneSchema,
  address: optionalText(500, "address"),
});

/**
 * Multi-step book page — schedule (step 3)
 */
export const bookingScheduleSchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Please choose a preferred date")
    .refine((v) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(`${v}T00:00:00`);
      return !Number.isNaN(d.getTime()) && d >= today;
    }, "Please choose today or a future date"),
  time: z
    .string()
    .trim()
    .min(1, "Please select a preferred time")
    .max(50, "Please select a valid time"),
  notes: optionalText(2000, "notes"),
});

/**
 * Quick forms (homepage, package, offer) — single form
 */
export const bookingQuickSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  address: optionalText(500, "address"),
  date: z
    .string()
    .trim()
    .min(1, "Please choose a preferred date")
    .refine((v) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(`${v}T00:00:00`);
      return !Number.isNaN(d.getTime()) && d >= today;
    }, "Please choose today or a future date"),
  time: z.string().trim().min(1, "Please select a preferred time"),
  test: optionalText(100, "test").optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES, {
    errorMap: () => ({
      message: "Please choose a valid booking status",
    }),
  }),
});

/**
 * Build API payload from multi-step wizard form.
 */
export function buildBookingPayloadFromWizard({ formData, selectedTests }) {
  const details = bookingDetailsSchema.parse(formData);
  const schedule = bookingScheduleSchema.parse(formData);
  const testNames = selectedTests.map((t) => t.name).join(", ");
  return bookingCreateSchema.parse({
    name: `${details.firstName} ${details.lastName}`.trim(),
    phone: details.phone,
    email: details.email,
    address: details.address || "",
    preferredDate: schedule.date,
    preferredTime: schedule.time,
    testId: selectedTests[0]?.id || null,
    notes: [
      testNames ? `Tests: ${testNames}` : "",
      schedule.notes ? `Notes: ${schedule.notes}` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  });
}
