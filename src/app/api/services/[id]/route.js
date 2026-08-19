import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne } from "@/lib/mysql";
import { SERVICE_COLUMNS, normalizeService } from "@/lib/serviceRows";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const serviceId = String(id || "").trim();

    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: "Service id is required" },
        { status: 400 },
      );
    }

    const row = await sqlOne(
      `SELECT ${SERVICE_COLUMNS} FROM \`Service\` WHERE \`id\` = ? LIMIT 1`,
      [serviceId],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: normalizeService(row) });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load service", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const serviceId = String(id || "").trim();
    const body = await request.json();

    const fields = {};
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.description !== undefined) {
      fields.description = body.description ? String(body.description).trim() : null;
    }
    if (body.longDescription !== undefined) {
      fields.longDescription = body.longDescription
        ? String(body.longDescription).trim()
        : null;
    }
    if (body.category != null) fields.category = String(body.category).trim();
    if (body.iconKey !== undefined || body.icon !== undefined) {
      const v = body.iconKey ?? body.icon;
      fields.iconKey = v ? String(v).trim() : null;
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl ?? body.image;
      fields.imageUrl = v ? String(v).trim() : null;
    }
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const exists = await sqlOne("SELECT `id` FROM `Service` WHERE `id` = ? LIMIT 1", [
      serviceId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`Service\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      serviceId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Service updated",
      data: { id: serviceId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update service", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const serviceId = String(id || "").trim();

    const exists = await sqlOne("SELECT `id` FROM `Service` WHERE `id` = ? LIMIT 1", [
      serviceId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `Service` WHERE `id` = ?", [serviceId]);

    return NextResponse.json({
      success: true,
      message: "Service deleted",
      data: { id: serviceId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete service", 500);
  }
}
