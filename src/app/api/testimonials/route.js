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

    const featured = searchParams.get("featured");
    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 100)
        : null;

    let where = "1=1";
    if (activeOnly) where += " AND isActive = 1";
    if (featured === "true") where += " AND featured = 1";
    const topClause = limit ? `TOP ${limit}` : "";

    const rows = await sqlJson(`
      SELECT ${topClause} id, name, role, content, rating,
             imageUrl AS image, featured, isActive, sortOrder
      FROM dbo.Testimonial
      WHERE ${where}
      ORDER BY sortOrder, name
      FOR JSON PATH
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load testimonials", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const content = String(body.content || "").trim();
    if (!name || !content) {
      return NextResponse.json(
        { success: false, message: "name and content are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    const role = body.role ? String(body.role).trim() : null;
    const rating = Number.isFinite(Number(body.rating)) ? Number(body.rating) : 5;
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(`
      INSERT INTO dbo.Testimonial
        (id, name, role, content, rating, imageUrl, featured, isActive, sortOrder)
      VALUES
        (${escapeSql(id)}, ${escapeSql(name)},
         ${role ? escapeSql(role) : "NULL"},
         ${escapeSql(content)},
         ${intOr(rating, 5)},
         ${imageUrl ? escapeSql(String(imageUrl).trim()) : "NULL"},
         ${bit(body.featured !== false)},
         ${bit(body.isActive !== false)},
         ${intOr(body.sortOrder, 0)});
    `);

    return NextResponse.json(
      { success: true, message: "Testimonial created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create testimonial", 500);
  }
}
