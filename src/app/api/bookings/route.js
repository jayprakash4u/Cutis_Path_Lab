import { NextResponse } from "next/server";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";
import {
  sendBookingNotification,
  sendPatientBookingConfirmation,
} from "@/lib/mail";
import { requireAdmin } from "@/lib/adminAuth";
import { bookingCreateSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

async function assertOptionalFk(table, id, label) {
  if (!id) return null;
  const rows = await sqlJson(`
    SELECT id FROM dbo.${table} WHERE id = ${escapeSql(id)} FOR JSON PATH
  `);
  if (!rows.length) {
    return `${label} does not exist`;
  }
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();

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
      return validationError({
        message: parsed.message,
        errors: parsed.errors,
      });
    }

    const data = parsed.data;

    const fkErrors = {};
    const testErr = await assertOptionalFk("Test", data.testId, "selected test");
    if (testErr) fkErrors.testId = "Please choose a valid test";
    const pkgErr = await assertOptionalFk("Package", data.packageId, "selected package");
    if (pkgErr) fkErrors.packageId = "Please choose a valid package";
    const offerErr = await assertOptionalFk("Offer", data.offerId, "selected offer");
    if (offerErr) fkErrors.offerId = "Please choose a valid offer";
    if (Object.keys(fkErrors).length) {
      return validationError({
        message: "Please check your booking details and try again",
        errors: fkErrors,
      });
    }

    const id = newId();
    await sqlExec(`
      INSERT INTO dbo.Booking
        (id, name, phone, email, address, preferredDate, preferredTime, notes, status, testId, packageId, offerId)
      VALUES
        (${escapeSql(id)}, ${escapeSql(data.name)}, ${escapeSql(data.phone)},
         ${data.email ? escapeSql(data.email) : "NULL"},
         ${data.address ? escapeSql(data.address) : "NULL"},
         ${escapeSql(data.preferredDate)},
         ${escapeSql(data.preferredTime)},
         ${data.notes ? escapeSql(data.notes) : "NULL"},
         N'pending',
         ${data.testId ? escapeSql(data.testId) : "NULL"},
         ${data.packageId ? escapeSql(data.packageId) : "NULL"},
         ${data.offerId ? escapeSql(data.offerId) : "NULL"});
    `);

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
    console.error("POST /api/bookings", error);
    const msg = String(error.message || "");
    // Surface DB CHECK constraint failures as 400
    if (/CK_Booking_|CHECK constraint/i.test(msg)) {
      return validationError({
        message: "Please check your details and try again",
      });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save booking" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const bookings = await sqlJson(`
      SELECT id, name, phone, email, address, preferredDate, preferredTime,
             notes, status, testId, packageId, offerId, createdAt
      FROM dbo.Booking
      ORDER BY createdAt DESC
      FOR JSON PATH
    `);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("GET /api/bookings", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load bookings" },
      { status: 500 },
    );
  }
}
