import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, toBool } from "@/lib/mysql";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    const row = await sqlOne(
      `SELECT \`id\`, \`name\`, \`role\`, \`content\`, \`rating\`,
              \`imageUrl\` AS \`image\`, \`featured\`, \`isActive\`, \`sortOrder\`
         FROM \`Testimonial\` WHERE \`id\` = ? LIMIT 1`,
      [String(id || "").trim()],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row, featured: toBool(row.featured), isActive: toBool(row.isActive) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load testimonial", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testimonialId = String(id || "").trim();
    const body = await request.json();

    const fields = {};
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.role !== undefined) {
      fields.role = body.role ? String(body.role).trim() : null;
    }
    if (body.content != null) fields.content = String(body.content).trim();
    if (body.rating != null) fields.rating = toIntOr(body.rating, 5);
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      fields.imageUrl = v ? String(v).trim() : null;
    }
    if (body.featured !== undefined) fields.featured = toBit(body.featured);
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const exists = await sqlOne(
      "SELECT `id` FROM `Testimonial` WHERE `id` = ? LIMIT 1",
      [testimonialId],
    );
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`Testimonial\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      testimonialId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Testimonial updated",
      data: { id: testimonialId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update testimonial", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testimonialId = String(id || "").trim();

    const exists = await sqlOne(
      "SELECT `id` FROM `Testimonial` WHERE `id` = ? LIMIT 1",
      [testimonialId],
    );
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `Testimonial` WHERE `id` = ?", [testimonialId]);

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted",
      data: { id: testimonialId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete testimonial", 500);
  }
}
