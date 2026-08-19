import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne } from "@/lib/mysql";

/** Items are scoped to their section, so a wrong key is a 404, not a silent edit. */
async function findItem(sectionKey, itemId) {
  return sqlOne(
    "SELECT `id` FROM `HomeSectionItem` WHERE `id` = ? AND `sectionKey` = ? LIMIT 1",
    [itemId, sectionKey],
  );
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { key, itemId } = await params;
    const sectionKey = String(key || "").trim();
    const id = String(itemId || "").trim();
    const body = await request.json();

    const exists = await findItem(sectionKey, id);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    const text = (value) => (value ? String(value).trim() : null);

    const fields = {};
    if (body.title != null) fields.title = String(body.title).trim();
    if (body.description !== undefined) fields.description = text(body.description);
    if (body.badge !== undefined) fields.badge = text(body.badge);
    if (body.note !== undefined) fields.note = text(body.note);
    if (body.iconKey !== undefined) fields.iconKey = text(body.iconKey);
    if (body.imageUrl !== undefined) fields.imageUrl = text(body.imageUrl);
    if (body.mobileImageUrl !== undefined) {
      fields.mobileImageUrl = text(body.mobileImageUrl);
    }
    if (body.linkUrl !== undefined) fields.linkUrl = text(body.linkUrl);
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`HomeSectionItem\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Item updated",
      data: { id },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update item", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { key, itemId } = await params;
    const sectionKey = String(key || "").trim();
    const id = String(itemId || "").trim();

    const exists = await findItem(sectionKey, id);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `HomeSectionItem` WHERE `id` = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Item deleted",
      data: { id },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete item", 500);
  }
}
