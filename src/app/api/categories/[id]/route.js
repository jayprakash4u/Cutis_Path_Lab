import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

async function removeLocalCategoryImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/images/categories/")) return;

  const filename = path.basename(imageUrl);
  if (!filename || filename.includes("..")) return;

  const filePath = path.join(process.cwd(), "public", "images", "categories", filename);
  await unlink(filePath).catch(() => {});
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeTests = searchParams.get("include") === "tests";

    const rows = await sqlJson(`
      SELECT id, label, slug, imageUrl AS image, isActive, sortOrder
      FROM dbo.Category
      WHERE id = ${escapeSql(String(id || "").trim())}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const category = list[0];
    if (includeTests) {
      const tests = await sqlJson(`
        SELECT t.id, t.code, t.name, t.category,
               CAST(t.price AS decimal(10,2)) AS price
        FROM dbo.CategoryTest ct
        INNER JOIN dbo.Test t ON t.id = ct.testId
        WHERE ct.categoryId = ${escapeSql(category.id)}
        ORDER BY ct.sortOrder, t.name
        FOR JSON PATH
      `);
      category.tests = tests;
      category.testIds = tests.map((t) => t.id);
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load category", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const categoryId = String(id || "").trim();
    const body = await request.json();
    const sets = [];

    let oldImageUrl = null;
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const existing = await sqlJson(`
        SELECT imageUrl FROM dbo.Category WHERE id = ${escapeSql(categoryId)} FOR JSON PATH
      `);
      oldImageUrl = existing?.[0]?.imageUrl || null;
    }

    if (body.label != null) sets.push(`label = ${escapeSql(String(body.label).trim())}`);
    if (body.slug != null) sets.push(`slug = ${escapeSql(String(body.slug).trim())}`);
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      sets.push(`imageUrl = ${v ? escapeSql(String(v).trim()) : "NULL"}`);
    }
    if (body.isActive !== undefined) sets.push(`isActive = ${bit(Boolean(body.isActive))}`);
    if (body.sortOrder != null) sets.push(`sortOrder = ${intOr(body.sortOrder)}`);

    if (sets.length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE id = ${escapeSql(categoryId)})
      BEGIN
        RAISERROR('Category not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Category SET ${sets.join(", ")} WHERE id = ${escapeSql(categoryId)};
    `);

    const newImageUrl = body.imageUrl || body.image;
    if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
      await removeLocalCategoryImage(oldImageUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Category updated",
      data: { id: categoryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update category", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const categoryId = String(id || "").trim();

    const rows = await sqlJson(`
      SELECT imageUrl FROM dbo.Category WHERE id = ${escapeSql(categoryId)} FOR JSON PATH
    `);
    const imageUrl = rows?.[0]?.imageUrl;

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE id = ${escapeSql(categoryId)})
      BEGIN
        RAISERROR('Category not found', 16, 1);
        RETURN;
      END
      IF OBJECT_ID('dbo.CategoryTest', 'U') IS NOT NULL
        DELETE FROM dbo.CategoryTest WHERE categoryId = ${escapeSql(categoryId)};
      DELETE FROM dbo.Category WHERE id = ${escapeSql(categoryId)};
    `);

    await removeLocalCategoryImage(imageUrl);

    return NextResponse.json({
      success: true,
      message: "Category deleted",
      data: { id: categoryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete category", 500);
  }
}
