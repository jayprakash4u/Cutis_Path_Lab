import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { numOrNull, replacePackageIncludes } from "@/lib/adminSql";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";

function normalizePackage(row) {
  let includes = row.includes;
  if (typeof includes === "string") {
    try {
      includes = JSON.parse(includes);
    } catch {
      includes = [];
    }
  }
  if (!Array.isArray(includes)) includes = [];

  return {
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
    includes: includes.map((item) =>
      typeof item === "string" ? item : item.testName || item.name || "",
    ),
    includeItems: includes.map((item) => ({
      testName: item.testName || item.name || "",
      testId: item.testId || null,
      price: item.price ?? null,
      category: item.category || null,
      code: item.code || null,
    })),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 100)
        : null;
    const topClause = limit ? `TOP ${limit}` : "";

    const rows = await sqlJson(`
      SELECT ${topClause} p.id, p.code, p.name, p.category, p.description,
             CAST(p.price AS decimal(10,2)) AS price,
             CAST(p.originalPrice AS decimal(10,2)) AS originalPrice,
             p.imageUrl, p.reportsTime, p.fasting, p.sampleType,
             (
               SELECT pt.testName, pt.testId, pt.sortOrder
               FROM dbo.PackageTest pt
               WHERE pt.packageId = p.id
               ORDER BY pt.sortOrder
               FOR JSON PATH
             ) AS includes
      FROM dbo.Package p
      ORDER BY TRY_CAST(p.id AS INT), p.name
      FOR JSON PATH
    `);

    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    return NextResponse.json(
      { success: true, data: list.map(normalizePackage) },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load packages", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    const price = Number(body.price);

    if (!code || !name || !category || !Number.isFinite(price)) {
      return NextResponse.json(
        { success: false, message: "code, name, category, and price are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    const description = body.description ? String(body.description).trim() : null;
    const originalPrice = body.originalPrice != null ? Number(body.originalPrice) : null;
    const imageUrl = body.imageUrl || body.image || null;
    const reportsTime = body.reportsTime || "24-48 hrs";
    const fasting = body.fasting || "10-12 hrs";
    const sampleType = body.sampleType || "Blood";

    await sqlExec(`
      IF EXISTS (SELECT 1 FROM dbo.Package WHERE id = ${escapeSql(id)} OR code = ${escapeSql(code)})
      BEGIN
        RAISERROR('Package code or id already exists', 16, 1);
        RETURN;
      END
      INSERT INTO dbo.Package
        (id, code, name, category, description, price, originalPrice, imageUrl, reportsTime, fasting, sampleType)
      VALUES
        (${escapeSql(id)}, ${escapeSql(code)}, ${escapeSql(name)}, ${escapeSql(category)},
         ${description ? escapeSql(description) : "NULL"},
         ${numOrNull(price)}, ${numOrNull(originalPrice)},
         ${imageUrl ? escapeSql(String(imageUrl).trim()) : "NULL"},
         ${escapeSql(reportsTime)}, ${escapeSql(fasting)}, ${escapeSql(sampleType)});
    `);

    if (body.includes) {
      await replacePackageIncludes(id, body.includes);
    }

    return NextResponse.json(
      { success: true, message: "Package created", data: { id, code } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create package", 500);
  }
}
