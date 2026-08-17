import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr, toNumOrNull } from "@/lib/adminSql";
import { sqlExec, sqlOne, toBool } from "@/lib/mysql";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const offerId = String(id || "").trim();

    const row = await sqlOne(
      `SELECT \`id\`, \`name\`, \`category\`, \`originalPrice\`, \`discountedPrice\`,
              \`discountPercent\` AS \`discount\`, \`isActive\`,
              \`reportsTime\`, \`fasting\`, \`sampleType\`, \`packageId\`, \`testId\`, \`sortOrder\`
         FROM \`Offer\` WHERE \`id\` = ? LIMIT 1`,
      [offerId],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row, isActive: toBool(row.isActive) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load offer", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const offerId = String(id || "").trim();
    const body = await request.json();

    const fields = {};
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.category != null) fields.category = String(body.category).trim();
    if (body.originalPrice != null) {
      fields.originalPrice = toNumOrNull(body.originalPrice);
    }
    if (body.discountedPrice != null) {
      fields.discountedPrice = toNumOrNull(body.discountedPrice);
    }
    if (body.discount != null || body.discountPercent != null) {
      fields.discountPercent = toIntOr(body.discount ?? body.discountPercent);
    }
    if (body.reportsTime != null) fields.reportsTime = String(body.reportsTime).trim();
    if (body.fasting != null) fields.fasting = String(body.fasting).trim();
    if (body.sampleType != null) fields.sampleType = String(body.sampleType).trim();
    if (body.packageId !== undefined) {
      fields.packageId = body.packageId ? String(body.packageId).trim() : null;
    }
    if (body.testId !== undefined) {
      fields.testId = body.testId ? String(body.testId).trim() : null;
    }
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const exists = await sqlOne("SELECT `id` FROM `Offer` WHERE `id` = ? LIMIT 1", [
      offerId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`Offer\` SET ${clause} WHERE \`id\` = ?`, [...values, offerId]);

    return NextResponse.json({
      success: true,
      message: "Offer updated",
      data: { id: offerId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update offer", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const offerId = String(id || "").trim();

    const exists = await sqlOne("SELECT `id` FROM `Offer` WHERE `id` = ? LIMIT 1", [
      offerId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 },
      );
    }

    // Booking.offerId is ON DELETE SET NULL.
    await sqlExec("DELETE FROM `Offer` WHERE `id` = ?", [offerId]);

    return NextResponse.json({
      success: true,
      message: "Offer deleted",
      data: { id: offerId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete offer", 500);
  }
}
