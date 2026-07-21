import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr, numOrNull } from "@/lib/adminSql";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 100)
        : null;

    let where = "1=1";
    if (activeOnly) where += " AND isActive = 1";
    const topClause = limit ? `TOP ${limit}` : "";

    const offers = await sqlJson(`
      SELECT ${topClause} id, name, category,
             CAST(originalPrice AS decimal(10,2)) AS originalPrice,
             CAST(discountedPrice AS decimal(10,2)) AS discountedPrice,
             discountPercent AS discount, isActive,
             reportsTime, fasting, sampleType, packageId, testId, sortOrder
      FROM dbo.Offer
      WHERE ${where}
      ORDER BY sortOrder, name
      FOR JSON PATH
    `);

    return NextResponse.json(
      { success: true, data: offers },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load offers", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    const originalPrice = Number(body.originalPrice);
    const discountedPrice = Number(body.discountedPrice);

    if (!name || !category || !Number.isFinite(originalPrice) || !Number.isFinite(discountedPrice)) {
      return NextResponse.json(
        {
          success: false,
          message: "name, category, originalPrice, and discountedPrice are required",
        },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    let discount =
      body.discount != null
        ? Number(body.discount)
        : Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    if (!Number.isFinite(discount)) discount = 0;

    await sqlExec(`
      INSERT INTO dbo.Offer
        (id, name, category, originalPrice, discountedPrice, discountPercent,
         reportsTime, fasting, sampleType, packageId, testId, isActive, sortOrder)
      VALUES
        (${escapeSql(id)}, ${escapeSql(name)}, ${escapeSql(category)},
         ${numOrNull(originalPrice)}, ${numOrNull(discountedPrice)}, ${intOr(discount)},
         ${escapeSql(body.reportsTime || "24 hrs")},
         ${escapeSql(body.fasting || "10-12 hrs")},
         ${escapeSql(body.sampleType || "Blood")},
         ${body.packageId ? escapeSql(String(body.packageId).trim()) : "NULL"},
         ${body.testId ? escapeSql(String(body.testId).trim()) : "NULL"},
         ${bit(body.isActive !== false)},
         ${intOr(body.sortOrder, 0)});
    `);

    return NextResponse.json(
      { success: true, message: "Offer created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create offer", 500);
  }
}
