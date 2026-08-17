import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { newId, sqlExec, sqlOne, sqlQuery } from "@/lib/mysql";
import {
  sendBookingNotification,
  sendPatientBookingConfirmation,
} from "@/lib/mail";
import { requireAdmin } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";
import { bookingCreateSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

/** `table` is a fixed literal from this module, never user input. */
async function missingFk(table, id) {
  if (!id) return false;
  const row = await sqlOne(`SELECT \`id\` FROM \`${table}\` WHERE \`id\` = ? LIMIT 1`, [id]);
  return row == null;
}

export async function POST(request) {
  const limited = rateLimit(request, {
    key: "booking",
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = await request.json();

    if (body._honeypot || body.website) {
      return NextResponse.json(
        { success: true, message: "Booking saved", data: { id: "ok" } },
        { status: 201 },
      );
    }

    // Normalize aliases from older clients
    const incoming = {
      name: body.name,
      phone: body.phone,
      email: body.email ?? "",
      address: body.address ?? "",
      preferredDate: body.preferredDate ?? body.date ?? "",
      preferredTime: body.preferredTime ?? body.time ?? "",
      notes: body.notes ?? body.test ?? "",
      testId: body.testId ?? null,
      packageId: body.packageId ?? null,
      offerId: body.offerId ?? null,
    };

    const parsed = parseOrErrors(bookingCreateSchema, incoming);
    if (!parsed.ok) {
      return validationError({ message: parsed.message, errors: parsed.errors });
    }

    const data = parsed.data;

    const fkErrors = {};
    if (await missingFk("Test", data.testId)) {
      fkErrors.testId = "Please choose a valid test";
    }
    if (await missingFk("Package", data.packageId)) {
      fkErrors.packageId = "Please choose a valid package";
    }
    if (await missingFk("Offer", data.offerId)) {
      fkErrors.offerId = "Please choose a valid offer";
    }
    if (Object.keys(fkErrors).length) {
      return validationError({
        message: "Please check your booking details and try again",
        errors: fkErrors,
      });
    }

    const id = newId();
    await sqlExec(
      `INSERT INTO \`Booking\`
         (\`id\`, \`name\`, \`phone\`, \`email\`, \`address\`, \`preferredDate\`, \`preferredTime\`,
          \`notes\`, \`status\`, \`testId\`, \`packageId\`, \`offerId\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        id,
        data.name,
        data.phone,
        data.email || null,
        data.address || null,
        data.preferredDate,
        data.preferredTime,
        data.notes || null,
        data.testId || null,
        data.packageId || null,
        data.offerId || null,
      ],
    );

    const booking = {
      id,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address || "",
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      notes: data.notes || "",
      testId: data.testId,
      packageId: data.packageId,
      offerId: data.offerId,
    };

    const labMail = await sendBookingNotification(booking);
    const patientMail = await sendPatientBookingConfirmation(booking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking saved",
        data: {
          id,
          email: {
            labNotified: labMail.sent,
            patientNotified: patientMail.sent,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const msg = String(error.message || "");
    // Surface CHECK constraint failures as 400 rather than a server error.
    if (/CK_Booking_|Check constraint|CONSTRAINT/i.test(msg)) {
      return validationError({
        message: "Please check your details and try again",
      });
    }
    return apiErrorResponse(error, "Failed to save booking", 500, "POST /api/bookings");
  }
}

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const bookings = await sqlQuery(
      `SELECT \`id\`, \`name\`, \`phone\`, \`email\`, \`address\`, \`preferredDate\`,
              \`preferredTime\`, \`notes\`, \`status\`, \`testId\`, \`packageId\`,
              \`offerId\`, \`createdAt\`
         FROM \`Booking\`
        ORDER BY \`createdAt\` DESC`,
    );
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load bookings", 500, "GET /api/bookings");
  }
}
