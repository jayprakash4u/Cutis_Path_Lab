import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { apiErrorResponse } from "@/lib/apiError";
import { sqlExec, sqlOne } from "@/lib/mysql";
import { bookingStatusSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

export async function GET(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const bookingId = String(id || "").trim();

    const row = await sqlOne(
      `SELECT \`id\`, \`name\`, \`phone\`, \`email\`, \`address\`, \`preferredDate\`,
              \`preferredTime\`, \`notes\`, \`status\`, \`testId\`, \`packageId\`,
              \`offerId\`, \`createdAt\`
         FROM \`Booking\` WHERE \`id\` = ? LIMIT 1`,
      [bookingId],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    return apiErrorResponse(
      error,
      "Failed to load booking",
      500,
      "GET /api/bookings/[id]",
    );
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const bookingId = String(id || "").trim();
    const body = await request.json();

    const parsed = parseOrErrors(bookingStatusSchema, {
      status: String(body.status || "").trim().toLowerCase(),
    });
    if (!parsed.ok) {
      return validationError({ message: parsed.message, errors: parsed.errors });
    }

    const { status } = parsed.data;

    const exists = await sqlOne("SELECT `id` FROM `Booking` WHERE `id` = ? LIMIT 1", [
      bookingId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    await sqlExec("UPDATE `Booking` SET `status` = ? WHERE `id` = ?", [
      status,
      bookingId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Booking status updated",
      data: { id: bookingId, status },
    });
  } catch (error) {
    return apiErrorResponse(
      error,
      "Failed to update booking",
      500,
      "PATCH /api/bookings/[id]",
    );
  }
}
