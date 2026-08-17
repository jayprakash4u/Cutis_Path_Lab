import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, sqlQuery, toBool } from "@/lib/mysql";

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

    const row = await sqlOne(
      `SELECT \`id\`, \`label\`, \`slug\`, \`imageUrl\` AS \`image\`, \`isActive\`, \`sortOrder\`
         FROM \`Category\` WHERE \`id\` = ? LIMIT 1`,
      [String(id || "").trim()],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const category = { ...row, isActive: toBool(row.isActive) };

    if (includeTests) {
      const tests = await sqlQuery(
        `SELECT t.\`id\`, t.\`code\`, t.\`name\`, t.\`category\`, t.\`price\`
           FROM \`CategoryTest\` ct
           INNER JOIN \`Test\` t ON t.\`id\` = ct.\`testId\`
          WHERE ct.\`categoryId\` = ?
          ORDER BY ct.\`sortOrder\`, t.\`name\``,
        [category.id],
      );
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

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `Category` WHERE `id` = ? LIMIT 1",
      [categoryId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const fields = {};
    if (body.label != null) fields.label = String(body.label).trim();
    if (body.slug != null) fields.slug = String(body.slug).trim();
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
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

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`Category\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      categoryId,
    ]);

    const oldImageUrl = existing.imageUrl;
    const newImageUrl = fields.imageUrl;
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

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `Category` WHERE `id` = ? LIMIT 1",
      [categoryId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    // CategoryTest rows cascade with the category.
    await sqlExec("DELETE FROM `Category` WHERE `id` = ?", [categoryId]);
    await removeLocalCategoryImage(existing.imageUrl);

    return NextResponse.json({
      success: true,
      message: "Category deleted",
      data: { id: categoryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete category", 500);
  }
}
