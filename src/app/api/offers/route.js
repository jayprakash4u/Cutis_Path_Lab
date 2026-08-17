import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlQuery, toBool } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";
    const whereClause = activeOnly ? "WHERE `isActive` = 1" : "";

    const rows = await sqlQuery(
      `SELECT \`id\`, \`name\`, \`category\`, \`originalPrice\`, \`discountedPrice\`,
              \`discountPercent\` AS \`discount\`, \`isActive\`,
              \`reportsTime\`, \`fasting\`, \`sampleType\`, \`packageId\`, \`testId\`, \`sortOrder\`
         FROM \`Offer\`
         ${whereClause}
        ORDER BY \`sortOrder\`, \`name\`
        ${limitClause}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: rows.map((r) => ({ ...r, isActive: toBool(r.isActive) })),
      },
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

    if (
      !name ||
      !category ||
      !Number.isFinite(originalPrice) ||
      !Number.isFinite(discountedPrice)
    ) {
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

    await sqlExec(
      `INSERT INTO \`Offer\`
         (\`id\`, \`name\`, \`category\`, \`originalPrice\`, \`discountedPrice\`, \`discountPercent\`,
          \`reportsTime\`, \`fasting\`, \`sampleType\`, \`packageId\`, \`testId\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        category,
        originalPrice,
        discountedPrice,
        toIntOr(discount),
        body.reportsTime || "24 hrs",
        body.fasting || "10-12 hrs",
        body.sampleType || "Blood",
        body.packageId ? String(body.packageId).trim() : null,
        body.testId ? String(body.testId).trim() : null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Offer created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create offer", 500);
  }
}
