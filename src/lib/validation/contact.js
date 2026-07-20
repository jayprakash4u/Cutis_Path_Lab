import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  optionalText,
  personNamePartSchema,
} from "./common";

/**
 * API payload for POST /api/contact
 */
export const contactCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z.preprocess(
    (v) => (v == null ? "" : v),
    z
      .string()
      .trim()
      .refine(
        (v) => {
          if (!v) return true;
          const d = String(v).replace(/\D/g, "");
          return d.length >= 7 && d.length <= 15;
        },
        "Please enter a valid phone number",
      )
      .max(30, "Please enter a shorter phone number"),
  ),
  subject: optionalText(255, "subject").default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please write a bit more in your message")
    .max(4000, "Please shorten your message"),
});

/**
 * Contact page UI form (before composing full name / subject)
 */
export const contactFormSchema = z
  .object({
    firstName: personNamePartSchema("first name"),
    lastName: personNamePartSchema("last name"),
    email: emailSchema,
    phone: z.preprocess(
      (v) => (v == null ? "" : v),
      z
        .string()
        .trim()
        .refine(
          (v) => {
            if (!v) return true;
            const d = String(v).replace(/\D/g, "");
            return d.length >= 7 && d.length <= 15;
          },
          "Please enter a valid phone number",
        ),
    ),
    position: optionalText(100, "position").default(""),
    message: z
      .string()
      .trim()
      .min(10, "Please write a bit more in your message")
      .max(4000, "Please shorten your message"),
    requirePosition: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.requirePosition && !String(data.position || "").trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["position"],
        message: "Please select a position",
      });
    }
  });
