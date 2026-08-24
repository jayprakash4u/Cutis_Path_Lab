import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlQuery, toBool } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";
    const whereClause = activeOnly ? "WHERE `isActive` = 1" : "";
    const isAdmin = !requireAdmin(request);

    const rows = await sqlQuery(
      `SELECT \`id\`, \`name\`, \`specialization\`, \`hospital\`, \`quote\`,
              \`imageUrl\` AS \`image\`, \`isActive\`, \`sortOrder\`, \`createdAt\`
         FROM \`ReferralDoctor\`
         ${whereClause}
        ORDER BY \`sortOrder\`, \`name\`
        ${limitClause}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: rows.map((r) => ({ ...r, isActive: toBool(r.isActive) })),
      },
      isAdmin ? undefined : publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(
      error,
      "Failed to load referral doctors",
      500,
      "GET /api/referrals",
    );
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const specialization = String(body.specialization || "").trim();
    const quote = String(body.quote || "").trim();

    if (!name || !specialization || !quote) {
      return NextResponse.json(
        { success: false, message: "name, specialization, and quote are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(
      `INSERT INTO \`ReferralDoctor\`
         (\`id\`, \`name\`, \`specialization\`, \`hospital\`, \`quote\`, \`imageUrl\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        specialization,
        body.hospital ? String(body.hospital).trim() : null,
        quote,
        imageUrl ? String(imageUrl).trim() : null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Referral doctor added", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to add referral doctor", 500);
  }
}
