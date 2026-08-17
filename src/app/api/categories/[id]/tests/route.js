import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { sqlOne, sqlQuery, sqlTransaction } from "@/lib/mysql";

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

    const exists = await sqlOne("SELECT `id` FROM `Category` WHERE `id` = ? LIMIT 1", [
      categoryId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const linked = await sqlTransaction(async (tx) => {
      await tx.exec("DELETE FROM `CategoryTest` WHERE `categoryId` = ?", [categoryId]);

      let count = 0;
      for (let i = 0; i < testIds.length; i += 1) {
        // Skip ids that no longer exist rather than failing the whole request.
        const test = await tx.one("SELECT `id` FROM `Test` WHERE `id` = ? LIMIT 1", [
          testIds[i],
        ]);
        if (!test) continue;
        await tx.exec(
          "INSERT INTO `CategoryTest` (`categoryId`, `testId`, `sortOrder`) VALUES (?, ?, ?)",
          [categoryId, testIds[i], i],
        );
        count += 1;
      }
      return count;
    });

    return NextResponse.json({
      success: true,
      message: "Category tests updated",
      data: { id: categoryId, count: linked },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update category tests", 500);
  }
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const categoryId = String(id || "").trim();

    const tests = await sqlQuery(
      `SELECT t.\`id\`, t.\`code\`, t.\`name\`, t.\`category\`, t.\`price\`
         FROM \`CategoryTest\` ct
         INNER JOIN \`Test\` t ON t.\`id\` = ct.\`testId\`
        WHERE ct.\`categoryId\` = ?
        ORDER BY ct.\`sortOrder\`, t.\`name\``,
      [categoryId],
    );

    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load category tests", 500);
  }
}
