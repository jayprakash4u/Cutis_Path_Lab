import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const rows = await sqlJson(`
      SELECT id, name, role, content, rating, imageUrl AS image, featured, isActive, sortOrder
      FROM dbo.Testimonial
      WHERE id = ${escapeSql(String(id || "").trim())}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load testimonial" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testimonialId = String(id || "").trim();
    const body = await request.json();
    const sets = [];

    if (body.name != null) sets.push(`name = ${escapeSql(String(body.name).trim())}`);
    if (body.role !== undefined) {
      const v = body.role ? String(body.role).trim() : null;
      sets.push(`role = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.content != null) sets.push(`content = ${escapeSql(String(body.content).trim())}`);
    if (body.rating != null) sets.push(`rating = ${intOr(body.rating, 5)}`);
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      sets.push(`imageUrl = ${v ? escapeSql(String(v).trim()) : "NULL"}`);
    }
    if (body.featured !== undefined) sets.push(`featured = ${bit(Boolean(body.featured))}`);
    if (body.isActive !== undefined) sets.push(`isActive = ${bit(Boolean(body.isActive))}`);
    if (body.sortOrder != null) sets.push(`sortOrder = ${intOr(body.sortOrder)}`);

    if (sets.length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Testimonial WHERE id = ${escapeSql(testimonialId)})
      BEGIN
        RAISERROR('Testimonial not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Testimonial SET ${sets.join(", ")} WHERE id = ${escapeSql(testimonialId)};
    `);

    return NextResponse.json({
      success: true,
      message: "Testimonial updated",
      data: { id: testimonialId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update testimonial" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testimonialId = String(id || "").trim();
    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Testimonial WHERE id = ${escapeSql(testimonialId)})
      BEGIN
        RAISERROR('Testimonial not found', 16, 1);
        RETURN;
      END
      DELETE FROM dbo.Testimonial WHERE id = ${escapeSql(testimonialId)};
    `);
    return NextResponse.json({
      success: true,
      message: "Testimonial deleted",
      data: { id: testimonialId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete testimonial" },
      { status: 500 },
    );
  }
}
