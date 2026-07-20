import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { numOrNull, replacePackageIncludes } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const packageId = String(id || "").trim();
    if (!packageId) {
      return NextResponse.json(
        { success: false, message: "Package id is required" },
        { status: 400 },
      );
    }

    const rows = await sqlJson(`
      SELECT p.id, p.code, p.name, p.category, p.description,
             CAST(p.price AS decimal(10,2)) AS price,
             CAST(p.originalPrice AS decimal(10,2)) AS originalPrice,
             p.imageUrl, p.reportsTime, p.fasting, p.sampleType,
             (
               SELECT pt.testName, pt.testId, pt.sortOrder,
                      t.name AS linkedName, t.code, t.category,
                      CAST(t.price AS decimal(10,2)) AS price
               FROM dbo.PackageTest pt
               LEFT JOIN dbo.Test t ON t.id = pt.testId
               WHERE pt.packageId = p.id
               ORDER BY pt.sortOrder
               FOR JSON PATH
             ) AS includes
      FROM dbo.Package p
      WHERE p.id = ${escapeSql(packageId)}
      FOR JSON PATH
    `);

    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 },
      );
    }

    const row = list[0];
    let includes = row.includes;
    if (typeof includes === "string") {
      try {
        includes = JSON.parse(includes);
      } catch {
        includes = [];
      }
    }
    if (!Array.isArray(includes)) includes = [];

    const includeItems = includes.map((item) => ({
      testName: item.testName || item.linkedName || "",
      testId: item.testId || null,
      name: item.linkedName || item.testName || "",
      code: item.code || null,
      category: item.category || "Package",
      price: item.price ?? null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        code: row.code,
        name: row.name,
        category: row.category,
        description: row.description,
        price: row.price,
        originalPrice: row.originalPrice,
        image: row.imageUrl,
        imageUrl: row.imageUrl,
        reportsTime: row.reportsTime || "24-48 hrs",
        fasting: row.fasting || "10-12 hrs",
        sampleType: row.sampleType || "Blood",
        includes: includeItems.map((i) => i.testName),
        includeItems,
        tests: includeItems
          .filter((i) => i.testId)
          .map((i) => ({
            id: i.testId,
            name: i.name,
            category: i.category,
            price: i.price,
            code: i.code,
          })),
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load package", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const packageId = String(id || "").trim();
    const body = await request.json();

    const sets = [];
    if (body.code != null) sets.push(`code = ${escapeSql(String(body.code).trim())}`);
    if (body.name != null) sets.push(`name = ${escapeSql(String(body.name).trim())}`);
    if (body.category != null) {
      sets.push(`category = ${escapeSql(String(body.category).trim())}`);
    }
    if (body.description !== undefined) {
      const v = body.description ? String(body.description).trim() : null;
      sets.push(`description = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.price != null) sets.push(`price = ${numOrNull(body.price)}`);
    if (body.originalPrice !== undefined) {
      sets.push(`originalPrice = ${numOrNull(body.originalPrice)}`);
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      sets.push(`imageUrl = ${v ? escapeSql(String(v).trim()) : "NULL"}`);
    }
    if (body.reportsTime != null) {
      sets.push(`reportsTime = ${escapeSql(String(body.reportsTime).trim())}`);
    }
    if (body.fasting != null) sets.push(`fasting = ${escapeSql(String(body.fasting).trim())}`);
    if (body.sampleType != null) {
      sets.push(`sampleType = ${escapeSql(String(body.sampleType).trim())}`);
    }
    sets.push("updatedAt = SYSUTCDATETIME()");

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Package WHERE id = ${escapeSql(packageId)})
      BEGIN
        RAISERROR('Package not found', 16, 1);
        RETURN;
      END
      ${sets.length > 1 ? `UPDATE dbo.Package SET ${sets.join(", ")} WHERE id = ${escapeSql(packageId)};` : ""}
    `);

    if (body.includes !== undefined) {
      await replacePackageIncludes(packageId, body.includes);
    }

    return NextResponse.json({
      success: true,
      message: "Package updated",
      data: { id: packageId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update package", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const packageId = String(id || "").trim();

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Package WHERE id = ${escapeSql(packageId)})
      BEGIN
        RAISERROR('Package not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Booking SET packageId = NULL WHERE packageId = ${escapeSql(packageId)};
      UPDATE dbo.Offer SET packageId = NULL WHERE packageId = ${escapeSql(packageId)};
      DELETE FROM dbo.PackageTest WHERE packageId = ${escapeSql(packageId)};
      DELETE FROM dbo.Package WHERE id = ${escapeSql(packageId)};
    `);

    return NextResponse.json({
      success: true,
      message: "Package deleted",
      data: { id: packageId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete package", 500);
  }
}
