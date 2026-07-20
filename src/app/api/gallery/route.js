import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 200)
        : null;

    let where = "1=1";
    if (activeOnly) where += " AND isActive = 1";
    const topClause = limit ? `TOP ${limit}` : "";

    const rows = await sqlJson(`
      SELECT ${topClause}
        id, title, caption, imageUrl AS image, altText, isActive, sortOrder, createdAt
      FROM dbo.GalleryImage
      WHERE ${where}
      ORDER BY sortOrder, createdAt DESC
      FOR JSON PATH
    `);

    return NextResponse.json({ success: true, data: rows });
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
    const title = body.title ? String(body.title).trim() : null;
    const caption = body.caption ? String(body.caption).trim() : null;
    const altText = body.altText ? String(body.altText).trim() : null;

    await sqlExec(`
      INSERT INTO dbo.GalleryImage
        (id, title, caption, imageUrl, altText, isActive, sortOrder)
      VALUES
        (${escapeSql(id)},
         ${title ? escapeSql(title) : "NULL"},
         ${caption ? escapeSql(caption) : "NULL"},
         ${escapeSql(imageUrl)},
         ${altText ? escapeSql(altText) : "NULL"},
         ${bit(body.isActive !== false)},
         ${intOr(body.sortOrder, 0)});
    `);

    return NextResponse.json(
      { success: true, message: "Gallery image added", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to add gallery image", 500);
  }
}
