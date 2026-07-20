import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";
import { bookingStatusSchema } from "@/lib/validation/booking";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const bookingId = String(id || "").trim();
    const rows = await sqlJson(`
      SELECT id, name, phone, email, address, preferredDate, preferredTime,
             notes, status, testId, packageId, offerId, createdAt
      FROM dbo.Booking
      WHERE id = ${escapeSql(bookingId)}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load booking" },
      { status: 500 },
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
      return validationError({
        message: parsed.message,
        errors: parsed.errors,
      });
    }

    const { status } = parsed.data;

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Booking WHERE id = ${escapeSql(bookingId)})
      BEGIN
        RAISERROR('Booking not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Booking
      SET status = ${escapeSql(status)}, updatedAt = SYSUTCDATETIME()
      WHERE id = ${escapeSql(bookingId)};
    `);

    return NextResponse.json({
      success: true,
      message: "Booking status updated",
      data: { id: bookingId, status },
    });
  } catch (error) {
    console.error("PATCH /api/bookings/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update booking" },
      { status: 500 },
    );
  }
}
