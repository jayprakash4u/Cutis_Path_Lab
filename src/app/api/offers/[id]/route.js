import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr, numOrNull } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const offerId = String(id || "").trim();
    const rows = await sqlJson(`
      SELECT id, name, category,
             CAST(originalPrice AS decimal(10,2)) AS originalPrice,
             CAST(discountedPrice AS decimal(10,2)) AS discountedPrice,
             discountPercent AS discount, isActive,
             reportsTime, fasting, sampleType, packageId, testId, sortOrder
      FROM dbo.Offer
      WHERE id = ${escapeSql(offerId)}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
  } catch (error) {
    console.error("GET /api/offers/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load offer" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const offerId = String(id || "").trim();
    const body = await request.json();
    const sets = [];

    if (body.name != null) sets.push(`name = ${escapeSql(String(body.name).trim())}`);
    if (body.category != null) {
      sets.push(`category = ${escapeSql(String(body.category).trim())}`);
    }
    if (body.originalPrice != null) {
      sets.push(`originalPrice = ${numOrNull(body.originalPrice)}`);
    }
    if (body.discountedPrice != null) {
      sets.push(`discountedPrice = ${numOrNull(body.discountedPrice)}`);
    }
    if (body.discount != null || body.discountPercent != null) {
      sets.push(`discountPercent = ${intOr(body.discount ?? body.discountPercent)}`);
    }
    if (body.reportsTime != null) {
      sets.push(`reportsTime = ${escapeSql(String(body.reportsTime).trim())}`);
    }
    if (body.fasting != null) sets.push(`fasting = ${escapeSql(String(body.fasting).trim())}`);
    if (body.sampleType != null) {
      sets.push(`sampleType = ${escapeSql(String(body.sampleType).trim())}`);
    }
    if (body.packageId !== undefined) {
      sets.push(
        `packageId = ${body.packageId ? escapeSql(String(body.packageId).trim()) : "NULL"}`,
      );
    }
    if (body.testId !== undefined) {
      sets.push(`testId = ${body.testId ? escapeSql(String(body.testId).trim()) : "NULL"}`);
    }
    if (body.isActive !== undefined) sets.push(`isActive = ${bit(Boolean(body.isActive))}`);
    if (body.sortOrder != null) sets.push(`sortOrder = ${intOr(body.sortOrder)}`);
    sets.push("updatedAt = SYSUTCDATETIME()");

    if (sets.length <= 1) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Offer WHERE id = ${escapeSql(offerId)})
      BEGIN
        RAISERROR('Offer not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Offer SET ${sets.join(", ")} WHERE id = ${escapeSql(offerId)};
    `);

    return NextResponse.json({ success: true, message: "Offer updated", data: { id: offerId } });
  } catch (error) {
    console.error("PATCH /api/offers/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update offer" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const offerId = String(id || "").trim();

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Offer WHERE id = ${escapeSql(offerId)})
      BEGIN
        RAISERROR('Offer not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Booking SET offerId = NULL WHERE offerId = ${escapeSql(offerId)};
      DELETE FROM dbo.Offer WHERE id = ${escapeSql(offerId)};
    `);

    return NextResponse.json({ success: true, message: "Offer deleted", data: { id: offerId } });
  } catch (error) {
    console.error("DELETE /api/offers/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete offer" },
      { status: 500 },
    );
  }
}
