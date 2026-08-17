import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, sqlExec, sqlOne, sqlQuery, toBool } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const whereClause = activeOnly ? "WHERE c.`isActive` = 1" : "";

    const rows = await sqlQuery(
      `SELECT c.\`id\`, c.\`label\`, c.\`slug\`, c.\`imageUrl\` AS \`image\`,
              c.\`isActive\`, c.\`sortOrder\`,
              (SELECT COUNT(*) FROM \`CategoryTest\` ct WHERE ct.\`categoryId\` = c.\`id\`) AS \`testCount\`
         FROM \`Category\` c
         ${whereClause}
        ORDER BY c.\`sortOrder\`, c.\`label\``,
    );

    return NextResponse.json({
      success: true,
      data: rows.map((r) => ({ ...r, isActive: toBool(r.isActive) })),
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load categories", 500);
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

    const clash = await sqlOne(
      "SELECT `id` FROM `Category` WHERE `slug` = ? OR `id` = ? LIMIT 1",
      [slug, id],
    );
    if (clash) {
      return NextResponse.json(
        { success: false, message: "Category slug or id already exists" },
        { status: 409 },
      );
    }

    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(
      `INSERT INTO \`Category\` (\`id\`, \`label\`, \`slug\`, \`imageUrl\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        label,
        slug,
        imageUrl ? String(imageUrl).trim() : null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Category created", data: { id, slug } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create category", 500);
  }
}
