import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlQuery, toBool } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const limit = safeLimit(searchParams.get("limit"), 200);
    const limitClause = limit ? `LIMIT ${limit}` : "";
    const whereClause = activeOnly ? "WHERE `isActive` = 1" : "";

    const rows = await sqlQuery(
      `SELECT \`id\`, \`title\`, \`caption\`, \`imageUrl\` AS \`image\`, \`altText\`,
              \`isActive\`, \`sortOrder\`, \`createdAt\`
         FROM \`GalleryImage\`
         ${whereClause}
        ORDER BY \`sortOrder\`, \`createdAt\` DESC
        ${limitClause}`,
    );

    return NextResponse.json({
      success: true,
      data: rows.map((r) => ({ ...r, isActive: toBool(r.isActive) })),
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load gallery", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const imageUrl = String(body.imageUrl || body.image || "").trim();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "imageUrl is required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();

    await sqlExec(
      `INSERT INTO \`GalleryImage\`
         (\`id\`, \`title\`, \`caption\`, \`imageUrl\`, \`altText\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.title ? String(body.title).trim() : null,
        body.caption ? String(body.caption).trim() : null,
        imageUrl,
        body.altText ? String(body.altText).trim() : null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Gallery image added", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to add gallery image", 500);
  }
}
