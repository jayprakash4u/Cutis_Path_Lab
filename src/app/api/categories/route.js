import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    let where = "1=1";
    if (activeOnly) where += " AND isActive = 1";

    const rows = await sqlJson(`
      SELECT c.id, c.label, c.slug, c.imageUrl AS image, c.isActive, c.sortOrder,
             (SELECT COUNT(*) FROM dbo.CategoryTest ct WHERE ct.categoryId = c.id) AS testCount
      FROM dbo.Category c
      WHERE ${where}
      ORDER BY c.sortOrder, c.label
      FOR JSON PATH
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/categories", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load categories" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const label = String(body.label || "").trim();
    let slug = String(body.slug || "").trim();
    if (!label) {
      return NextResponse.json(
        { success: false, message: "label is required" },
        { status: 400 },
      );
    }
    if (!slug) {
      slug = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const id = String(body.id || newId()).trim();
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(`
      IF EXISTS (SELECT 1 FROM dbo.Category WHERE slug = ${escapeSql(slug)} OR id = ${escapeSql(id)})
      BEGIN
        RAISERROR('Category slug or id already exists', 16, 1);
        RETURN;
      END
      INSERT INTO dbo.Category (id, label, slug, imageUrl, isActive, sortOrder)
      VALUES (
        ${escapeSql(id)}, ${escapeSql(label)}, ${escapeSql(slug)},
        ${imageUrl ? escapeSql(String(imageUrl).trim()) : "NULL"},
        ${bit(body.isActive !== false)},
        ${intOr(body.sortOrder, 0)}
      );
    `);

    return NextResponse.json(
      { success: true, message: "Category created", data: { id, slug } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/categories", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create category" },
      { status: 500 },
    );
  }
}
