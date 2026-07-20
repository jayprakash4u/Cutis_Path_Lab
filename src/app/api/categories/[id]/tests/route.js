import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

/**
 * Replace all tests linked to a disease category.
 * Body: { testIds: string[] }
 */
export async function PUT(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const categoryId = String(id || "").trim();
    const body = await request.json();
    const testIds = Array.isArray(body.testIds)
      ? body.testIds.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const exists = await sqlJson(`
      SELECT id FROM dbo.Category WHERE id = ${escapeSql(categoryId)} FOR JSON PATH
    `);
    if (!exists.length) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const lines = [
      `DELETE FROM dbo.CategoryTest WHERE categoryId = ${escapeSql(categoryId)};`,
    ];
    testIds.forEach((testId, i) => {
      lines.push(`
IF EXISTS (SELECT 1 FROM dbo.Test WHERE id = ${escapeSql(testId)})
INSERT INTO dbo.CategoryTest (categoryId, testId, sortOrder)
VALUES (${escapeSql(categoryId)}, ${escapeSql(testId)}, ${i});
`.trim());
    });

    await sqlExec(lines.join("\n"));

    return NextResponse.json({
      success: true,
      message: "Category tests updated",
      data: { id: categoryId, count: testIds.length },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update category tests", 500);
  }
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const categoryId = String(id || "").trim();

    const tests = await sqlJson(`
      SELECT t.id, t.code, t.name, t.category,
             CAST(t.price AS decimal(10,2)) AS price
      FROM dbo.CategoryTest ct
      INNER JOIN dbo.Test t ON t.id = ct.testId
      WHERE ct.categoryId = ${escapeSql(categoryId)}
      ORDER BY ct.sortOrder, t.name
      FOR JSON PATH
    `);

    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load category tests", 500);
  }
}
